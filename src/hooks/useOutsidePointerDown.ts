'use client';

import {useEffect, type RefObject} from 'react';

export function useOutsidePointerDown(
    refs: Array<RefObject<HTMLElement | null>>,
    enabled: boolean,
    onOutside: (event: PointerEvent) => void,
) {
    useEffect(() => {
        if (!enabled) return;
        const handlePointerDown = (event: PointerEvent) => {
            const target = event.target;
            if (!(target instanceof Node)) return;
            const isInside = refs.some((ref) => ref.current?.contains(target));
            if (!isInside) onOutside(event);
        };
        document.addEventListener('pointerdown', handlePointerDown, true);
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown, true);
        };
    }, [enabled, onOutside, refs]);
}
