'use client';

import {
    cloneElement,
    Children,
    forwardRef,
    isValidElement,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type KeyboardEvent as ReactKeyboardEvent,
    type MouseEvent as ReactMouseEvent,
    type CSSProperties,
    type HTMLAttributes,
    type ReactElement,
    type ReactNode,
    type Ref,
} from 'react';

import { useDisclosure } from '../../hooks/useDisclosure.js';
import type { OpenAutoFocusEvent } from '../../hooks/useFocusTrap.js';
import { type FloatingAlign, type FloatingSide } from '../../hooks/useFloatingPosition.js';
import { useFloatingLayer } from '../../hooks/useFloatingLayer.js';
import { useOutsidePointerDown } from '../../hooks/useOutsidePointerDown.js';
import { splitSystemProps, type SystemProps } from '../../theme/systemProps.js';
import { OrcestrThemeContext } from '../../theme/useTheme.js';
import { composeRefs } from '../../utils/composeRefs.js';
import { cn } from '../../utils/cn.js';
import {
    overlayLayerZIndex,
    useOverlayContext,
    useOverlayLayerIndex,
} from '../Overlay/OverlayProvider.js';
import { Portal } from '../Portal/Portal.js';

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
        layoutMotion?: boolean;
        disabled?: boolean;
        className?: string;
        contentStyle?: CSSProperties;
        contentRef?: Ref<HTMLDivElement>;
        onOpenAutoFocus?: (event: OpenAutoFocusEvent) => void;
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
    layoutMotion = false,
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
    const layoutContentRef = useRef<HTMLDivElement | null>(null);
    const [layoutHeight, setLayoutHeight] = useState<number>();
    const [layoutMotionReady, setLayoutMotionReady] = useState(false);
    const { systemStyle, restProps } = splitSystemProps(props);

    useLayoutEffect(() => {
        if (!present || !layoutMotion) {
            setLayoutHeight(undefined);
            setLayoutMotionReady(false);
            return;
        }
        const content = contentRef.current;
        const layoutContent = layoutContentRef.current;
        const ownerWindow = content?.ownerDocument.defaultView;
        if (!content || !layoutContent || !ownerWindow) return;

        const measure = () => {
            const contentStyle = ownerWindow.getComputedStyle(content);
            const nextHeight =
                layoutContent.getBoundingClientRect().height +
                cssPixels(contentStyle.paddingTop) +
                cssPixels(contentStyle.paddingBottom) +
                cssPixels(contentStyle.borderTopWidth) +
                cssPixels(contentStyle.borderBottomWidth);
            setLayoutHeight((current) =>
                current !== undefined && Math.abs(current - nextHeight) < 0.5
                    ? current
                    : nextHeight,
            );
        };

        measure();
        const observer = new ownerWindow.ResizeObserver(measure);
        observer.observe(layoutContent);
        return () => observer.disconnect();
    }, [contentRef, layoutMotion, present]);

    useLayoutEffect(() => {
        if (!present || !layoutMotion) {
            setLayoutMotionReady(false);
            return;
        }
        if (layoutMotionReady || layoutHeight === undefined || !isPositioned(style)) return;
        const ownerWindow = contentRef.current?.ownerDocument.defaultView;
        if (!ownerWindow) return;
        const frame = ownerWindow.requestAnimationFrame(() => setLayoutMotionReady(true));
        return () => ownerWindow.cancelAnimationFrame(frame);
    }, [contentRef, layoutHeight, layoutMotion, layoutMotionReady, present, style]);
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
        if (!isOpen || !overlay.portalReady) return;
        previousFocusRef.current =
            document.activeElement instanceof HTMLElement ? document.activeElement : null;
        let prevented = false;
        onOpenAutoFocus?.({
            preventDefault: () => {
                prevented = true;
            },
        });
        if (!prevented) {
            const first = contentRef.current?.querySelector<HTMLElement>(
                'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
            );
            (first ?? contentRef.current)?.focus({ preventScroll: true });
        }
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Escape' || event.defaultPrevented) return;
            event.preventDefault();
            closeDisclosure();
        };
        document.addEventListener('keydown', onKeyDown, true);
        return () => {
            document.removeEventListener('keydown', onKeyDown, true);
            previousFocusRef.current?.focus?.();
        };
    }, [closeDisclosure, isOpen, onOpenAutoFocus, overlay.portalReady]);

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
                        className={cn(
                            'oui-popover-content',
                            layoutMotion && 'oui-popover-layout-motion',
                            className,
                        )}
                        data-state={state}
                        data-layout-ready={layoutMotionReady ? 'true' : undefined}
                        data-layer="dropdown"
                        data-oui-layer-index={layerIndex}
                        data-oui-theme={themeContext?.mode}
                        data-testid={testId ? `${testId}-content` : undefined}
                        style={{
                            ...themeContext?.cssVariables,
                            ...style,
                            height: layoutMotion ? layoutHeight : undefined,
                            ...systemStyle,
                            ...contentStyle,
                            ...contentStyleProp,
                            zIndex: overlayLayerZIndex(overlay.zIndex, 'dropdown', layerIndex),
                        }}
                        {...restProps}
                        tabIndex={-1}
                    >
                        {layoutMotion ? (
                            <div ref={layoutContentRef} className="oui-popover-layout-content">
                                {children}
                            </div>
                        ) : (
                            children
                        )}
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
        layoutMotion?: boolean;
        className?: string;
        onOpenAutoFocus?: (event: OpenAutoFocusEvent) => void;
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

function cssPixels(value: string): number {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
}

function isPositioned(style: CSSProperties): boolean {
    return (
        typeof style.left === 'number' &&
        typeof style.top === 'number' &&
        style.left > -9000 &&
        style.top > -9000
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
