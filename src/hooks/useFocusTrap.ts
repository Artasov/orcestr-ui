'use client';

import {useEffect, useRef, type RefObject} from 'react';

const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(',');

export function useFocusTrap(
    ref: RefObject<HTMLElement | null>,
    enabled: boolean,
    onEscape?: () => void,
) {
    const onEscapeRef = useRef(onEscape);

    useEffect(() => {
        onEscapeRef.current = onEscape;
    }, [onEscape]);

    useEffect(() => {
        if (!enabled) return;
        const root = ref.current;
        if (!root) return;
        const previous = document.activeElement as HTMLElement | null;
        const first = root.querySelector<HTMLElement>(focusableSelector);
        first?.focus({preventScroll: true});

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onEscapeRef.current?.();
                return;
            }
            if (event.key !== 'Tab') return;
            const nodes = Array.from(
                root.querySelectorAll<HTMLElement>(focusableSelector),
            ).filter((node) => node.offsetParent !== null);
            if (nodes.length === 0) {
                event.preventDefault();
                return;
            }
            const firstNode = nodes[0];
            const lastNode = nodes[nodes.length - 1];
            if (event.shiftKey && document.activeElement === firstNode) {
                event.preventDefault();
                lastNode.focus();
            } else if (!event.shiftKey && document.activeElement === lastNode) {
                event.preventDefault();
                firstNode.focus();
            }
        };

        root.addEventListener('keydown', handleKeyDown);
        return () => {
            root.removeEventListener('keydown', handleKeyDown);
            previous?.focus?.({preventScroll: true});
        };
    }, [enabled, ref]);
}
