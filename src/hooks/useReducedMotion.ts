'use client';

import { useSyncExternalStore } from 'react';

const reducedMotionQuery = '(prefers-reduced-motion: reduce)';

export function useReducedMotion() {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function subscribe(onChange: () => void) {
    const media = window.matchMedia(reducedMotionQuery);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
}

function getSnapshot() {
    return window.matchMedia(reducedMotionQuery).matches;
}

function getServerSnapshot() {
    return false;
}
