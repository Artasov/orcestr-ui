'use client';

import {
    useCallback,
    useLayoutEffect,
    useRef,
    useState,
    type CSSProperties,
    type RefObject,
} from 'react';

import { scheduleFloatingUpdates, subscribeFloatingUpdates } from './floatingScheduler.js';
import { floatingSideFit } from './floatingSideFit.js';

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
    collisionBoundary = 'clipping-ancestors',
    avoidTriggerOverlap = false,
    maxContentWidth,
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
    collisionBoundary?: 'clipping-ancestors' | 'viewport';
    avoidTriggerOverlap?: boolean;
    maxContentWidth?: number;
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
        const ownerWindow = trigger.ownerDocument.defaultView ?? window;
        const triggerClippingRect = getClippingRect(trigger, ownerWindow);
        const clippingRect = collisionBoundary === 'viewport'
            ? { left: 0, top: 0, right: ownerWindow.innerWidth, bottom: ownerWindow.innerHeight }
            : triggerClippingRect;
        const availableWidth = avoidCollisions
            ? Math.max(0, clippingRect.right - clippingRect.left - collisionPadding * 2)
            : undefined;
        let maxWidth = maxContentWidth === undefined ? availableWidth
            : Math.min(maxContentWidth, availableWidth ?? maxContentWidth);
        const fitBesideTrigger = avoidCollisions && avoidTriggerOverlap;
        const vertical = side === 'top' || side === 'bottom';
        let maxHeight: number | undefined;
        // Apply wrapping constraints before measuring, so the first visible placement
        // uses the final dimensions rather than moving after ResizeObserver fires.
        content.style.maxWidth = maxWidth === undefined ? '' : `${maxWidth}px`;
        if (fitBesideTrigger) content.style.maxHeight = '';
        let contentSize = floatingLayerSize(content);
        let fittedSide: FloatingSide | undefined;
        if (fitBesideTrigger) {
            const fit = floatingSideFit(side, triggerRect, clippingRect, contentSize, collisionPadding, sideOffset);
            fittedSide = fit.side;
            if (vertical) {
                maxHeight = fit.availableSize;
                content.style.maxHeight = `${maxHeight}px`;
            } else {
                maxWidth = Math.min(maxWidth ?? Infinity, fit.availableSize);
                content.style.maxWidth = `${maxWidth}px`;
            }
            contentSize = floatingLayerSize(content);
        }
        const contentWidth = matchTriggerWidth
            ? Math.max(contentSize.width, triggerRect.width)
            : contentSize.width;
        const contentHeight = contentSize.height;
        const isRtl = window.getComputedStyle(trigger).direction === 'rtl';
        const contentOwnsFocus = content.contains(trigger.ownerDocument.activeElement);

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
        if (fittedSide) actualSide = fittedSide;

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
            if (!fitBesideTrigger || vertical) left = Math.min(
                Math.max(clippingRect.left + collisionPadding, left),
                Math.max(
                    clippingRect.left + collisionPadding,
                    clippingRect.right - contentWidth - collisionPadding,
                ),
            );
            if (!fitBesideTrigger || !vertical) top = Math.min(
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
            maxWidth,
            ...(fitBesideTrigger ? { maxHeight } : {}),
            // A mobile virtual keyboard can shrink the visual viewport enough to move the
            // trigger outside the clipping rect while the user is typing in the floating
            // layer. Hiding a focused layer blurs its input and immediately dismisses the
            // keyboard, so keep it visible for as long as focus remains inside the content.
            visibility: floatingLayerVisibility(triggerRect, triggerClippingRect, contentOwnsFocus),
            transformOrigin: transformOriginFor(actualSide, align, isRtl),
        });
    }, [
        align,
        avoidCollisions,
        avoidTriggerOverlap,
        collisionPadding,
        collisionBoundary,
        maxContentWidth,
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
        update();
        return subscribeFloatingUpdates(trigger.ownerDocument, [trigger, content], () =>
            updateRef.current(),
        );
    }, [contentRef, open, triggerRef, update]);

    return { style, update: scheduleUpdate };
}

/**
 * Measures the layout box rather than the animated visual box. Floating
 * surfaces commonly open with a scale transform; getBoundingClientRect()
 * includes that transform and would move an end- or center-aligned surface
 * while its opening animation is running.
 */
export function floatingLayerSize(
    element: Pick<HTMLElement, 'offsetHeight' | 'offsetWidth' | 'getBoundingClientRect'>,
) {
    const rect = element.getBoundingClientRect();
    return {
        width: element.offsetWidth > 0 ? element.offsetWidth : rect.width,
        height: element.offsetHeight > 0 ? element.offsetHeight : rect.height,
    };
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

export function floatingLayerVisibility(
    triggerRect: Pick<DOMRect, 'bottom' | 'left' | 'right' | 'top'>,
    clippingRect: { bottom: number; left: number; right: number; top: number },
    contentOwnsFocus: boolean,
): CSSProperties['visibility'] {
    return contentOwnsFocus || rectsIntersect(triggerRect, clippingRect) ? 'visible' : 'hidden';
}
