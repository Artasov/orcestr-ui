'use client';

import {
    useCallback,
    useLayoutEffect,
    useRef,
    useState,
    type CSSProperties,
    type RefObject,
} from 'react';

export type FloatingSide = 'top' | 'right' | 'bottom' | 'left';
export type FloatingAlign = 'start' | 'center' | 'end';

export function useFloatingPosition({
    triggerRef,
    contentRef,
    open,
    side = 'bottom',
    align = 'start',
    sideOffset = 8,
    collisionPadding = 8,
    matchTriggerWidth = false,
}: {
    triggerRef: RefObject<HTMLElement | null>;
    contentRef: RefObject<HTMLElement | null>;
    open: boolean;
    side?: FloatingSide;
    align?: FloatingAlign;
    sideOffset?: number;
    collisionPadding?: number;
    matchTriggerWidth?: boolean;
}) {
    const [style, setStyle] = useState<CSSProperties>({
        position: 'fixed',
        left: -9999,
        top: -9999,
        visibility: 'hidden',
    });
    const frameRef = useRef<number | null>(null);

    const update = useCallback(() => {
        const trigger = triggerRef.current;
        const content = contentRef.current;
        if (!trigger || !content) return;
        const triggerRect = trigger.getBoundingClientRect();
        const contentRect = content.getBoundingClientRect();
        const viewportW = window.innerWidth;
        const viewportH = window.innerHeight;
        const contentWidth = matchTriggerWidth
            ? Math.max(contentRect.width, triggerRect.width)
            : contentRect.width;
        const contentHeight = contentRect.height;

        let left = triggerRect.left;
        let top = triggerRect.bottom + sideOffset;
        let actualSide = side;

        if (side === 'bottom' && triggerRect.bottom + contentHeight + sideOffset > viewportH - collisionPadding) {
            actualSide = 'top';
        } else if (side === 'top' && triggerRect.top - contentHeight - sideOffset < collisionPadding) {
            actualSide = 'bottom';
        } else if (side === 'right' && triggerRect.right + contentWidth + sideOffset > viewportW - collisionPadding) {
            actualSide = 'left';
        } else if (side === 'left' && triggerRect.left - contentWidth - sideOffset < collisionPadding) {
            actualSide = 'right';
        }

        if (actualSide === 'bottom') top = triggerRect.bottom + sideOffset;
        if (actualSide === 'top') top = triggerRect.top - contentHeight - sideOffset;
        if (actualSide === 'right') {
            left = triggerRect.right + sideOffset;
            top = triggerRect.top;
        }
        if (actualSide === 'left') {
            left = triggerRect.left - contentWidth - sideOffset;
            top = triggerRect.top;
        }
        if (actualSide === 'top' || actualSide === 'bottom') {
            if (align === 'center') {
                left =
                    triggerRect.left + triggerRect.width / 2 - contentWidth / 2;
            } else if (align === 'end') {
                left = triggerRect.right - contentWidth;
            }
        } else if (align === 'center') {
            top = triggerRect.top + triggerRect.height / 2 - contentHeight / 2;
        } else if (align === 'end') {
            top = triggerRect.bottom - contentHeight;
        }

        left = Math.min(
            Math.max(collisionPadding, left),
            Math.max(collisionPadding, viewportW - contentWidth - collisionPadding),
        );
        top = Math.min(
            Math.max(collisionPadding, top),
            Math.max(collisionPadding, viewportH - contentHeight - collisionPadding),
        );

        setStyle({
            position: 'fixed',
            left,
            top,
            minWidth: matchTriggerWidth ? triggerRect.width : undefined,
            maxWidth: `calc(100vw - ${collisionPadding * 2}px)`,
            maxHeight: `calc(100vh - ${collisionPadding * 2}px)`,
            visibility: 'visible',
            transformOrigin: transformOriginFor(actualSide, align),
        });
    }, [
        align,
        collisionPadding,
        contentRef,
        matchTriggerWidth,
        side,
        sideOffset,
        triggerRef,
    ]);

    const scheduleUpdate = useCallback(() => {
        if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
        frameRef.current = window.requestAnimationFrame(() => {
            frameRef.current = null;
            update();
        });
    }, [update]);

    useLayoutEffect(() => {
        if (!open) return;
        scheduleUpdate();
        const trigger = triggerRef.current;
        const content = contentRef.current;
        const observer =
            typeof ResizeObserver === 'undefined'
                ? null
                : new ResizeObserver(() => scheduleUpdate());
        if (trigger) observer?.observe(trigger);
        if (content) observer?.observe(content);
        window.addEventListener('resize', scheduleUpdate);
        window.addEventListener('scroll', scheduleUpdate, true);
        return () => {
            if (frameRef.current !== null) {
                window.cancelAnimationFrame(frameRef.current);
                frameRef.current = null;
            }
            observer?.disconnect();
            window.removeEventListener('resize', scheduleUpdate);
            window.removeEventListener('scroll', scheduleUpdate, true);
        };
    }, [contentRef, open, scheduleUpdate, triggerRef]);

    return {style, update: scheduleUpdate};
}

function transformOriginFor(side: FloatingSide, align: FloatingAlign): string {
    const cross =
        align === 'start' ? 'left' : align === 'end' ? 'right' : 'center';
    const vertical =
        align === 'start' ? 'top' : align === 'end' ? 'bottom' : 'center';
    if (side === 'bottom') return `${cross} top`;
    if (side === 'top') return `${cross} bottom`;
    if (side === 'right') return `left ${vertical}`;
    return `right ${vertical}`;
}
