'use client';

import {useCallback, useMemo, useState} from 'react';

export type ListNavigationItem = {
    value: string;
    disabled?: boolean;
    searchText?: string;
};

export function useListNavigation(
    items: ReadonlyArray<ListNavigationItem>,
    {
        value = null,
    }: {
        value?: string | null;
    } = {},
) {
    const enabledItems = useMemo(() => items.filter((item) => !item.disabled), [items]);
    const [requestedValue, setRequestedValue] = useState<string | null>(null);

    const highlightedValue = useMemo(() => {
        if (
            requestedValue !== null &&
            enabledItems.some((item) => item.value === requestedValue)
        ) {
            return requestedValue;
        }
        if (value !== null && enabledItems.some((item) => item.value === value)) {
            return value;
        }
        return enabledItems[0]?.value ?? null;
    }, [enabledItems, requestedValue, value]);

    const move = useCallback(
        (direction: 1 | -1) => {
            if (enabledItems.length === 0) return;
            const currentIndex = enabledItems.findIndex(
                (item) => item.value === highlightedValue,
            );
            const nextIndex =
                currentIndex === -1
                    ? 0
                    : (currentIndex + direction + enabledItems.length) %
                      enabledItems.length;
            setRequestedValue(enabledItems[nextIndex]?.value ?? null);
        },
        [enabledItems, highlightedValue],
    );

    const first = useCallback(() => {
        setRequestedValue(enabledItems[0]?.value ?? null);
    }, [enabledItems]);

    const last = useCallback(() => {
        setRequestedValue(enabledItems.at(-1)?.value ?? null);
    }, [enabledItems]);

    const reset = useCallback(() => {
        setRequestedValue(null);
    }, []);

    return {
        highlightedValue,
        setHighlightedValue: setRequestedValue,
        move,
        first,
        last,
        reset,
        enabledItems,
    };
}
