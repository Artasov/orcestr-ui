'use client';

import { useEffect, useRef, useState } from 'react';

export function usePresence(open: boolean, durationMs = 220) {
    const [present, setPresent] = useState(open);
    const [state, setState] = useState<'opening' | 'open' | 'closed' | 'closing'>(
        open ? 'open' : 'closed',
    );
    const previousOpenRef = useRef(open);

    useEffect(() => {
        if (previousOpenRef.current === open) return;
        previousOpenRef.current = open;

        let frame = 0;
        let timer = 0;

        if (open) {
            setState('opening');
            setPresent(true);
            frame = window.requestAnimationFrame(() => {
                timer = window.setTimeout(() => setState('open'), durationMs);
            });
            return () => {
                window.cancelAnimationFrame(frame);
                window.clearTimeout(timer);
            };
        }

        setState('closing');
        frame = window.requestAnimationFrame(() => {
            timer = window.setTimeout(() => {
                setPresent(false);
                setState('closed');
            }, durationMs);
        });
        return () => {
            window.cancelAnimationFrame(frame);
            window.clearTimeout(timer);
        };
    }, [durationMs, open]);

    return { present, state };
}
