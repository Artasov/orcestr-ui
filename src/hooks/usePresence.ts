'use client';

import {useEffect, useState} from 'react';

export function usePresence(open: boolean, durationMs = 220) {
    const [present, setPresent] = useState(open);
    const [state, setState] = useState<'opening' | 'open' | 'closed' | 'closing'>(
        open ? 'open' : 'closed',
    );

    useEffect(() => {
        let frame = 0;
        let timer = 0;

        if (open) {
            frame = window.requestAnimationFrame(() => {
                setPresent(true);
                setState('opening');
                timer = window.setTimeout(() => setState('open'), durationMs);
            });
            return () => {
                window.cancelAnimationFrame(frame);
                window.clearTimeout(timer);
            };
        }

        if (!present) return;

        frame = window.requestAnimationFrame(() => {
            setState('closing');
            timer = window.setTimeout(() => {
                setPresent(false);
                setState('closed');
            }, durationMs);
        });
        return () => {
            window.cancelAnimationFrame(frame);
            window.clearTimeout(timer);
        };
    }, [durationMs, open, present]);

    return {present, state};
}
