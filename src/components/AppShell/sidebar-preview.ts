'use client';

import {createContext, useEffect, useRef, useState, type PointerEvent, type RefObject} from 'react';

type SidebarToggleContext = {
    id: string | undefined;
    open: boolean;
    pinned: boolean;
    triggerRef: RefObject<HTMLButtonElement | null>;
    enter: (event: PointerEvent) => void;
    leave: () => void;
    toggle: () => void;
};

export const AppShellSidebarContext = createContext<SidebarToggleContext | null>(null);

export function useSidebarPreview(enabled: boolean) {
    const [open, setOpen] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const insideEvents = useRef(new WeakSet<Event>());
    const focused = useRef<EventTarget | null>(null);
    const cancel = () => {if (timer.current !== null) {clearTimeout(timer.current); timer.current = null;}};
    const close = () => {cancel(); setOpen(false);};
    const enter = (event: PointerEvent) => {
        if (!enabled || event.pointerType !== 'mouse') return;
        cancel();
        timer.current = setTimeout(() => {timer.current = null; setOpen(true);}, 120);
    };
    const keep = () => cancel();
    const leave = () => {
        if (!enabled) return;
        cancel();
        timer.current = setTimeout(() => {
            timer.current = null;
            if (!sidebarRef.current?.contains(document.activeElement) && focused.current !== document.activeElement) setOpen(false);
        }, 220);
    };

    useEffect(() => {
        if (!enabled) {
            if (timer.current !== null) clearTimeout(timer.current);
            timer.current = null;
            setOpen(false);
        }
    }, [enabled]);
    useEffect(() => () => {if (timer.current !== null) clearTimeout(timer.current);}, []);
    useEffect(() => {
        if (!enabled || !open) return;
        const dismiss = (event: globalThis.PointerEvent) => {
            if (insideEvents.current.has(event)) return;
            const target = event.target as Node | null;
            if (target && !sidebarRef.current?.contains(target) && !triggerRef.current?.contains(target)) setOpen(false);
        };
        const escape = (event: KeyboardEvent) => {
            if (event.key !== 'Escape' || event.defaultPrevented) return;
            if (sidebarRef.current?.contains(document.activeElement)) triggerRef.current?.focus();
            setOpen(false);
        };
        document.addEventListener('pointerdown', dismiss);
        document.addEventListener('keydown', escape);
        return () => {document.removeEventListener('pointerdown', dismiss); document.removeEventListener('keydown', escape);};
    }, [enabled, open]);

    return {open: enabled && open, sidebarRef, triggerRef, enter, keep, leave, close,
        protect: (event: {nativeEvent: Event}) => insideEvents.current.add(event.nativeEvent),
        focus: (event: {target: EventTarget}) => {focused.current = event.target; cancel();}};
}
