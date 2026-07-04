'use client';

import {
    type ComponentPropsWithoutRef,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type ReactNode,
} from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

import { cn } from '../../utils/cn';
import { Collapse } from '../Collapse/Collapse';
import { IconButton } from '../IconButton/IconButton';

export type TabItem = {
    value: string;
    label: ReactNode;
    content: ReactNode;
    icon?: ReactNode;
    badge?: ReactNode;
};

type TabRect = {
    left: number;
    top: number;
    width: number;
    height: number;
};

function stableTabRect(current: TabRect | null, next: TabRect | null): TabRect | null {
    if (!current || !next) return next;
    if (
        current.left === next.left &&
        current.top === next.top &&
        current.width === next.width &&
        current.height === next.height
    ) {
        return current;
    }
    return next;
}

function ItemTabs({
    items,
    value,
    onValueChange,
    className,
    listClassName,
    contentClassName,
    testId,
}: {
    items: ReadonlyArray<TabItem>;
    value: string;
    onValueChange: (value: string) => void;
    className?: string;
    listClassName?: string;
    contentClassName?: string;
    testId?: string;
}) {
    const active = items.find((item) => item.value === value) ?? items[0];
    const listRef = useRef<HTMLDivElement | null>(null);
    const triggerRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
    const [hoveredValue, setHoveredValue] = useState<string | null>(null);
    const [activeRect, setActiveRect] = useState<TabRect | null>(null);
    const [hoverRect, setHoverRect] = useState<TabRect | null>(null);
    const [hoverVisible, setHoverVisible] = useState(false);

    const measure = useCallback(() => {
        const list = listRef.current;
        if (!list) return;

        const readRect = (nextValue: string | null | undefined): TabRect | null => {
            if (!nextValue) return null;
            const trigger = triggerRefs.current.get(nextValue);
            if (!trigger) return null;
            return {
                left: trigger.offsetLeft,
                top: trigger.offsetTop,
                width: trigger.offsetWidth,
                height: trigger.offsetHeight,
            };
        };

        setActiveRect((current) => stableTabRect(current, readRect(active?.value)));
        const nextHoverRect = readRect(hoveredValue);
        setHoverRect((current) =>
            nextHoverRect ? stableTabRect(current, nextHoverRect) : current,
        );
        setHoverVisible(Boolean(hoveredValue && nextHoverRect && hoveredValue !== active?.value));
    }, [active?.value, hoveredValue]);

    const moveFocus = (currentValue: string, direction: 1 | -1) => {
        const currentIndex = items.findIndex((item) => item.value === currentValue);
        if (currentIndex === -1) return;
        const nextIndex = (currentIndex + direction + items.length) % items.length;
        const next = items[nextIndex];
        if (!next) return;
        triggerRefs.current.get(next.value)?.focus();
        onValueChange(next.value);
    };

    const focusEdge = (edge: 'first' | 'last') => {
        const next = edge === 'first' ? items[0] : items[items.length - 1];
        if (!next) return;
        triggerRefs.current.get(next.value)?.focus();
        onValueChange(next.value);
    };

    useLayoutEffect(() => {
        measure();
    }, [items, measure]);

    useLayoutEffect(() => {
        const list = listRef.current;
        if (!list || typeof ResizeObserver === 'undefined') return;
        const observer = new ResizeObserver(() => measure());
        observer.observe(list);
        triggerRefs.current.forEach((trigger) => observer.observe(trigger));
        return () => observer.disconnect();
    }, [items, measure]);

    if (!active) return null;

    return (
        <div className={cn('oui-tabs', className)} data-testid={testId}>
            <div className="oui-tabs-shell">
                <div
                    ref={listRef}
                    className={cn('oui-tabs-list', listClassName)}
                    role="tablist"
                    data-testid={testId ? `${testId}-list` : undefined}
                    onMouseLeave={() => setHoveredValue(null)}
                >
                    {activeRect ? (
                        <span
                            aria-hidden
                            className="oui-tabs-active-indicator"
                            style={indicatorStyle(activeRect)}
                        />
                    ) : null}
                    {hoverRect ? (
                        <span
                            aria-hidden
                            className="oui-tabs-hover-indicator"
                            data-visible={hoverVisible ? 'true' : undefined}
                            style={indicatorStyle(hoverRect)}
                        />
                    ) : null}
                    {items.map((item) => {
                        const isActive = active.value === item.value;
                        return (
                            <button
                                key={item.value}
                                ref={(element) => {
                                    if (element) triggerRefs.current.set(item.value, element);
                                    else triggerRefs.current.delete(item.value);
                                }}
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                className="oui-tabs-trigger"
                                data-active={isActive ? 'true' : undefined}
                                data-testid={testId ? `${testId}-${item.value}` : undefined}
                                onMouseEnter={() => setHoveredValue(item.value)}
                                onFocus={() => setHoveredValue(item.value)}
                                onBlur={() => setHoveredValue(null)}
                                onKeyDown={(event) => {
                                    if (event.key === 'ArrowRight') {
                                        event.preventDefault();
                                        moveFocus(item.value, 1);
                                    }
                                    if (event.key === 'ArrowLeft') {
                                        event.preventDefault();
                                        moveFocus(item.value, -1);
                                    }
                                    if (event.key === 'Home') {
                                        event.preventDefault();
                                        focusEdge('first');
                                    }
                                    if (event.key === 'End') {
                                        event.preventDefault();
                                        focusEdge('last');
                                    }
                                }}
                                onClick={() => onValueChange(item.value)}
                            >
                                {item.icon ? (
                                    <span className="oui-tabs-trigger-icon" aria-hidden>
                                        {item.icon}
                                    </span>
                                ) : null}
                                <span className="oui-tabs-trigger-label">{item.label}</span>
                                {item.badge ? (
                                    <span className="oui-tabs-trigger-badge">{item.badge}</span>
                                ) : null}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div
                className={cn('oui-tabs-content', contentClassName)}
                data-testid={testId ? `${testId}-content` : undefined}
            >
                {items.map((item) => {
                    const open = active.value === item.value;
                    return (
                        <Collapse key={item.value} open={open}>
                            <div
                                role="tabpanel"
                                className="oui-tabs-panel"
                                data-active={open ? 'true' : undefined}
                                data-testid={testId ? `${testId}-${item.value}-panel` : undefined}
                            >
                                {item.content}
                            </div>
                        </Collapse>
                    );
                })}
            </div>
        </div>
    );
}

type TabsCtxValue = {
    activeValue: string | undefined;
    hoveredValue: string | null;
    setHoveredValue: (value: string | null) => void;
    setActiveValue: (value: string) => void;
    registerTrigger: (value: string, element: HTMLElement | null) => void;
};

const TabsCtx = createContext<TabsCtxValue | null>(null);

function useTabsCtx(): TabsCtxValue {
    const ctx = useContext(TabsCtx);
    if (!ctx) throw new Error('Tabs.* must be used inside <Tabs.Root>.');
    return ctx;
}

type RootProps = Omit<ComponentPropsWithoutRef<'div'>, 'defaultValue' | 'onChange'> & {
    children: ReactNode;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
};

function Root({ value, defaultValue, onValueChange, children, className, ...props }: RootProps) {
    const [uncontrolled, setUncontrolled] = useState<string | undefined>(defaultValue);
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : uncontrolled;
    const [hoveredValue, setHoveredValue] = useState<string | null>(null);
    const triggersRef = useRef<Map<string, HTMLElement>>(new Map());
    const [, setTriggersVersion] = useState(0);

    const registerTrigger = useCallback((nextValue: string, element: HTMLElement | null) => {
        const triggers = triggersRef.current;
        if (element) {
            if (triggers.get(nextValue) === element) return;
            triggers.set(nextValue, element);
        } else {
            if (!triggers.has(nextValue)) return;
            triggers.delete(nextValue);
        }
        setTriggersVersion((current) => current + 1);
    }, []);

    const handleChange = useCallback(
        (nextValue: string) => {
            if (!isControlled) setUncontrolled(nextValue);
            onValueChange?.(nextValue);
        },
        [isControlled, onValueChange],
    );

    const ctxValue = useMemo<TabsCtxValue>(
        () => ({
            activeValue: currentValue,
            hoveredValue,
            setHoveredValue,
            setActiveValue: handleChange,
            registerTrigger,
        }),
        [currentValue, handleChange, hoveredValue, registerTrigger],
    );

    return (
        <TabsCtx.Provider value={ctxValue}>
            <div
                className={cn('oui-tabs-compound', className)}
                data-tabs-root
                data-value={currentValue}
                {...props}
            >
                {children}
            </div>
        </TabsCtx.Provider>
    );
}

type ListProps = Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'onWheel'> & {
    children: ReactNode;
    indicatorPaddingY?: number;
};

function List({ children, indicatorPaddingY = 4, className, style, ...props }: ListProps) {
    const ctx = useTabsCtx();
    const listRef = useRef<HTMLDivElement>(null);
    const [hoverRect, setHoverRect] = useState<TabRect | null>(null);
    const [hoverVisible, setHoverVisible] = useState(false);
    const [activeRect, setActiveRect] = useState<TabRect | null>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const measure = useCallback(() => {
        const list = listRef.current;
        if (!list) return;

        const triggers = list.querySelectorAll<HTMLElement>('[data-tabs-trigger]');
        let hover: TabRect | null = null;
        let active: TabRect | null = null;

        triggers.forEach((element) => {
            const nextValue = element.dataset.tabsTrigger;
            if (!nextValue) return;
            const rect = {
                left: element.offsetLeft,
                top: element.offsetTop,
                width: element.offsetWidth,
                height: element.offsetHeight,
            };
            if (nextValue === ctx.hoveredValue) hover = rect;
            if (nextValue === ctx.activeValue) active = rect;
        });

        setHoverRect((current) => (hover ? stableTabRect(current, hover) : current));
        setHoverVisible(Boolean(hover && ctx.hoveredValue !== ctx.activeValue));
        setActiveRect((current) => stableTabRect(current, active));
        setCanScrollLeft(list.scrollLeft > 1);
        setCanScrollRight(list.scrollLeft + list.clientWidth < list.scrollWidth - 1);
    }, [ctx.activeValue, ctx.hoveredValue]);

    useLayoutEffect(() => {
        measure();
    }, [measure]);

    useEffect(() => {
        const list = listRef.current;
        if (!list) return;

        const observer = new ResizeObserver(() => measure());
        observer.observe(list);
        list.querySelectorAll<HTMLElement>('[data-tabs-trigger]').forEach((element) =>
            observer.observe(element),
        );
        list.addEventListener('scroll', measure, { passive: true });

        return () => {
            observer.disconnect();
            list.removeEventListener('scroll', measure);
        };
    }, [children, measure]);

    const scrollList = (direction: 1 | -1) => {
        const list = listRef.current;
        if (!list) return;
        list.scrollBy({
            left: direction * Math.max(Math.round(list.clientWidth * 0.6), 160),
            behavior: 'smooth',
        });
    };

    const handleWheel = useCallback((event: WheelEvent) => {
        if (event.defaultPrevented) return;
        const list = listRef.current;
        if (!list || list.scrollWidth <= list.clientWidth + 1) return;

        const rawDelta =
            Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
        if (rawDelta === 0) return;

        const delta =
            event.deltaMode === 1
                ? rawDelta * 32
                : event.deltaMode === 2
                  ? rawDelta * list.clientWidth
                  : rawDelta;
        const maxScrollLeft = list.scrollWidth - list.clientWidth;
        const canScroll = delta < 0 ? list.scrollLeft > 1 : list.scrollLeft < maxScrollLeft - 1;
        if (!canScroll) return;

        event.preventDefault();
        list.scrollBy({ left: delta, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        const list = listRef.current;
        if (!list) return;
        list.addEventListener('wheel', handleWheel, { passive: false });
        return () => list.removeEventListener('wheel', handleWheel);
    }, [handleWheel]);

    const hasOverflowControls = canScrollLeft || canScrollRight;

    return (
        <div className="oui-tabs-compound-shell">
            {canScrollLeft ? (
                <span aria-hidden className="oui-tabs-edge oui-tabs-edge-left" />
            ) : null}
            {canScrollRight ? (
                <span aria-hidden className="oui-tabs-edge oui-tabs-edge-right" />
            ) : null}
            {canScrollLeft ? (
                <IconButton
                    type="button"
                    v="soft"
                    tone="neutral"
                    round
                    size={1}
                    onClick={() => scrollList(-1)}
                    aria-label="Scroll tabs left"
                    className="oui-tabs-scroll-button oui-tabs-scroll-button-left"
                >
                    <LuChevronLeft size={16} />
                </IconButton>
            ) : null}
            {canScrollRight ? (
                <IconButton
                    type="button"
                    v="soft"
                    tone="neutral"
                    round
                    size={1}
                    onClick={() => scrollList(1)}
                    aria-label="Scroll tabs right"
                    className="oui-tabs-scroll-button oui-tabs-scroll-button-right"
                >
                    <LuChevronRight size={16} />
                </IconButton>
            ) : null}
            <div
                ref={listRef}
                role="tablist"
                onMouseLeave={() => ctx.setHoveredValue(null)}
                className={cn('oui-tabs-list-scroll', className)}
                data-overflow={hasOverflowControls ? 'true' : undefined}
                style={style}
                {...props}
            >
                {activeRect ? (
                    <span
                        aria-hidden
                        className="oui-tabs-compound-active-indicator"
                        style={compoundIndicatorStyle(activeRect, indicatorPaddingY)}
                    />
                ) : null}
                {hoverRect ? (
                    <span
                        aria-hidden
                        className="oui-tabs-compound-hover-indicator"
                        data-visible={hoverVisible ? 'true' : undefined}
                        style={compoundIndicatorStyle(hoverRect, indicatorPaddingY)}
                    />
                ) : null}
                {children}
            </div>
        </div>
    );
}

type TriggerProps = Omit<ComponentPropsWithoutRef<'button'>, 'value'> & {
    value: string;
    children: ReactNode;
    icon?: ReactNode;
    size?: '2' | '3';
};

function Trigger({
    value,
    children,
    icon,
    size = '2',
    className,
    onMouseEnter,
    onClick,
    ...props
}: TriggerProps) {
    const ctx = useTabsCtx();
    const ref = useRef<HTMLButtonElement | null>(null);
    const isActive = ctx.activeValue === value;

    useEffect(() => {
        ctx.registerTrigger(value, ref.current);
        return () => ctx.registerTrigger(value, null);
    }, [ctx, value]);

    return (
        <button
            ref={ref}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={cn('oui-tabs-trigger', className)}
            data-active={isActive ? 'true' : undefined}
            data-size={size}
            data-tabs-trigger={value}
            onMouseEnter={(event) => {
                ctx.setHoveredValue(value);
                onMouseEnter?.(event);
            }}
            onClick={(event) => {
                onClick?.(event);
                if (event.defaultPrevented) return;
                ctx.setHoveredValue(value);
                ctx.setActiveValue(value);
            }}
            {...props}
        >
            {icon ? (
                <span className="oui-tabs-trigger-icon" aria-hidden>
                    {icon}
                </span>
            ) : null}
            {children}
        </button>
    );
}

type ContentProps = Omit<ComponentPropsWithoutRef<'div'>, 'value'> & {
    value: string;
    mountOnActive?: boolean;
};

function Content({ value, children, className, mountOnActive = false, ...props }: ContentProps) {
    const ctx = useTabsCtx();
    const open = ctx.activeValue === value;
    const [mounted, setMounted] = useState(open);

    useEffect(() => {
        if (!open || mounted) return;
        const frameId = window.requestAnimationFrame(() => setMounted(true));
        return () => window.cancelAnimationFrame(frameId);
    }, [mounted, open]);

    const shouldRenderChildren = !mountOnActive || mounted || open;

    return (
        <div
            role="tabpanel"
            className={cn('oui-tabs-compound-panel', className)}
            data-tabs-content={value}
            hidden={!open}
            {...props}
        >
            <Collapse open={open}>
                <div className="oui-tabs-compound-panel-inner">
                    {shouldRenderChildren ? children : null}
                </div>
            </Collapse>
        </div>
    );
}

function indicatorStyle(rect: TabRect): CSSProperties {
    return {
        left: rect.left,
        top: rect.top + 4,
        width: rect.width,
        height: Math.max(0, rect.height - 8),
    };
}

function compoundIndicatorStyle(rect: TabRect, paddingY: number): CSSProperties {
    return {
        left: rect.left,
        top: rect.top + paddingY,
        width: rect.width,
        height: Math.max(0, rect.height - paddingY * 2),
    };
}

export const Tabs = Object.assign(ItemTabs, {
    Root,
    List,
    Trigger,
    Content,
});
