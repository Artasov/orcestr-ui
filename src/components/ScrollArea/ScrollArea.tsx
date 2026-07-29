'use client';

import {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
    type ComponentPropsWithoutRef,
} from 'react';

import { cn } from '../../utils/cn.js';
import { splitSystemProps, type SystemProps } from '../../theme/systemProps.js';
import { BottomHighlight, TopHighlight } from '../Highlight/Highlight.js';

export type ScrollHighlightConfig = {
    visible?: boolean;
    mode?: 'static' | 'scroll';
    h?: number | string;
    color?: string;
    start?: number;
    fadeDistance?: number;
    maxOpacity?: number;
};

export type ScrollAreaProps = ComponentPropsWithoutRef<'div'> &
    SystemProps & {
        scrollbars?: 'vertical' | 'horizontal' | 'both';
        type?: 'auto' | 'always' | 'scroll' | 'hover';
        highlights?: boolean;
        highlightH?: number | string;
        highlightColor?: string;
        highlightVisible?: boolean;
        highlightStart?: number;
        highlightFadeDistance?: number;
        highlightMaxOpacity?: number;
        highlightTop?: ScrollHighlightConfig;
        highlightBottom?: ScrollHighlightConfig;
        testId?: string;
    };

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea(
    {
        className,
        style,
        children,
        highlights = false,
        highlightH = 32,
        highlightColor,
        highlightVisible = true,
        highlightStart = 0,
        highlightFadeDistance = 100,
        highlightMaxOpacity = 1,
        highlightTop,
        highlightBottom,
        scrollbars = 'both',
        type = 'auto',
        testId,
        ...props
    },
    ref,
) {
    const { systemStyle, restProps } = splitSystemProps(props);
    const { onScroll, ...outerProps } = restProps;
    const showHighlights = highlights && highlightVisible;
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const frameRef = useRef<number | null>(null);
    const scrollEndTimerRef = useRef<number | null>(null);
    const [opacity, setOpacity] = useState({ top: 0, bottom: 0 });
    const [overflow, setOverflow] = useState({ x: false, y: false });
    const [scrolling, setScrolling] = useState(false);
    const topConfig = useMemo(
        () =>
            normalizeHighlightConfig({
                h: highlightH,
                color: highlightColor,
                visible: true,
                start: highlightStart,
                fadeDistance: highlightFadeDistance,
                maxOpacity: highlightMaxOpacity,
                ...highlightTop,
            }),
        [
            highlightColor,
            highlightFadeDistance,
            highlightH,
            highlightMaxOpacity,
            highlightStart,
            highlightTop,
        ],
    );
    const bottomConfig = useMemo(
        () =>
            normalizeHighlightConfig({
                h: highlightH,
                color: highlightColor,
                visible: true,
                start: highlightStart,
                fadeDistance: highlightFadeDistance,
                maxOpacity: highlightMaxOpacity,
                ...highlightBottom,
            }),
        [
            highlightBottom,
            highlightColor,
            highlightFadeDistance,
            highlightH,
            highlightMaxOpacity,
            highlightStart,
        ],
    );

    useImperativeHandle(ref, () => scrollRef.current as HTMLDivElement, []);

    const updateOpacity = useCallback(() => {
        const node = scrollRef.current;
        if (!node) {
            setOpacity((current) =>
                current.top === 0 && current.bottom === 0 ? current : { top: 0, bottom: 0 },
            );
            setOverflow((current) => (!current.x && !current.y ? current : { x: false, y: false }));
            return;
        }

        const nextOverflow = {
            x: node.scrollWidth > node.clientWidth + 1,
            y: node.scrollHeight > node.clientHeight + 1,
        };
        setOverflow((current) =>
            current.x === nextOverflow.x && current.y === nextOverflow.y ? current : nextOverflow,
        );

        if (!showHighlights) {
            setOpacity((current) =>
                current.top === 0 && current.bottom === 0 ? current : { top: 0, bottom: 0 },
            );
            return;
        }

        const maxScroll = Math.max(0, node.scrollHeight - node.clientHeight);
        const nextOpacity = {
            top: topConfig.visible ? revealOpacity(node.scrollTop, topConfig) : 0,
            bottom: bottomConfig.visible
                ? revealOpacity(maxScroll - node.scrollTop, bottomConfig)
                : 0,
        };
        setOpacity((current) =>
            current.top === nextOpacity.top && current.bottom === nextOpacity.bottom
                ? current
                : nextOpacity,
        );
    }, [bottomConfig, showHighlights, topConfig]);

    const scheduleUpdate = useCallback(() => {
        if (frameRef.current !== null) return;
        frameRef.current = window.requestAnimationFrame(() => {
            frameRef.current = null;
            updateOpacity();
        });
    }, [updateOpacity]);

    useEffect(() => {
        scheduleUpdate();
        const node = scrollRef.current;
        if (!node) return;

        const observer =
            typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(scheduleUpdate);
        observer?.observe(node);
        if (contentRef.current) observer?.observe(contentRef.current);
        window.addEventListener('resize', scheduleUpdate);

        return () => {
            observer?.disconnect();
            window.removeEventListener('resize', scheduleUpdate);
            if (frameRef.current !== null) {
                window.cancelAnimationFrame(frameRef.current);
                frameRef.current = null;
            }
            if (scrollEndTimerRef.current !== null) {
                window.clearTimeout(scrollEndTimerRef.current);
                scrollEndTimerRef.current = null;
            }
        };
    }, [scheduleUpdate]);

    const handleScrollActivity = useCallback(() => {
        scheduleUpdate();
        if (type !== 'scroll') return;
        setScrolling(true);
        if (scrollEndTimerRef.current !== null) {
            window.clearTimeout(scrollEndTimerRef.current);
        }
        scrollEndTimerRef.current = window.setTimeout(() => {
            scrollEndTimerRef.current = null;
            setScrolling(false);
        }, 160);
    }, [scheduleUpdate, type]);

    return (
        <div
            className={cn('oui-scroll-area', className)}
            data-scrollbars={scrollbars}
            data-type={type}
            data-scrolling={scrolling ? 'true' : undefined}
            data-overflow-x={overflow.x ? 'true' : undefined}
            data-overflow-y={overflow.y ? 'true' : undefined}
            data-testid={testId}
            style={{ ...systemStyle, ...style }}
            {...outerProps}
        >
            <div
                ref={scrollRef}
                className="oui-scroll-area-viewport"
                data-testid={testId ? `${testId}-viewport` : undefined}
                onScroll={(event) => {
                    onScroll?.(event);
                    handleScrollActivity();
                }}
            >
                <div ref={contentRef} className="oui-scroll-area-content">
                    {children}
                </div>
            </div>
            {showHighlights ? (
                <div className="oui-scroll-area-highlight-overlay" aria-hidden="true">
                    {topConfig.visible ? (
                        <TopHighlight
                            h={topConfig.h}
                            color={topConfig.color}
                            style={{ opacity: opacity.top }}
                        />
                    ) : null}
                    {bottomConfig.visible ? (
                        <BottomHighlight
                            h={bottomConfig.h}
                            color={bottomConfig.color}
                            style={{ opacity: opacity.bottom }}
                        />
                    ) : null}
                </div>
            ) : null}
        </div>
    );
});

type NormalizedScrollHighlightConfig = Required<
    Pick<ScrollHighlightConfig, 'fadeDistance' | 'h' | 'maxOpacity' | 'mode' | 'start' | 'visible'>
> &
    Pick<ScrollHighlightConfig, 'color'>;

function normalizeHighlightConfig(
    config: Required<Pick<ScrollHighlightConfig, 'h'>> & ScrollHighlightConfig,
): NormalizedScrollHighlightConfig {
    return {
        h: config.h,
        color: config.color,
        visible: config.visible ?? true,
        mode: config.mode ?? 'scroll',
        start: Math.max(0, config.start ?? 0),
        fadeDistance: Math.max(0, config.fadeDistance ?? 100),
        maxOpacity: Math.max(0, Math.min(1, config.maxOpacity ?? 1)),
    };
}

function revealOpacity(distance: number, config: NormalizedScrollHighlightConfig) {
    if (config.mode === 'static') return config.maxOpacity;
    const visibleDistance = distance - config.start;
    if (visibleDistance <= 0) return 0;
    if (config.fadeDistance <= 0) return config.maxOpacity;
    return Math.min(1, visibleDistance / config.fadeDistance) * config.maxOpacity;
}
