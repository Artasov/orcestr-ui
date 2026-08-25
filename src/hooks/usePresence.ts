'use client';

import { useEffect, useRef, useState } from 'react';

export function usePresence(open: boolean, durationMs = 220) {
    const [present, setPresent] = useState(open);
    const [state, setState] = useState<'opening' | 'open' | 'closed' | 'closing'>(
        open ? 'opening' : 'closed',
    );
    const presentRef = useRef(open);

    useEffect(() => {
        const ownerWindow = window;
        let frame = 0;
        let timer = 0;
        let disposed = false;

        if (open) {
            presentRef.current = true;
            setState('opening');
            setPresent(true);
            frame = ownerWindow.requestAnimationFrame(() => {
                if (disposed) return;
                timer = ownerWindow.setTimeout(() => setState('open'), durationMs);
            });
            return () => {
                disposed = true;
                ownerWindow.cancelAnimationFrame(frame);
                ownerWindow.clearTimeout(timer);
            };
        }

        if (!presentRef.current) {
            setState('closed');
            return;
        }

        setState('closing');
        frame = ownerWindow.requestAnimationFrame(() => {
            if (disposed) return;
            timer = ownerWindow.setTimeout(() => {
                if (disposed) return;
                presentRef.current = false;
                setPresent(false);
                setState('closed');
            }, durationMs);
        });
        return () => {
            disposed = true;
            ownerWindow.cancelAnimationFrame(frame);
            ownerWindow.clearTimeout(timer);
        };
    }, [durationMs, open]);

    return { present, state };
}
