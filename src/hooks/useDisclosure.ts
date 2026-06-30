'use client';

import {useCallback} from 'react';

import {useControllableState} from './useControllableState';

export function useDisclosure({
    open,
    defaultOpen = false,
    onOpenChange,
}: {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
} = {}) {
    const [isOpen, setIsOpen] = useControllableState({
        value: open,
        defaultValue: defaultOpen,
        onChange: onOpenChange,
    });
    const close = useCallback(() => setIsOpen(false), [setIsOpen]);
    const openLayer = useCallback(() => setIsOpen(true), [setIsOpen]);
    const toggle = useCallback(() => setIsOpen((current) => !current), [setIsOpen]);

    return {open: isOpen, setOpen: setIsOpen, close, openLayer, toggle};
}
