import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('../..', import.meta.url));

function read(path: string): string {
    return readFileSync(`${root}/${path}`, 'utf8');
}

test('OverlayProvider exposes portal container, z-index stack and scroll lock', () => {
    const source = read('components/Overlay/OverlayProvider.tsx');
    assert.match(source, /portalContainer/);
    assert.match(source, /useOverlayLayerIndex/);
    assert.match(source, /layerIds/);
    assert.match(source, /lockOverlayScroll/);
    assert.match(source, /scrollLockCount/);
});

test('Modal uses focus trap, Escape close, outside click and scroll lock', () => {
    const source = read('components/Modal/Modal.tsx');
    assert.match(source, /useFocusTrap\(contentRef, open/);
    assert.match(source, /lockOverlayScroll/);
    assert.match(source, /closeOnOverlayClick/);
    assert.match(source, /onPointerDown/);
    assert.match(source, /aria-modal='true'/);
    assert.match(source, /useOverlayLayerIndex\(present\)/);
});

test('Floating layer keeps dropdowns mounted for exit animation and positions from trigger', () => {
    const source = read('hooks/useFloatingLayer.ts');
    assert.match(source, /usePresence\(open, presenceDuration\)/);
    assert.match(source, /useFloatingPosition/);
    assert.match(source, /matchTriggerWidth/);
});

test('Popover uses the passed React trigger without nested interactive wrappers', () => {
    const source = read('components/Popover/Popover.tsx');
    assert.match(source, /cloneElement/);
    assert.match(source, /isValidElement\(trigger\)/);
    assert.match(source, /clonePopoverTrigger/);
    assert.match(source, /role='button'[\s\S]*?\{trigger\}/);
});

test('Focus trap returns focus and handles Escape and Tab loops', () => {
    const source = read('hooks/useFocusTrap.ts');
    assert.match(source, /document.activeElement/);
    assert.match(source, /previous\?\.focus/);
    assert.match(source, /event.key === 'Escape'/);
    assert.match(source, /event.key !== 'Tab'/);
    assert.match(source, /lastNode.focus/);
});
