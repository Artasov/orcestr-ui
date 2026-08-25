'use client';

import {
    type ComponentPropsWithoutRef,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useId,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type ReactNode,
} from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

import { cn } from '../../utils/cn.js';
import { useControllableState } from '../../hooks/useControllableState.js';
import { useReducedMotion } from '../../hooks/useReducedMotion.js';
import { useOrcestrUiLocale } from '../../locale/LocaleProvider.js';
import { Collapse } from '../Collapse/Collapse.js';
import { IconButton } from '../IconButton/IconButton.js';

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

    if (!active) return null;

    return (
        <Root
            value={active.value}
            onValueChange={onValueChange}
            className={cn('oui-tabs', className)}
            data-testid={testId}
        >
            <List
                variant="items"
                className={listClassName}
                data-testid={testId ? `${testId}-list` : undefined}
            >
                {items.map((item) => (
                    <Trigger
                        key={item.value}
                        value={item.value}
                        icon={item.icon}
                        data-testid={testId ? `${testId}-${item.value}` : undefined}
                    >
                        <span className="oui-tabs-trigger-label">{item.label}</span>
                        {item.badge ? (
                            <span className="oui-tabs-trigger-badge">{item.badge}</span>
                        ) : null}
                    </Trigger>
                ))}
            </List>
            <div
                className={cn('oui-tabs-content', contentClassName)}
                data-testid={testId ? `${testId}-content` : undefined}
            >
                {items.map((item) => (
                    <Content
                        key={item.value}
                        value={item.value}
                        className="oui-tabs-panel"
                        data-testid={testId ? `${testId}-${item.value}-panel` : undefined}
                    >
                        {item.content}
                    </Content>
                ))}
            </div>
        </Root>
    );
}

type TabsActiveContextValue = {
    activeValue: string | undefined;
    setActiveValue: (value: string) => void;
};

type TabsNavigationContextValue = {
    registerTrigger: (value: string, element: HTMLElement | null) => void;
    moveFocus: (value: string, target: 1 | -1 | 'first' | 'last') => string | null;
    isFirst: (value: string) => boolean;
    triggerId: (value: string) => string;
    panelId: (value: string) => string;
    version: number;
};

const TabsActiveContext = createContext<TabsActiveContextValue | null>(null);
const TabsHoveredValueContext = createContext<string | null>(null);
const TabsSetHoveredValueContext = createContext<((value: string | null) => void) | null>(null);
const TabsNavigationContext = createContext<TabsNavigationContextValue | null>(null);

function useTabsActive() {
    const context = useContext(TabsActiveContext);
    if (!context) throw new Error('Tabs.* must be used inside <Tabs.Root>.');
    return context;
}

function useTabsNavigation() {
    const context = useContext(TabsNavigationContext);
    if (!context) throw new Error('Tabs.* must be used inside <Tabs.Root>.');
    return context;
}

function useSetTabsHoveredValue() {
    const context = useContext(TabsSetHoveredValueContext);
    if (!context) throw new Error('Tabs.* must be used inside <Tabs.Root>.');
    return context;
}

type RootProps = Omit<ComponentPropsWithoutRef<'div'>, 'defaultValue' | 'onChange'> & {
    children: ReactNode;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
};

function Root({ value, defaultValue, onValueChange, children, className, ...props }: RootProps) {
    const [currentValue, setActiveValue] = useControllableState<string | undefined>({
        value,
        defaultValue,
        onChange: (nextValue) => {
            if (nextValue !== undefined) onValueChange?.(nextValue);
        },
    });
    const [hoveredValue, setHoveredValue] = useState<string | null>(null);
    const triggersRef = useRef<Map<string, HTMLElement>>(new Map());
    const [triggersVersion, setTriggersVersion] = useState(0);
    const rootId = useId();

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

    const moveFocus = useCallback((current: string, target: 1 | -1 | 'first' | 'last') => {
        const triggers = [...triggersRef.current.entries()];
        if (triggers.length === 0) return null;
        const currentIndex = triggers.findIndex(([triggerValue]) => triggerValue === current);
        let nextIndex: number;
        if (target === 'first') nextIndex = 0;
        else if (target === 'last') nextIndex = triggers.length - 1;
        else {
            nextIndex =
                currentIndex === -1
                    ? 0
                    : (currentIndex + target + triggers.length) % triggers.length;
        }
        const [nextValue, element] = triggers[nextIndex]!;
        element.focus();
        return nextValue;
    }, []);
    const isFirst = useCallback(
        (candidate: string) => triggersRef.current.keys().next().value === candidate,
        [],
    );
    const triggerId = useCallback(
        (tabValue: string) => `${rootId}-tab-${domId(tabValue)}`,
        [rootId],
    );
    const panelId = useCallback(
        (tabValue: string) => `${rootId}-panel-${domId(tabValue)}`,
        [rootId],
    );

    const activeContext = useMemo<TabsActiveContextValue>(
        () => ({
            activeValue: currentValue,
            setActiveValue: (nextValue) => setActiveValue(nextValue),
        }),
        [currentValue, setActiveValue],
    );
    const navigationContext = useMemo<TabsNavigationContextValue>(
        () => ({
            registerTrigger,
            moveFocus,
            isFirst,
            triggerId,
            panelId,
            version: triggersVersion,
        }),
        [isFirst, moveFocus, panelId, registerTrigger, triggerId, triggersVersion],
    );

    return (
        <TabsNavigationContext.Provider value={navigationContext}>
            <TabsActiveContext.Provider value={activeContext}>
                <TabsSetHoveredValueContext.Provider value={setHoveredValue}>
                    <TabsHoveredValueContext.Provider value={hoveredValue}>
                        <div
                            className={cn('oui-tabs-compound', className)}
                            data-tabs-root
                            data-value={currentValue}
                            {...props}
                        >
                            {children}
                        </div>
                    </TabsHoveredValueContext.Provider>
                </TabsSetHoveredValueContext.Provider>
            </TabsActiveContext.Provider>
        </TabsNavigationContext.Provider>
    );
}

type ListProps = Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'onWheel'> & {
    children: ReactNode;
    indicatorPaddingY?: number;
    variant?: 'compound' | 'items';
};

function List({
    children,
    indicatorPaddingY = 4,
    variant = 'compound',
    className,
    style,
    ...props
}: ListProps) {
    const reducedMotion = useReducedMotion();
    const { copy } = useOrcestrUiLocale();
    const { activeValue } = useTabsActive();
    const hoveredValue = useContext(TabsHoveredValueContext);
    const setHoveredValue = useSetTabsHoveredValue();
    const listRef = useRef<HTMLDivElement>(null);
    const [hoverRect, setHoverRect] = useState<TabRect | null>(null);
    const [hoverVisible, setHoverVisible] = useState(false);
    const [activeRect, setActiveRect] = useState<TabRect | null>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const activeValueRef = useRef(activeValue);
    const hoveredValueRef = useRef(hoveredValue);
    activeValueRef.current = activeValue;
    hoveredValueRef.current = hoveredValue;

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
            if (nextValue === hoveredValueRef.current) hover = rect;
            if (nextValue === activeValueRef.current) active = rect;
        });

        setHoverRect((current) => (hover ? stableTabRect(current, hover) : current));
        setHoverVisible(Boolean(hover && hoveredValueRef.current !== activeValueRef.current));
        setActiveRect((current) => stableTabRect(current, active));
        setCanScrollLeft(list.scrollLeft > 1);
        setCanScrollRight(list.scrollLeft + list.clientWidth < list.scrollWidth - 1);
    }, []);

    useLayoutEffect(() => {
        measure();
    }, [activeValue, children, hoveredValue, measure]);

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
            behavior: reducedMotion ? 'auto' : 'smooth',
        });
    };

    const handleWheel = useCallback(
        (event: WheelEvent) => {
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
            list.scrollBy({ left: delta, behavior: reducedMotion ? 'auto' : 'smooth' });
        },
        [reducedMotion],
    );

    useEffect(() => {
        const list = listRef.current;
        if (!list) return;
        list.addEventListener('wheel', handleWheel, { passive: false });
        return () => list.removeEventListener('wheel', handleWheel);
    }, [handleWheel]);

    const hasOverflowControls = canScrollLeft || canScrollRight;

    return (
        <div className={variant === 'items' ? 'oui-tabs-shell' : 'oui-tabs-compound-shell'}>
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
                    aria-label={copy.common.scrollTabsLeft}
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
                    aria-label={copy.common.scrollTabsRight}
                    className="oui-tabs-scroll-button oui-tabs-scroll-button-right"
                >
                    <LuChevronRight size={16} />
                </IconButton>
            ) : null}
            <div
                ref={listRef}
                role="tablist"
                onMouseLeave={() => setHoveredValue(null)}
                className={cn(
                    variant === 'items' ? 'oui-tabs-list' : 'oui-tabs-list-scroll',
                    className,
                )}
                data-overflow={hasOverflowControls ? 'true' : undefined}
                style={style}
                {...props}
            >
                {activeRect ? (
                    <span
                        aria-hidden
                        className={
                            variant === 'items'
                                ? 'oui-tabs-active-indicator'
                                : 'oui-tabs-compound-active-indicator'
                        }
                        style={
                            variant === 'items'
                                ? indicatorStyle(activeRect)
                                : compoundIndicatorStyle(activeRect, indicatorPaddingY)
                        }
                    />
                ) : null}
                {hoverRect ? (
                    <span
                        aria-hidden
                        className={
                            variant === 'items'
                                ? 'oui-tabs-hover-indicator'
                                : 'oui-tabs-compound-hover-indicator'
                        }
                        data-visible={hoverVisible ? 'true' : undefined}
                        style={
                            variant === 'items'
                                ? indicatorStyle(hoverRect)
                                : compoundIndicatorStyle(hoverRect, indicatorPaddingY)
                        }
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
    onKeyDown,
    ...props
}: TriggerProps) {
    const { activeValue, setActiveValue } = useTabsActive();
    const setHoveredValue = useSetTabsHoveredValue();
    const navigation = useTabsNavigation();
    const ref = useRef<HTMLButtonElement | null>(null);
    const isActive = activeValue === value;

    useEffect(() => {
        navigation.registerTrigger(value, ref.current);
        return () => navigation.registerTrigger(value, null);
    }, [navigation.registerTrigger, value]);

    return (
        <button
            ref={ref}
            type="button"
            role="tab"
            id={navigation.triggerId(value)}
            aria-controls={navigation.panelId(value)}
            aria-selected={isActive}
            tabIndex={isActive || (activeValue === undefined && navigation.isFirst(value)) ? 0 : -1}
            className={cn('oui-tabs-trigger', className)}
            data-active={isActive ? 'true' : undefined}
            data-size={size}
            data-tabs-trigger={value}
            onMouseEnter={(event) => {
                setHoveredValue(value);
                onMouseEnter?.(event);
            }}
            onKeyDown={(event) => {
                onKeyDown?.(event);
                if (event.defaultPrevented) return;
                let target: 1 | -1 | 'first' | 'last' | null = null;
                if (event.key === 'ArrowRight') target = 1;
                else if (event.key === 'ArrowLeft') target = -1;
                else if (event.key === 'Home') target = 'first';
                else if (event.key === 'End') target = 'last';
                if (target === null) return;
                event.preventDefault();
                const nextValue = navigation.moveFocus(value, target);
                if (nextValue !== null) setActiveValue(nextValue);
            }}
            onClick={(event) => {
                onClick?.(event);
                if (event.defaultPrevented) return;
                setHoveredValue(value);
                setActiveValue(value);
            }}
            {...props}
        >
            {icon ? (
                <span className="oui-tabs-trigger-icon" aria-hidden>
                    {icon}
                </span>
            ) : null}
            <span className="oui-tabs-trigger-label">{children}</span>
        </button>
    );
}

type ContentProps = Omit<ComponentPropsWithoutRef<'div'>, 'value'> & {
    value: string;
    mountOnActive?: boolean;
};

function Content({ value, children, className, mountOnActive = false, ...props }: ContentProps) {
    const { activeValue } = useTabsActive();
    const navigation = useTabsNavigation();
    const open = activeValue === value;
    const [mounted, setMounted] = useState(open);

    useEffect(() => {
        if (!mountOnActive || !open || mounted) return;
        const frameId = window.requestAnimationFrame(() => setMounted(true));
        return () => window.cancelAnimationFrame(frameId);
    }, [mountOnActive, mounted, open]);

    const shouldRenderChildren = !mountOnActive || mounted || open;

    return (
        <div
            role="tabpanel"
            id={navigation.panelId(value)}
            aria-labelledby={navigation.triggerId(value)}
            tabIndex={open ? 0 : -1}
            className={cn('oui-tabs-compound-panel', className)}
            data-tabs-content={value}
            data-state={open ? 'open' : 'closed'}
            aria-hidden={open ? undefined : true}
            inert={open ? undefined : true}
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

function domId(value: string) {
    return encodeURIComponent(value).replace(/%/g, '_');
}
