'use client';

import {useCallback, useEffect, useRef} from 'react';

export function useTypeahead(
    onMatch: (query: string) => void,
    timeoutMs = 650,
) {
    const bufferRef = useRef('');
    const timerRef = useRef<number | null>(null);

    useEffect(
        () => () => {
            if (timerRef.current !== null) {
                window.clearTimeout(timerRef.current);
            }
        },
        [],
    );

    return useCallback(
        (key: string) => {
            if (key.length !== 1) return;
            bufferRef.current = `${bufferRef.current}${key}`.toLowerCase();
            if (timerRef.current !== null) window.clearTimeout(timerRef.current);
            timerRef.current = window.setTimeout(() => {
                bufferRef.current = '';
                timerRef.current = null;
            }, timeoutMs);
            onMatch(bufferRef.current);
        },
        [onMatch, timeoutMs],
    );
}
