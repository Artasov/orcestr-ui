'use client';

import {
    Children,
    useCallback,
    useEffect,
    useRef,
    useState,
    type CSSProperties,
    type ComponentPropsWithoutRef,
    type KeyboardEvent,
    type PointerEvent,
    type ReactNode,
} from 'react';
import { LuChevronLeft, LuChevronRight, LuPause, LuPlay } from 'react-icons/lu';

import { useControllableState } from '../../hooks/useControllableState.js';
import { useReducedMotion } from '../../hooks/useReducedMotion.js';
import type { ToneInput, UiSize } from '../../theme/systemProps.js';
import { cn } from '../../utils/cn.js';
import type { ButtonVariant } from '../Button/Button.js';
import { IconButton } from '../IconButton/IconButton.js';

export type CarouselArrowVisibility = 'always' | 'hover' | 'never';

export type CarouselProps = Omit<ComponentPropsWithoutRef<'div'>, 'defaultValue' | 'onChange'> & {
    children: ReactNode;
    value?: number;
    defaultValue?: number;
    onValueChange?: (value: number) => void;
    showDots?: boolean;
    arrows?: CarouselArrowVisibility;
    arrowSize?: UiSize;
    arrowVariant?: ButtonVariant;
    arrowTone?: ToneInput;
    autoplay?: boolean;
    autoplayInterval?: number;
    showAutoplayControl?: boolean;
    pauseOnHover?: boolean;
    loop?: boolean;
    swipe?: boolean;
    keyboard?: boolean;
    transitionDuration?: number;
    previousLabel?: string;
    nextLabel?: string;
    pauseLabel?: string;
    playLabel?: string;
    slideLabel?: (index: number, total: number) => string;
    testId?: string;
};

const SWIPE_THRESHOLD = 44;

function normalizeIndex(index: number, count: number) {
    if (count <= 0) return 0;
    return Math.min(Math.max(Math.trunc(index), 0), count - 1);
}

function isEditableTarget(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) return false;
    return target.isContentEditable || target.matches('input, textarea, select');
}

export function Carousel({
    children,
    value,
    defaultValue = 0,
    onValueChange,
    showDots = true,
    arrows = 'always',
    arrowSize = 2,
    arrowVariant = 'surface',
    arrowTone = 'neutral',
    autoplay = false,
    autoplayInterval = 5000,
    showAutoplayControl = true,
    pauseOnHover = true,
    loop = true,
    swipe = true,
    keyboard = true,
    transitionDuration = 360,
    previousLabel = 'Previous slide',
    nextLabel = 'Next slide',
    pauseLabel = 'Pause automatic slide rotation',
    playLabel = 'Resume automatic slide rotation',
    slideLabel = (index, total) => `Slide ${index} of ${total}`,
    className,
    style,
    testId,
    onKeyDown,
    onPointerDown,
    onPointerUp,
    onPointerCancel,
    onMouseEnter,
    onMouseLeave,
    onFocusCapture,
    onBlurCapture,
    ...props
}: CarouselProps) {
    const slides = Children.toArray(children);
    const slideCount = slides.length;
    const [currentValue, setCurrentValue] = useControllableState({
        value,
        defaultValue,
        onChange: onValueChange,
    });
    const activeIndex = normalizeIndex(currentValue, slideCount);
    const reducedMotion = useReducedMotion();
    const [manuallyPaused, setManuallyPaused] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [focusWithin, setFocusWithin] = useState(false);
    const [documentVisible, setDocumentVisible] = useState(true);
    const pointerStartX = useRef<number | null>(null);

    const goTo = useCallback(
        (nextIndex: number) => {
            if (slideCount <= 0) return;
            let resolved = nextIndex;
            if (loop) resolved = (nextIndex + slideCount) % slideCount;
            else resolved = normalizeIndex(nextIndex, slideCount);
            if (resolved !== activeIndex) setCurrentValue(resolved);
        },
        [activeIndex, loop, setCurrentValue, slideCount],
    );
    const previous = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
    const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

    useEffect(() => {
        if (currentValue !== activeIndex) setCurrentValue(activeIndex);
    }, [activeIndex, currentValue, setCurrentValue]);

    useEffect(() => {
        const handleVisibilityChange = () => setDocumentVisible(!document.hidden);
        handleVisibilityChange();
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    const temporarilyPaused = (pauseOnHover && (hovered || focusWithin)) || !documentVisible;
    useEffect(() => {
        if (
            !autoplay ||
            manuallyPaused ||
            temporarilyPaused ||
            reducedMotion ||
            slideCount < 2 ||
            (!loop && activeIndex === slideCount - 1)
        ) {
            return;
        }
        const timer = window.setTimeout(next, Math.max(1000, autoplayInterval));
        return () => window.clearTimeout(timer);
    }, [
        activeIndex,
        autoplay,
        autoplayInterval,
        loop,
        manuallyPaused,
        next,
        reducedMotion,
        slideCount,
        temporarilyPaused,
    ]);

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || !keyboard || isEditableTarget(event.target)) return;
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            previous();
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            next();
        } else if (event.key === 'Home') {
            event.preventDefault();
            goTo(0);
        } else if (event.key === 'End') {
            event.preventDefault();
            goTo(slideCount - 1);
        }
    };

    if (slideCount === 0) return null;

    const showControls = (showDots && slideCount > 1) || (autoplay && showAutoplayControl);
    const previousDisabled = !loop && activeIndex === 0;
    const nextDisabled = !loop && activeIndex === slideCount - 1;
    const actualDuration = reducedMotion ? 0 : Math.max(0, transitionDuration);

    return (
        <div
            {...props}
            className={cn('oui-carousel', className)}
            data-arrows={arrows}
            data-testid={testId}
            role="region"
            aria-roledescription="carousel"
            tabIndex={keyboard ? 0 : props.tabIndex}
            style={
                {
                    ...style,
                    '--oui-carousel-duration': `${actualDuration}ms`,
                } as CSSProperties
            }
            onKeyDown={handleKeyDown}
            onMouseEnter={(event) => {
                setHovered(true);
                onMouseEnter?.(event);
            }}
            onMouseLeave={(event) => {
                setHovered(false);
                onMouseLeave?.(event);
            }}
            onFocusCapture={(event) => {
                setFocusWithin(true);
                onFocusCapture?.(event);
            }}
            onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setFocusWithin(false);
                onBlurCapture?.(event);
            }}
            onPointerDown={(event) => {
                if (swipe && event.pointerType !== 'mouse') pointerStartX.current = event.clientX;
                onPointerDown?.(event);
            }}
            onPointerUp={(event: PointerEvent<HTMLDivElement>) => {
                const startX = pointerStartX.current;
                pointerStartX.current = null;
                if (swipe && startX !== null) {
                    const distance = event.clientX - startX;
                    if (Math.abs(distance) >= SWIPE_THRESHOLD) {
                        if (distance > 0) previous();
                        else next();
                    }
                }
                onPointerUp?.(event);
            }}
            onPointerCancel={(event) => {
                pointerStartX.current = null;
                onPointerCancel?.(event);
            }}
        >
            <div className="oui-carousel-viewport">
                <div
                    className="oui-carousel-track"
                    style={{ transform: `translate3d(-${activeIndex * 100}%, 0, 0)` }}
                >
                    {slides.map((slide, index) => {
                        const active = index === activeIndex;
                        return (
                            <div
                                key={index}
                                className="oui-carousel-slide"
                                role="group"
                                aria-roledescription="slide"
                                aria-label={slideLabel(index + 1, slideCount)}
                                aria-hidden={!active}
                                inert={!active}
                                data-active={active ? 'true' : undefined}
                                data-testid={testId ? `${testId}-slide-${index}` : undefined}
                            >
                                {slide}
                            </div>
                        );
                    })}
                </div>
            </div>

            {arrows !== 'never' && slideCount > 1 ? (
                <>
                    <IconButton
                        className="oui-carousel-arrow oui-carousel-arrow-previous"
                        icon={<LuChevronLeft aria-hidden="true" />}
                        aria-label={previousLabel}
                        disabled={previousDisabled}
                        onClick={previous}
                        v={arrowVariant}
                        tone={arrowTone}
                        size={arrowSize}
                    />
                    <IconButton
                        className="oui-carousel-arrow oui-carousel-arrow-next"
                        icon={<LuChevronRight aria-hidden="true" />}
                        aria-label={nextLabel}
                        disabled={nextDisabled}
                        onClick={next}
                        v={arrowVariant}
                        tone={arrowTone}
                        size={arrowSize}
                    />
                </>
            ) : null}

            {showControls ? (
                <div className="oui-carousel-controls">
                    {showDots && slideCount > 1 ? (
                        <div className="oui-carousel-dots" role="group" aria-label="Choose slide">
                            {slides.map((_, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    className="oui-carousel-dot"
                                    data-active={index === activeIndex ? 'true' : undefined}
                                    aria-label={`Go to ${slideLabel(index + 1, slideCount).toLowerCase()}`}
                                    aria-current={index === activeIndex ? 'true' : undefined}
                                    onClick={() => goTo(index)}
                                />
                            ))}
                        </div>
                    ) : null}
                    {autoplay && showAutoplayControl ? (
                        <IconButton
                            className="oui-carousel-autoplay"
                            size={1}
                            v="ghost"
                            icon={manuallyPaused ? <LuPlay /> : <LuPause />}
                            aria-label={manuallyPaused ? playLabel : pauseLabel}
                            onClick={() => setManuallyPaused((current) => !current)}
                        />
                    ) : null}
                </div>
            ) : null}
        </div>
    );
}
