import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('../..', import.meta.url));

function read(path: string): string {
    return readFileSync(`${root}/${path}`, 'utf8');
}

test('OverlayProvider exposes portal container, z-index stack and scroll lock', () => {
    const source = read('components/Overlay/OverlayProvider.tsx');
    assert.match(source, /portalContainer/);
    assert.match(source, /useOverlayLayerIndex/);
    assert.match(source, /overlayLayerZIndex/);
    assert.match(source, /DROPDOWN_LAYER_OFFSET/);
    assert.match(source, /optimisticIndex/);
    assert.match(source, /function createOverlayManager/);
    assert.match(source, /manager\.layers/);
    assert.doesNotMatch(source, /const layerIds|let scrollLockCount/);
    assert.match(source, /lockOverlayScroll/);
    assert.match(source, /scrollLocks: Map<Document/);
    assert.match(source, /paddingRight/);
    assert.match(source, /function isIOS/);
});

test('Modal uses focus trap, Escape close, outside click and scroll lock', () => {
    const source = read('components/Modal/Modal.tsx');
    assert.match(source, /useFocusTrap\(contentRef, open && overlayContext\.portalReady/);
    assert.match(source, /overlayContext\.lockScroll/);
    assert.match(source, /closeOnOverlayClick/);
    assert.match(source, /onPointerDown/);
    assert.match(source, /aria-modal=["\']true["\']/);
    assert.match(source, /useOverlayLayerIndex\(present\)/);
});

test('Modal root stays layout-free and renders only explicit children', () => {
    const source = read('components/Modal/Modal.tsx');
    const propsBlock = source.match(/export type ModalProps = \{[\s\S]*?\n\};/)?.[0] ?? '';
    const rootBody = source.match(/function ModalRoot\([\s\S]*?\n\}/)?.[0] ?? '';

    assert.doesNotMatch(propsBlock, /\btitle\?/);
    assert.doesNotMatch(propsBlock, /\bdescription\?/);
    assert.doesNotMatch(propsBlock, /\bfooter\?/);
    assert.doesNotMatch(propsBlock, /\bbodyClassName\?/);
    assert.doesNotMatch(rootBody, /oui-modal-header/);
    assert.doesNotMatch(rootBody, /oui-modal-footer/);
});

test('Dialog content stays layout-free and renders only explicit children', () => {
    const source = read('components/Dialog/Dialog.tsx');
    const contentBody = source.match(/function DialogContent\([\s\S]*?\n\}/)?.[0] ?? '';

    assert.doesNotMatch(contentBody, /DialogTitle|DialogDescription|DialogClose/);
    assert.doesNotMatch(contentBody, /Modal\.Header|Modal\.Footer|Modal\.Close/);
    assert.doesNotMatch(contentBody, /oui-modal-header|oui-modal-footer/);
});

test('Floating layer keeps dropdowns mounted for exit animation and positions from trigger', () => {
    const source = read('hooks/useFloatingLayer.ts');
    const positionSource = read('hooks/useFloatingPosition.ts');
    assert.match(source, /usePresence\(open, presenceDuration\)/);
    assert.match(source, /useFloatingPosition/);
    assert.match(source, /matchTriggerWidth/);
    assert.match(
        positionSource,
        /contentWidth = matchTriggerWidth[\s\S]*?Math\.max\(contentRect\.width, triggerRect\.width\)/,
    );
    assert.match(positionSource, /minWidth: matchTriggerWidth \? contentWidth : undefined/);
    assert.doesNotMatch(positionSource, /maxHeight:/);
});

test('Dialog content supplies the shared dialog layout surface', () => {
    const source = read('components/Dialog/Dialog.tsx');
    const styles = read('styles/_overlays.sass');

    assert.match(source, /contentClassName=\{cn\('oui-dialog-content', className\)\}/);
    assert.match(styles, /\.oui-dialog-content\s+[\s\S]*?padding: 18px/);
});

test('ScrollArea applies requested scrollbar axis and exposes overflow state', () => {
    const source = read('components/ScrollArea/ScrollArea.tsx');
    const styles = read('styles/_scroll-area.sass');

    assert.match(source, /scrollbars = 'both'/);
    assert.match(source, /type = 'auto'/);
    assert.match(source, /data-scrollbars=\{scrollbars\}/);
    assert.match(source, /data-type=\{type\}/);
    assert.match(source, /data-overflow-y=\{overflow\.y \? 'true' : undefined\}/);
    assert.match(source, /className="oui-scroll-area-content"/);
    assert.match(source, /observer\?\.observe\(contentRef\.current\)/);
    assert.doesNotMatch(source, /MutationObserver/);
    assert.match(styles, /data-scrollbars="vertical"/);
    assert.match(styles, /overflow-x: hidden/);
    assert.match(styles, /scrollbar-color: var\(--oui-scrollbar-thumb/);
    assert.match(
        styles,
        /scrollbar-color: var\(--oui-scrollbar-thumb[\s\S]*?var\(--oui-scrollbar-track, transparent\)/,
    );
    assert.match(styles, /background: var\(--oui-scrollbar-track, transparent\)/);
    assert.match(styles, /background-color: var\(--oui-scrollbar-thumb,/);
    assert.match(styles, /transition: background-color 180ms ease/);
    assert.match(styles, /background-color: var\(--oui-scrollbar-thumb-hover,/);
});

test('Popover uses the passed React trigger without nested interactive wrappers', () => {
    const source = read('components/Popover/Popover.tsx');
    assert.match(source, /cloneElement/);
    assert.match(source, /isValidElement\(trigger\)/);
    assert.match(source, /clonePopoverTrigger/);
    assert.match(source, /role=["\']button["\'][\s\S]*?\{trigger\}/);
    assert.match(source, /matchTriggerWidth\?: boolean/);
});

test('Popover portals carry active theme variables', () => {
    const source = read('components/Popover/Popover.tsx');

    assert.match(source, /OrcestrThemeContext/);
    assert.match(source, /useContext\(OrcestrThemeContext\)/);
    assert.match(source, /data-oui-theme=\{themeContext\?\.mode\}/);
    assert.doesNotMatch(source, /data-oui-surface/);
    assert.match(source, /\.\.\.themeContext\?\.cssVariables/);
});

test('Popover lets content veto outside interaction close', () => {
    const source = read('components/Popover/Popover.tsx');
    assert.match(source, /onInteractOutside\?\.\(event\)/);
    assert.match(source, /event\.defaultPrevented/);
    assert.match(
        source,
        /useOutsidePointerDown\(\[triggerRef, contentRef\], isOpen, handleOutsidePointerDown\)/,
    );
});

test('Focus trap returns focus and handles Escape and Tab loops', () => {
    const source = read('hooks/useFocusTrap.ts');
    assert.match(source, /ownerDocument\.activeElement/);
    assert.match(source, /previous\.focus/);
    assert.match(source, /event.key === 'Escape'/);
    assert.match(source, /event.key !== 'Tab'/);
    assert.match(source, /lastNode.focus/);
    assert.match(source, /addEventListener\('focusin'/);
    assert.match(source, /makeOverlayBackgroundInert/);
});
