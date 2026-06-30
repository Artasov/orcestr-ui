'use client';

import {useCallback, useState} from 'react';

export function useControllableState<T>({
    value,
    defaultValue,
    onChange,
}: {
    value?: T;
    defaultValue: T;
    onChange?: (value: T) => void;
}) {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const isControlled = value !== undefined;
    const currentValue = isControlled ? (value as T) : internalValue;

    const setValue = useCallback(
        (next: T | ((current: T) => T)) => {
            const actual =
                typeof next === 'function'
                    ? (next as (current: T) => T)(currentValue)
                    : next;
            if (!isControlled) setInternalValue(actual);
            onChange?.(actual);
        },
        [currentValue, isControlled, onChange],
    );

    return [currentValue, setValue] as const;
}
