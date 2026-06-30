'use client';

import {
    cloneElement,
    isValidElement,
    useCallback,
    useEffect,
    useRef,
    type KeyboardEvent as ReactKeyboardEvent,
    type MouseEvent as ReactMouseEvent,
    type ReactElement,
    type ReactNode,
    type Ref,
} from 'react';

import {useDisclosure} from '../../hooks/useDisclosure';
import {type FloatingAlign, type FloatingSide} from '../../hooks/useFloatingPosition';
import {useFloatingLayer} from '../../hooks/useFloatingLayer';
import {useOutsidePointerDown} from '../../hooks/useOutsidePointerDown';
import {composeRefs} from '../../utils/composeRefs';
import {cn} from '../../utils/cn';
import {useOverlayContext, useOverlayLayerIndex} from '../Overlay/OverlayProvider';
import {Portal} from '../Portal/Portal';

type TriggerElementProps = {
    ref?: Ref<HTMLElement>;
    className?: string;
    onClick?: (event: ReactMouseEvent<HTMLElement>) => void;
    onKeyDown?: (event: ReactKeyboardEvent<HTMLElement>) => void;
    'aria-expanded'?: boolean;
    'data-disabled'?: string;
    'data-testid'?: string;
};

export type PopoverProps = {
    trigger: ReactNode;
    children: ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    side?: FloatingSide;
    align?: FloatingAlign;
    sideOffset?: number;
    collisionPadding?: number;
    matchTriggerWidth?: boolean;
    disabled?: boolean;
    className?: string;
    testId?: string;
};

export function Popover({
    trigger,
    children,
    open,
    defaultOpen,
    onOpenChange,
    side = 'bottom',
    align = 'start',
    sideOffset = 8,
    collisionPadding = 8,
    matchTriggerWidth = false,
    disabled = false,
    className,
    testId,
}: PopoverProps) {
    const overlay = useOverlayContext();
    const disclosure = useDisclosure({open, defaultOpen, onOpenChange});
    const {open: isOpen, close: closeDisclosure, toggle} = disclosure;
    const previousFocusRef = useRef<HTMLElement | null>(null);
    const {
        triggerRef,
        contentRef,
        present,
        state,
        style,
    } = useFloatingLayer<HTMLElement, HTMLDivElement>({
        open: isOpen,
        side,
        align,
        sideOffset,
        collisionPadding,
        matchTriggerWidth,
    });
    const close = useCallback(() => closeDisclosure(), [closeDisclosure]);
    const layerIndex = useOverlayLayerIndex(present);
    useOutsidePointerDown([triggerRef, contentRef], isOpen, close);

    useEffect(() => {
        if (!isOpen) return;
        previousFocusRef.current =
            document.activeElement instanceof HTMLElement ? document.activeElement : null;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Escape') return;
            event.preventDefault();
            closeDisclosure();
        };
        document.addEventListener('keydown', onKeyDown, true);
        return () => {
            document.removeEventListener('keydown', onKeyDown, true);
            previousFocusRef.current?.focus?.();
        };
    }, [closeDisclosure, isOpen]);

    const handleTriggerClick = useCallback(
        (event: ReactMouseEvent<HTMLElement>) => {
            if (event.defaultPrevented || disabled) return;
            toggle();
        },
        [disabled, toggle],
    );

    const triggerNode = isValidElement(trigger)
        ? clonePopoverTrigger(
            trigger as ReactElement<TriggerElementProps>,
            {
                ref: triggerRef,
                open: isOpen,
                disabled,
                testId,
                onClick: handleTriggerClick,
            },
        )
        : (
            <span
                ref={triggerRef}
                className='oui-popover-trigger'
                data-disabled={disabled ? 'true' : undefined}
                role='button'
                tabIndex={disabled ? -1 : 0}
                aria-expanded={isOpen}
                data-testid={testId}
                onClick={handleTriggerClick}
                onKeyDown={(event) => {
                    if (disabled) return;
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        toggle();
                    }
                }}
            >
                {trigger}
            </span>
        );

    return (
        <>
            {triggerNode}
            {present ? (
                <Portal>
                    <div
                        ref={contentRef}
                        className={cn('oui-popover-content', className)}
                        data-state={state}
                        data-layer='dropdown'
                        data-testid={testId ? `${testId}-content` : undefined}
                        style={{
                            ...style,
                            zIndex: overlay.zIndex.dropdown + layerIndex * 10,
                        }}
                    >
                        {children}
                    </div>
                </Portal>
            ) : null}
        </>
    );
}

function clonePopoverTrigger(
    trigger: ReactElement<TriggerElementProps>,
    {
        ref,
        open,
        disabled,
        testId,
        onClick,
    }: {
        ref: Ref<HTMLElement>;
        open: boolean;
        disabled: boolean;
        testId?: string;
        onClick: (event: ReactMouseEvent<HTMLElement>) => void;
    },
) {
    return cloneElement(trigger, {
        ref: composeRefs(trigger.props.ref, ref),
        className: cn('oui-popover-trigger', trigger.props.className),
        'data-disabled': disabled ? 'true' : trigger.props['data-disabled'],
        'data-testid': testId ?? trigger.props['data-testid'],
        'aria-expanded': open,
        onClick: (event) => {
            trigger.props.onClick?.(event);
            onClick(event);
        },
    });
}
