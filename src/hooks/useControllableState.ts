'use client';

import { useCallback, useRef, useState } from 'react';

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
    const currentValueRef = useRef(currentValue);
    const isControlledRef = useRef(isControlled);
    const onChangeRef = useRef(onChange);
    currentValueRef.current = currentValue;
    isControlledRef.current = isControlled;
    onChangeRef.current = onChange;

    const setValue = useCallback((next: T | ((current: T) => T)) => {
        const actual =
            typeof next === 'function'
                ? (next as (current: T) => T)(currentValueRef.current)
                : next;
        currentValueRef.current = actual;
        if (!isControlledRef.current) setInternalValue(actual);
        onChangeRef.current?.(actual);
    }, []);

    return [currentValue, setValue] as const;
}
