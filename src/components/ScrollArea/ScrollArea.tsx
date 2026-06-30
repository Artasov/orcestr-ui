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

import {cn} from '../../utils/cn';
import {splitSystemProps, type SystemProps} from '../../theme/systemProps';
import {BottomHighlight, TopHighlight} from '../Highlight/Highlight';

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

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
    function ScrollArea(
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
            testId,
            ...props
        },
        ref,
    ) {
        const {systemStyle, restProps} = splitSystemProps(props);
        const {onScroll, ...outerProps} = restProps;
        const showHighlights = highlights && highlightVisible;
        const scrollRef = useRef<HTMLDivElement | null>(null);
        const frameRef = useRef<number | null>(null);
        const [opacity, setOpacity] = useState({top: 0, bottom: 0});
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
            if (!node || !showHighlights) {
                setOpacity({top: 0, bottom: 0});
                return;
            }

            const maxScroll = Math.max(0, node.scrollHeight - node.clientHeight);
            const nextOpacity = {
                top: topConfig.visible
                    ? revealOpacity(node.scrollTop, topConfig)
                    : 0,
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
                typeof ResizeObserver === 'undefined'
                    ? null
                    : new ResizeObserver(scheduleUpdate);
            observer?.observe(node);
            Array.from(node.children).forEach((child) => {
                if (
                    child instanceof HTMLElement &&
                    !child.classList.contains('oui-highlight')
                ) {
                    observer?.observe(child);
                }
            });
            window.addEventListener('resize', scheduleUpdate);

            return () => {
                observer?.disconnect();
                window.removeEventListener('resize', scheduleUpdate);
                if (frameRef.current !== null) {
                    window.cancelAnimationFrame(frameRef.current);
                    frameRef.current = null;
                }
            };
        }, [scheduleUpdate]);

        return (
            <div
                className={cn('oui-scroll-area', className)}
                data-testid={testId}
                style={{...systemStyle, ...style}}
                {...outerProps}
            >
                <div
                    ref={scrollRef}
                    className='oui-scroll-area-viewport'
                    data-testid={testId ? `${testId}-viewport` : undefined}
                    onScroll={(event) => {
                        onScroll?.(event);
                        scheduleUpdate();
                    }}
                >
                    {children}
                </div>
                {showHighlights ? (
                    <div className='oui-scroll-area-highlight-overlay' aria-hidden='true'>
                        {topConfig.visible ? (
                            <TopHighlight
                                h={topConfig.h}
                                color={topConfig.color}
                                style={{opacity: opacity.top}}
                            />
                        ) : null}
                        {bottomConfig.visible ? (
                            <BottomHighlight
                                h={bottomConfig.h}
                                color={bottomConfig.color}
                                style={{opacity: opacity.bottom}}
                            />
                        ) : null}
                    </div>
                ) : null}
            </div>
        );
    },
);

type NormalizedScrollHighlightConfig = Required<
    Pick<
        ScrollHighlightConfig,
        'fadeDistance' | 'h' | 'maxOpacity' | 'mode' | 'start' | 'visible'
    >
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
