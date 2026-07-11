'use client';

import {
    useCallback,
    useLayoutEffect,
    useRef,
    useState,
    type CSSProperties,
    type RefObject,
} from 'react';

import { scheduleFloatingUpdates, subscribeFloatingUpdates } from './floatingScheduler';

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
    avoidCollisions = true,
}: {
    triggerRef: RefObject<HTMLElement | null>;
    contentRef: RefObject<HTMLElement | null>;
    open: boolean;
    side?: FloatingSide;
    align?: FloatingAlign;
    sideOffset?: number;
    collisionPadding?: number;
    matchTriggerWidth?: boolean;
    avoidCollisions?: boolean;
}) {
    const [style, setStyle] = useState<CSSProperties>({
        position: 'fixed',
        left: -9999,
        top: -9999,
        visibility: 'hidden',
    });
    const updateRef = useRef<() => void>(() => undefined);

    const update = useCallback(() => {
        const trigger = triggerRef.current;
        const content = contentRef.current;
        if (!trigger || !content) return;
        const triggerRect = trigger.getBoundingClientRect();
        const contentRect = content.getBoundingClientRect();
        const ownerWindow = trigger.ownerDocument.defaultView ?? window;
        const clippingRect = getClippingRect(trigger, ownerWindow);
        const contentWidth = matchTriggerWidth
            ? Math.max(contentRect.width, triggerRect.width)
            : contentRect.width;
        const contentHeight = contentRect.height;
        const isRtl = window.getComputedStyle(trigger).direction === 'rtl';

        let left = triggerRect.left;
        let top = triggerRect.bottom + sideOffset;
        let actualSide = side;

        if (
            avoidCollisions &&
            side === 'bottom' &&
            triggerRect.bottom + contentHeight + sideOffset > clippingRect.bottom - collisionPadding
        ) {
            actualSide = 'top';
        } else if (
            avoidCollisions &&
            side === 'top' &&
            triggerRect.top - contentHeight - sideOffset < clippingRect.top + collisionPadding
        ) {
            actualSide = 'bottom';
        } else if (
            avoidCollisions &&
            side === 'right' &&
            triggerRect.right + contentWidth + sideOffset > clippingRect.right - collisionPadding
        ) {
            actualSide = 'left';
        } else if (
            avoidCollisions &&
            side === 'left' &&
            triggerRect.left - contentWidth - sideOffset < clippingRect.left + collisionPadding
        ) {
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
                left = triggerRect.left + triggerRect.width / 2 - contentWidth / 2;
            } else if (align === 'end') {
                left = isRtl ? triggerRect.left : triggerRect.right - contentWidth;
            } else {
                left = isRtl ? triggerRect.right - contentWidth : triggerRect.left;
            }
        } else if (align === 'center') {
            top = triggerRect.top + triggerRect.height / 2 - contentHeight / 2;
        } else if (align === 'end') {
            top = triggerRect.bottom - contentHeight;
        }

        if (avoidCollisions) {
            left = Math.min(
                Math.max(clippingRect.left + collisionPadding, left),
                Math.max(
                    clippingRect.left + collisionPadding,
                    clippingRect.right - contentWidth - collisionPadding,
                ),
            );
            top = Math.min(
                Math.max(clippingRect.top + collisionPadding, top),
                Math.max(
                    clippingRect.top + collisionPadding,
                    clippingRect.bottom - contentHeight - collisionPadding,
                ),
            );
        }

        setStyle({
            position: 'fixed',
            left,
            top,
            minWidth: matchTriggerWidth ? contentWidth : undefined,
            maxWidth: avoidCollisions
                ? Math.max(0, clippingRect.right - clippingRect.left - collisionPadding * 2)
                : undefined,
            maxHeight: avoidCollisions
                ? Math.max(0, clippingRect.bottom - clippingRect.top - collisionPadding * 2)
                : undefined,
            visibility: rectsIntersect(triggerRect, clippingRect) ? 'visible' : 'hidden',
            transformOrigin: transformOriginFor(actualSide, align, isRtl),
        });
    }, [
        align,
        avoidCollisions,
        collisionPadding,
        contentRef,
        matchTriggerWidth,
        side,
        sideOffset,
        triggerRef,
    ]);
    updateRef.current = update;

    const scheduleUpdate = useCallback(() => {
        const ownerDocument =
            triggerRef.current?.ownerDocument ?? contentRef.current?.ownerDocument;
        if (ownerDocument) scheduleFloatingUpdates(ownerDocument);
        else updateRef.current();
    }, [contentRef, triggerRef]);

    useLayoutEffect(() => {
        if (!open) return;
        const trigger = triggerRef.current;
        const content = contentRef.current;
        if (!trigger || !content) return;
        return subscribeFloatingUpdates(trigger.ownerDocument, [trigger, content], () =>
            updateRef.current(),
        );
    }, [contentRef, open, triggerRef]);

    return { style, update: scheduleUpdate };
}

function transformOriginFor(side: FloatingSide, align: FloatingAlign, isRtl: boolean): string {
    const leftAligned = (align === 'start' && !isRtl) || (align === 'end' && isRtl);
    const cross = align === 'center' ? 'center' : leftAligned ? 'left' : 'right';
    const vertical = align === 'start' ? 'top' : align === 'end' ? 'bottom' : 'center';
    if (side === 'bottom') return `${cross} top`;
    if (side === 'top') return `${cross} bottom`;
    if (side === 'right') return `left ${vertical}`;
    return `right ${vertical}`;
}

function getClippingRect(element: HTMLElement, view: Window) {
    const rect = { left: 0, top: 0, right: view.innerWidth, bottom: view.innerHeight };
    let ancestor = element.parentElement;
    while (ancestor && ancestor !== element.ownerDocument.body) {
        const style = view.getComputedStyle(ancestor);
        if (clipsOverflow(style.overflowX) || clipsOverflow(style.overflowY)) {
            const ancestorRect = ancestor.getBoundingClientRect();
            rect.left = Math.max(rect.left, ancestorRect.left);
            rect.top = Math.max(rect.top, ancestorRect.top);
            rect.right = Math.min(rect.right, ancestorRect.right);
            rect.bottom = Math.min(rect.bottom, ancestorRect.bottom);
        }
        ancestor = ancestor.parentElement;
    }
    return rect;
}

function clipsOverflow(value: string) {
    return value === 'auto' || value === 'scroll' || value === 'hidden' || value === 'clip';
}

function rectsIntersect(
    rect: Pick<DOMRect, 'bottom' | 'left' | 'right' | 'top'>,
    clippingRect: { bottom: number; left: number; right: number; top: number },
) {
    return (
        rect.right > clippingRect.left &&
        rect.left < clippingRect.right &&
        rect.bottom > clippingRect.top &&
        rect.top < clippingRect.bottom
    );
}
