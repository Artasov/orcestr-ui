'use client';

import {
    cloneElement,
    forwardRef,
    isValidElement,
    useState,
    type FocusEvent,
    type MouseEvent,
    type ReactElement,
    type ReactNode,
    type Ref,
} from 'react';

import {type FloatingAlign, type FloatingSide} from '../../hooks/useFloatingPosition';
import {useFloatingLayer} from '../../hooks/useFloatingLayer';
import {composeRefs} from '../../utils/composeRefs';
import {cn} from '../../utils/cn';
import {
    overlayLayerZIndex,
    useOverlayContext,
    useOverlayLayerIndex,
} from '../Overlay/OverlayProvider';
import {Portal} from '../Portal/Portal';

type TooltipTriggerProps = {
    ref?: Ref<HTMLElement>;
    className?: string;
    'data-testid'?: string;
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
        avoidCollisions: _avoidCollisions,
        collisionPadding: _collisionPadding,
        open,
        defaultOpen = false,
        onOpenChange,
        className,
        testId,
    },
    ref,
) {
    const overlay = useOverlayContext();
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const actualOpen = open ?? internalOpen;
    const setOpen = (nextOpen: boolean) => {
        if (open === undefined) setInternalOpen(nextOpen);
        onOpenChange?.(nextOpen);
    };
    const {
        triggerRef,
        contentRef,
        present,
        state,
        style,
    } = useFloatingLayer<HTMLSpanElement, HTMLDivElement>({
        open: actualOpen,
        presenceDuration: 140,
        side,
        align,
        sideOffset,
    });
    const layerIndex = useOverlayLayerIndex(present);
    const triggerHandlers = {
        onMouseEnter: () => setOpen(true),
        onMouseLeave: () => setOpen(false),
        onFocus: (event: FocusEvent<HTMLElement>) => {
            if (isKeyboardFocus(event.currentTarget)) setOpen(true);
        },
        onBlur: () => setOpen(false),
    };
    const trigger = isValidElement(children)
        ? cloneTooltipTrigger(children as ReactElement<TooltipTriggerProps>, {
            ref: composeRefs(triggerRef, ref),
            testId,
            ...triggerHandlers,
        })
        : (
            <span
                ref={composeRefs(triggerRef, ref)}
                className='oui-tooltip-trigger'
                data-testid={testId}
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
                        role='tooltip'
                        className={cn('oui-tooltip-content', className)}
                        data-state={state}
                        data-layer='dropdown'
                        data-testid={testId ? `${testId}-content` : undefined}
                        style={{
                            ...style,
                            zIndex: overlayLayerZIndex(
                                overlay.zIndex,
                                'dropdown',
                                layerIndex,
                            ),
                        }}
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
    }: TooltipTriggerProps & {testId?: string},
) {
    return cloneElement(trigger, {
        ref: composeRefs(trigger.props.ref, ref),
        className: cn('oui-tooltip-trigger', trigger.props.className),
        'data-testid': testId,
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
