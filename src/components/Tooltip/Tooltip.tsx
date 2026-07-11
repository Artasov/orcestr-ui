'use client';

import {
    cloneElement,
    forwardRef,
    isValidElement,
    useCallback,
    useEffect,
    useId,
    useRef,
    type FocusEvent,
    type MouseEvent,
    type ReactElement,
    type ReactNode,
    type Ref,
} from 'react';

import { type FloatingAlign, type FloatingSide } from '../../hooks/useFloatingPosition';
import { useFloatingLayer } from '../../hooks/useFloatingLayer';
import { useControllableState } from '../../hooks/useControllableState';
import { composeRefs } from '../../utils/composeRefs';
import { cn } from '../../utils/cn';
import {
    overlayLayerZIndex,
    useOverlayContext,
    useOverlayLayerIndex,
} from '../Overlay/OverlayProvider';
import { Portal } from '../Portal/Portal';

type TooltipTriggerProps = {
    ref?: Ref<HTMLElement>;
    className?: string;
    'data-testid'?: string;
    'aria-describedby'?: string;
    onMouseEnter?: (event: MouseEvent<HTMLElement>) => void;
    onMouseLeave?: (event: MouseEvent<HTMLElement>) => void;
    onFocus?: (event: FocusEvent<HTMLElement>) => void;
    onBlur?: (event: FocusEvent<HTMLElement>) => void;
};

export type TooltipProps = {
    content: ReactNode;
    children: ReactNode;
    side?: FloatingSide;
    align?: FloatingAlign;
    sideOffset?: number;
    avoidCollisions?: boolean;
    collisionPadding?: number;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    delayDuration?: number;
    closeDelay?: number;
    className?: string;
    testId?: string;
};

export const Tooltip = forwardRef<HTMLElement, TooltipProps>(function Tooltip(
    {
        content,
        children,
        side = 'top',
        align = 'center',
        sideOffset = 8,
        avoidCollisions = true,
        collisionPadding = 8,
        open,
        defaultOpen = false,
        onOpenChange,
        delayDuration = 300,
        closeDelay = 120,
        className,
        testId,
    },
    ref,
) {
    const overlay = useOverlayContext();
    const tooltipId = useId();
    const openTimerRef = useRef<number | null>(null);
    const closeTimerRef = useRef<number | null>(null);
    const [actualOpen, setOpen] = useControllableState({
        value: open,
        defaultValue: defaultOpen,
        onChange: onOpenChange,
    });
    const { triggerRef, contentRef, present, state, style } = useFloatingLayer<
        HTMLSpanElement,
        HTMLDivElement
    >({
        open: actualOpen,
        presenceDuration: 140,
        side,
        align,
        sideOffset,
        avoidCollisions,
        collisionPadding,
    });
    const layerIndex = useOverlayLayerIndex(present);
    const clearOpenTimer = useCallback(() => {
        if (openTimerRef.current === null) return;
        window.clearTimeout(openTimerRef.current);
        openTimerRef.current = null;
    }, []);
    const clearCloseTimer = useCallback(() => {
        if (closeTimerRef.current === null) return;
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
    }, []);
    const scheduleOpen = useCallback(() => {
        clearCloseTimer();
        clearOpenTimer();
        if (delayDuration <= 0) {
            setOpen(true);
            return;
        }
        openTimerRef.current = window.setTimeout(() => {
            openTimerRef.current = null;
            setOpen(true);
        }, delayDuration);
    }, [clearCloseTimer, clearOpenTimer, delayDuration, setOpen]);
    const scheduleClose = useCallback(() => {
        clearOpenTimer();
        clearCloseTimer();
        if (closeDelay <= 0) {
            setOpen(false);
            return;
        }
        closeTimerRef.current = window.setTimeout(() => {
            closeTimerRef.current = null;
            setOpen(false);
        }, closeDelay);
    }, [clearCloseTimer, clearOpenTimer, closeDelay, setOpen]);

    useEffect(
        () => () => {
            clearOpenTimer();
            clearCloseTimer();
        },
        [clearCloseTimer, clearOpenTimer],
    );

    const triggerHandlers = {
        onMouseEnter: scheduleOpen,
        onMouseLeave: scheduleClose,
        onFocus: (event: FocusEvent<HTMLElement>) => {
            if (isKeyboardFocus(event.currentTarget)) {
                clearOpenTimer();
                clearCloseTimer();
                setOpen(true);
            }
        },
        onBlur: scheduleClose,
    };
    const trigger = isValidElement(children) ? (
        cloneTooltipTrigger(children as ReactElement<TooltipTriggerProps>, {
            ref: composeRefs(triggerRef, ref),
            testId,
            describedBy: tooltipId,
            ...triggerHandlers,
        })
    ) : (
        <span
            ref={composeRefs(triggerRef, ref)}
            className="oui-tooltip-trigger"
            data-testid={testId}
            aria-describedby={tooltipId}
            {...triggerHandlers}
        >
            {children}
        </span>
    );

    return (
        <>
            {trigger}
            {present ? (
                <Portal>
                    <div
                        ref={contentRef}
                        role="tooltip"
                        id={tooltipId}
                        className={cn('oui-tooltip-content', className)}
                        data-state={state}
                        data-layer="dropdown"
                        data-oui-layer-index={layerIndex}
                        data-testid={testId ? `${testId}-content` : undefined}
                        style={{
                            ...style,
                            zIndex: overlayLayerZIndex(overlay.zIndex, 'dropdown', layerIndex),
                        }}
                        onMouseEnter={clearCloseTimer}
                        onMouseLeave={scheduleClose}
                    >
                        {content}
                    </div>
                </Portal>
            ) : null}
        </>
    );
});

function cloneTooltipTrigger(
    trigger: ReactElement<TooltipTriggerProps>,
    {
        ref,
        testId,
        onMouseEnter,
        onMouseLeave,
        onFocus,
        onBlur,
        describedBy,
    }: TooltipTriggerProps & { testId?: string; describedBy: string },
) {
    return cloneElement(trigger, {
        ref: composeRefs(trigger.props.ref, ref),
        className: cn('oui-tooltip-trigger', trigger.props.className),
        'data-testid': testId,
        'aria-describedby': describedBy,
        onMouseEnter: (event) => {
            trigger.props.onMouseEnter?.(event);
            onMouseEnter?.(event);
        },
        onMouseLeave: (event) => {
            trigger.props.onMouseLeave?.(event);
            onMouseLeave?.(event);
        },
        onFocus: (event) => {
            trigger.props.onFocus?.(event);
            onFocus?.(event);
        },
        onBlur: (event) => {
            trigger.props.onBlur?.(event);
            onBlur?.(event);
        },
    });
}

function isKeyboardFocus(element: HTMLElement) {
    return element.matches(':focus-visible');
}
