'use client';

import { useSyncExternalStore, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { useOverlayContext } from '../Overlay/OverlayProvider.js';

export function Portal({
    children,
    container,
}: {
    children: ReactNode;
    container?: HTMLElement | null;
}) {
    const mounted = useSyncExternalStore(subscribeMounted, clientMounted, serverMounted);
    const overlay = useOverlayContext();

    if (!mounted) return null;

    const target =
        container !== undefined
            ? (container ?? document.body)
            : (overlay.portalContainer ?? (overlay.portalToBody ? document.body : null));
    if (!target) return null;
    return createPortal(children, target);
}

function subscribeMounted() {
    return () => {};
}

function clientMounted() {
    return true;
}

function serverMounted() {
    return false;
}
