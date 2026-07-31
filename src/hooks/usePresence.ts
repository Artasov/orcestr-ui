'use client';

import { useEffect, useRef, useState } from 'react';

export function usePresence(open: boolean, durationMs = 220) {
    const [present, setPresent] = useState(open);
    const [state, setState] = useState<'opening' | 'open' | 'closed' | 'closing'>(
        open ? 'opening' : 'closed',
    );
    const presentRef = useRef(open);

    useEffect(() => {
        let frame = 0;
        let timer = 0;

        if (open) {
            presentRef.current = true;
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

        if (!presentRef.current) {
            setState('closed');
            return;
        }

        setState('closing');
        frame = window.requestAnimationFrame(() => {
            timer = window.setTimeout(() => {
                presentRef.current = false;
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
