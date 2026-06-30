'use client';

import {
    useCallback,
    useLayoutEffect,
    useRef,
    useState,
    type CSSProperties,
    type ReactNode,
} from 'react';

import {cn} from '../../utils/cn';
import {Collapse} from '../Collapse/Collapse';

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

export function Tabs({
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

        setActiveRect(readRect(active?.value));
        setHoverRect((current) => readRect(hoveredValue) ?? current);
        setHoverVisible(Boolean(hoveredValue && readRect(hoveredValue)));
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
            <div className='oui-tabs-shell'>
                <div
                    ref={listRef}
                    className={cn('oui-tabs-list', listClassName)}
                    role='tablist'
                    data-testid={testId ? `${testId}-list` : undefined}
                    onMouseLeave={() => setHoveredValue(null)}
                >
                    {activeRect ? (
                        <span
                            aria-hidden
                            className='oui-tabs-active-indicator'
                            style={indicatorStyle(activeRect)}
                        />
                    ) : null}
                    {hoverRect ? (
                        <span
                            aria-hidden
                            className='oui-tabs-hover-indicator'
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
                                type='button'
                                role='tab'
                                aria-selected={isActive}
                                className='oui-tabs-trigger'
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
                                    <span className='oui-tabs-trigger-icon' aria-hidden>
                                        {item.icon}
                                    </span>
                                ) : null}
                                <span className='oui-tabs-trigger-label'>{item.label}</span>
                                {item.badge ? (
                                    <span className='oui-tabs-trigger-badge'>
                                        {item.badge}
                                    </span>
                                ) : null}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className={cn('oui-tabs-content', contentClassName)} data-testid={testId ? `${testId}-content` : undefined}>
                {items.map((item) => {
                    const open = active.value === item.value;
                    return (
                        <Collapse key={item.value} open={open}>
                            <div
                                role='tabpanel'
                                className='oui-tabs-panel'
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

function indicatorStyle(rect: TabRect): CSSProperties {
    return {
        left: rect.left,
        top: rect.top + 4,
        width: rect.width,
        height: Math.max(0, rect.height - 8),
    };
}
