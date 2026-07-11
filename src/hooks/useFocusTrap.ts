'use client';

import { useEffect, useRef, type RefObject } from 'react';

import {
    isTopOverlayFocusLayer,
    makeOverlayBackgroundInert,
    registerOverlayFocusLayer,
    useOverlayManager,
} from '../components/Overlay/OverlayProvider';

const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[contenteditable="true"]',
    '[tabindex]:not([tabindex="-1"])',
].join(',');

export type OpenAutoFocusEvent = {
    preventDefault: () => void;
};

export function useFocusTrap(
    ref: RefObject<HTMLElement | null>,
    enabled: boolean,
    {
        onEscape,
        onOpenAutoFocus,
        modal = true,
    }: {
        onEscape?: () => void;
        onOpenAutoFocus?: (event: OpenAutoFocusEvent) => void;
        modal?: boolean;
    } = {},
) {
    const manager = useOverlayManager();
    const onEscapeRef = useRef(onEscape);
    const onOpenAutoFocusRef = useRef(onOpenAutoFocus);

    onEscapeRef.current = onEscape;
    onOpenAutoFocusRef.current = onOpenAutoFocus;

    useEffect(() => {
        if (!enabled) return;
        const root = ref.current;
        if (!root) return;
        const ownerDocument = root.ownerDocument;
        const previous = ownerDocument.activeElement as HTMLElement | null;
        const id = Symbol('oui-focus-layer');
        const unregisterLayer = registerOverlayFocusLayer(manager, id);
        const restoreBackground = modal
            ? makeOverlayBackgroundInert(manager, root)
            : () => undefined;
        const previousTabIndex = root.getAttribute('tabindex');
        let prevented = false;
        onOpenAutoFocusRef.current?.({
            preventDefault: () => {
                prevented = true;
            },
        });
        if (!prevented) focusFirst(root);

        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isTopOverlayFocusLayer(manager, id) || event.defaultPrevented) return;
            if (event.key === 'Escape') {
                event.preventDefault();
                onEscapeRef.current?.();
                return;
            }
            if (event.key !== 'Tab') return;
            const nodes = focusableNodes(root);
            if (nodes.length === 0) {
                event.preventDefault();
                focusRoot(root);
                return;
            }
            const firstNode = nodes[0];
            const lastNode = nodes[nodes.length - 1];
            const activeElement = ownerDocument.activeElement;
            if (
                event.shiftKey &&
                (activeElement === firstNode || !isAllowedFocusTarget(root, activeElement))
            ) {
                event.preventDefault();
                lastNode.focus();
            } else if (
                !event.shiftKey &&
                (activeElement === lastNode || !isAllowedFocusTarget(root, activeElement))
            ) {
                event.preventDefault();
                firstNode.focus();
            }
        };

        const handleFocusIn = (event: FocusEvent) => {
            if (!isTopOverlayFocusLayer(manager, id)) return;
            if (isAllowedFocusTarget(root, event.target)) return;
            focusFirst(root);
        };

        ownerDocument.addEventListener('keydown', handleKeyDown, true);
        ownerDocument.addEventListener('focusin', handleFocusIn, true);
        return () => {
            ownerDocument.removeEventListener('keydown', handleKeyDown, true);
            ownerDocument.removeEventListener('focusin', handleFocusIn, true);
            restoreBackground();
            unregisterLayer();
            if (previousTabIndex === null) root.removeAttribute('tabindex');
            else root.setAttribute('tabindex', previousTabIndex);
            if (previous?.isConnected) previous.focus({ preventScroll: true });
        };
    }, [enabled, manager, modal, ref]);
}

function focusableNodes(root: HTMLElement) {
    return Array.from(root.querySelectorAll<HTMLElement>(focusableSelector)).filter(
        (node) =>
            !node.hidden &&
            node.getAttribute('aria-hidden') !== 'true' &&
            node.getAttribute('aria-disabled') !== 'true' &&
            !node.closest('[inert]'),
    );
}

function focusFirst(root: HTMLElement) {
    const first = focusableNodes(root)[0];
    if (first) first.focus({ preventScroll: true });
    else focusRoot(root);
}

function focusRoot(root: HTMLElement) {
    if (!root.hasAttribute('tabindex')) root.setAttribute('tabindex', '-1');
    root.focus({ preventScroll: true });
}

function isAllowedFocusTarget(root: HTMLElement, target: EventTarget | null) {
    if (!(target instanceof Node)) return false;
    if (root.contains(target)) return true;
    if (!(target instanceof HTMLElement)) return false;

    const portalRoot = root.closest('.oui-overlay-root');
    if (!portalRoot || target.closest('.oui-overlay-root') !== portalRoot) return false;
    const rootLayer = root.closest<HTMLElement>('[data-oui-layer-index]');
    const targetLayer = target.closest<HTMLElement>('[data-oui-layer-index]');
    if (!rootLayer || !targetLayer) return false;
    return Number(targetLayer.dataset.ouiLayerIndex) > Number(rootLayer.dataset.ouiLayerIndex);
}
