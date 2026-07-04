'use client';

import {
    cloneElement,
    Children,
    forwardRef,
    isValidElement,
    useCallback,
    useContext,
    useEffect,
    useRef,
    type KeyboardEvent as ReactKeyboardEvent,
    type MouseEvent as ReactMouseEvent,
    type CSSProperties,
    type HTMLAttributes,
    type ReactElement,
    type ReactNode,
    type Ref,
} from 'react';

import { useDisclosure } from '../../hooks/useDisclosure';
import { type FloatingAlign, type FloatingSide } from '../../hooks/useFloatingPosition';
import { useFloatingLayer } from '../../hooks/useFloatingLayer';
import { useOutsidePointerDown } from '../../hooks/useOutsidePointerDown';
import { splitSystemProps, type SystemProps } from '../../theme/systemProps';
import { OrcestrThemeContext } from '../../theme/useTheme';
import { composeRefs } from '../../utils/composeRefs';
import { cn } from '../../utils/cn';
import {
    overlayLayerZIndex,
    useOverlayContext,
    useOverlayLayerIndex,
} from '../Overlay/OverlayProvider';
import { Portal } from '../Portal/Portal';

type TriggerElementProps = {
    ref?: Ref<HTMLElement>;
    className?: string;
    onClick?: (event: ReactMouseEvent<HTMLElement>) => void;
    onKeyDown?: (event: ReactKeyboardEvent<HTMLElement>) => void;
    'aria-expanded'?: boolean;
    'data-disabled'?: string;
    'data-testid'?: string;
};

export type PopoverProps = SystemProps &
    Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
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
        contentStyle?: CSSProperties;
        contentRef?: Ref<HTMLDivElement>;
        onOpenAutoFocus?: (event: { preventDefault: () => void }) => void;
        onInteractOutside?: (event: Event) => void;
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
    contentStyle,
    contentRef: externalContentRef,
    style: contentStyleProp,
    onOpenAutoFocus,
    onInteractOutside,
    testId,
    ...props
}: PopoverProps) {
    const overlay = useOverlayContext();
    const themeContext = useContext(OrcestrThemeContext);
    const disclosure = useDisclosure({ open, defaultOpen, onOpenChange });
    const { open: isOpen, close: closeDisclosure, toggle } = disclosure;
    const previousFocusRef = useRef<HTMLElement | null>(null);
    const { triggerRef, contentRef, present, state, style } = useFloatingLayer<
        HTMLElement,
        HTMLDivElement
    >({
        open: isOpen,
        side,
        align,
        sideOffset,
        collisionPadding,
        matchTriggerWidth,
    });
    const layerIndex = useOverlayLayerIndex(present);
    const { systemStyle, restProps } = splitSystemProps(props);
    const handleOutsidePointerDown = useCallback(
        (event: PointerEvent) => {
            onInteractOutside?.(event);
            if (event.defaultPrevented) return;
            closeDisclosure();
        },
        [closeDisclosure, onInteractOutside],
    );
    useOutsidePointerDown([triggerRef, contentRef], isOpen, handleOutsidePointerDown);

    useEffect(() => {
        if (!isOpen) return;
        onOpenAutoFocus?.({ preventDefault: () => undefined });
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
    }, [closeDisclosure, isOpen, onOpenAutoFocus]);

    const handleTriggerClick = useCallback(
        (event: ReactMouseEvent<HTMLElement>) => {
            if (event.defaultPrevented || disabled) return;
            toggle();
        },
        [disabled, toggle],
    );

    const triggerNode = isValidElement(trigger) ? (
        clonePopoverTrigger(trigger as ReactElement<TriggerElementProps>, {
            ref: triggerRef,
            open: isOpen,
            disabled,
            testId,
            onClick: handleTriggerClick,
        })
    ) : (
        <span
            ref={triggerRef}
            className="oui-popover-trigger"
            data-disabled={disabled ? 'true' : undefined}
            role="button"
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
                        ref={composeRefs(contentRef, externalContentRef)}
                        className={cn('oui-popover-content', className)}
                        data-state={state}
                        data-layer="dropdown"
                        data-oui-theme={themeContext?.mode}
                        data-oui-surface={themeContext?.surface}
                        data-testid={testId ? `${testId}-content` : undefined}
                        style={{
                            ...themeContext?.cssVariables,
                            ...style,
                            ...systemStyle,
                            ...contentStyle,
                            ...contentStyleProp,
                            zIndex: overlayLayerZIndex(overlay.zIndex, 'dropdown', layerIndex),
                        }}
                        {...restProps}
                    >
                        {children}
                    </div>
                </Portal>
            ) : null}
        </>
    );
}

type PopoverRootProps = Pick<PopoverProps, 'open' | 'defaultOpen' | 'onOpenChange'> & {
    children: ReactNode;
};

type PopoverTriggerProps = {
    children: ReactNode;
};

type PopoverContentProps = SystemProps &
    Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
        children: ReactNode;
        width?: number | string;
        size?: number | string;
        align?: FloatingAlign;
        side?: FloatingSide;
        sideOffset?: number;
        matchTriggerWidth?: boolean;
        className?: string;
        onOpenAutoFocus?: (event: { preventDefault: () => void }) => void;
        onInteractOutside?: (event: Event) => void;
    };

function PopoverRoot({ children, ...props }: PopoverRootProps) {
    const trigger = findPopoverChild<PopoverTriggerProps>(children, PopoverTrigger);
    const content = findPopoverChild<PopoverContentProps>(children, PopoverContent);
    if (!trigger || !content) return null;
    const {
        children: contentChildren,
        width,
        size: _size,
        ref: contentRef,
        ...contentProps
    } = content.props as PopoverContentProps & { ref?: Ref<HTMLDivElement> };

    return (
        <Popover
            {...props}
            {...contentProps}
            w={width}
            contentRef={contentRef}
            trigger={trigger.props.children}
        >
            {contentChildren}
        </Popover>
    );
}

function PopoverTrigger(_props: PopoverTriggerProps) {
    return null;
}

const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
    function PopoverContent(_props, _ref) {
        return null;
    },
);

function findPopoverChild<P>(children: ReactNode, type: unknown): ReactElement<P> | null {
    let found: ReactElement<P> | null = null;
    Children.forEach(children, (child) => {
        if (!found && isValidElement(child) && child.type === type) {
            found = child as ReactElement<P>;
        }
    });
    return found;
}

Object.assign(Popover, {
    Root: PopoverRoot,
    Trigger: PopoverTrigger,
    Content: PopoverContent,
});

export namespace Popover {
    export const Root = PopoverRoot;
    export const Trigger = PopoverTrigger;
    export const Content = PopoverContent;
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
