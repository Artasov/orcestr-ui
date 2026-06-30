'use client';

import {
    useContext,
    useEffect,
    useId,
    useLayoutEffect,
    useRef,
    type CSSProperties,
    type ReactNode,
} from 'react';
import {LuX} from 'react-icons/lu';

import {useFocusTrap} from '../../hooks/useFocusTrap';
import {usePresence} from '../../hooks/usePresence';
import {useOrcestrUiLocale} from '../../locale/LocaleProvider';
import {OrcestrThemeContext} from '../../theme/useTheme';
import type {ModalAnimation} from '../../theme/themeTypes';
import {cn} from '../../utils/cn';
import {IconButton} from '../IconButton/IconButton';
import {
    lockOverlayScroll,
    useOverlayContext,
    useOverlayLayerIndex,
} from '../Overlay/OverlayProvider';
import {Portal} from '../Portal/Portal';

export type ModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: ReactNode;
    description?: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    maxWidth?: number | string;
    minHeight?: number | string;
    overlayColor?: string;
    overlayOpacity?: number;
    overlayBlur?: number | string;
    borderColor?: string;
    radius?: number | string;
    shadow?: string;
    animationDuration?: number | string;
    animation?: ModalAnimation;
    overlayClassName?: string;
    overlayStyle?: CSSProperties;
    className?: string;
    contentClassName?: string;
    bodyClassName?: string;
    closeOnOverlayClick?: boolean;
    testId?: string;
};

export function Modal({
    open,
    onOpenChange,
    title,
    description,
    children,
    footer,
    maxWidth,
    minHeight,
    overlayColor,
    overlayOpacity,
    overlayBlur,
    borderColor,
    radius,
    shadow,
    animationDuration,
    animation,
    overlayClassName,
    overlayStyle,
    className,
    contentClassName,
    bodyClassName,
    closeOnOverlayClick = true,
    testId,
}: ModalProps) {
    const {copy} = useOrcestrUiLocale();
    const themeContext = useContext(OrcestrThemeContext);
    const overlayContext = useOverlayContext();
    const layerRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const titleId = useId();
    const descriptionId = useId();
    const actualAnimationDuration =
        animationDuration ?? themeContext?.theme.motion.modalDuration ?? '380ms';
    const actualAnimation =
        animation ?? themeContext?.theme.motion.modalAnimation ?? 'zoom-blur';
    const actualMaxWidth =
        maxWidth ?? themeContext?.theme.components.modalMaxWidth ?? 680;
    const actualOverlayColor =
        overlayColor ?? themeContext?.theme.motion.modalOverlayColor ?? 'transparent';
    const actualOverlayOpacity =
        overlayOpacity ?? themeContext?.theme.motion.modalOverlayOpacity ?? 0;
    const actualOverlayBlur =
        overlayBlur ?? themeContext?.theme.motion.modalOverlayBlur ?? 10;
    const actualAnimationMs = durationMs(actualAnimationDuration, 380);
    const actualAnimationEase =
        themeContext?.theme.motion.ease ?? 'cubic-bezier(0.22, 1, 0.36, 1)';
    const {present, state} = usePresence(open, actualAnimationMs);
    const layerIndex = useOverlayLayerIndex(present);
    const zIndex = overlayContext.zIndex.modal + layerIndex * 20;
    const overlayBlurValue = cssLength(actualOverlayBlur) ?? '10px';
    const overlayBackdropFilter = `blur(${overlayBlurValue})`;
    const overlayBackground = modalOverlayBackground(
        actualOverlayColor,
        actualOverlayOpacity,
    );

    useFocusTrap(contentRef, open, () => onOpenChange(false));

    useEffect(() => {
        if (!open) return;
        return lockOverlayScroll();
    }, [open]);

    useLayoutEffect(() => {
        const layer = layerRef.current;
        if (!present || !layer || !layer.animate) return;
        if (state !== 'opening' && state !== 'closing') return;

        const closedFrame = {
            backgroundColor: 'rgb(0 0 0 / 0)',
            backdropFilter: 'blur(0px)',
            WebkitBackdropFilter: 'blur(0px)',
        };
        const openFrame = {
            backgroundColor: overlayBackground,
            backdropFilter: overlayBackdropFilter,
            WebkitBackdropFilter: overlayBackdropFilter,
        };
        const animation = layer.animate(
            state === 'opening'
                ? [closedFrame, openFrame]
                : [openFrame, closedFrame],
            {
                duration: actualAnimationMs,
                easing: actualAnimationEase,
                fill: 'forwards',
            },
        );

        return () => {
            animation.cancel();
        };
    }, [
        actualAnimationEase,
        actualAnimationMs,
        overlayBackdropFilter,
        overlayBackground,
        present,
        state,
    ]);

    if (!present) return null;

    return (
        <Portal>
            <div
                ref={layerRef}
                className={cn('oui-modal-layer', overlayClassName, className)}
                style={{
                    zIndex,
                    '--oui-modal-overlay-background': overlayBackground,
                    '--oui-modal-overlay-blur': overlayBlurValue,
                    '--oui-modal-animation-duration': cssDuration(
                        actualAnimationDuration,
                    ),
                    '--oui-modal-animation-ease': actualAnimationEase,
                    backgroundColor: overlayBackground,
                    backdropFilter: overlayBackdropFilter,
                    WebkitBackdropFilter: overlayBackdropFilter,
                    ...overlayStyle,
                } as CSSProperties}
                data-state={state}
                data-testid={testId}
                onPointerDown={(event) => {
                    if (event.target === event.currentTarget) {
                        if (closeOnOverlayClick) onOpenChange(false);
                    }
                }}
            >
                <div
                    ref={contentRef}
                    role='dialog'
                    aria-modal='true'
                    aria-labelledby={title ? titleId : undefined}
                    aria-describedby={description ? descriptionId : undefined}
                    className={cn('oui-modal-content', contentClassName)}
                    data-state={state}
                    data-animation={actualAnimation}
                    data-testid={testId ? `${testId}-content` : undefined}
                    style={{
                        width:
                            typeof actualMaxWidth === 'number'
                                ? `min(calc(100vw - 24px), ${actualMaxWidth}px)`
                                : `min(calc(100vw - 24px), ${actualMaxWidth})`,
                        minHeight:
                            typeof minHeight === 'number'
                                ? `${minHeight}px`
                                : minHeight,
                        '--oui-modal-border-color': borderColor,
                        '--oui-modal-radius': cssLength(radius),
                        '--oui-modal-shadow': shadow,
                    } as CSSProperties}
                >
                    <div className='oui-modal-header'>
                        <div className='oui-modal-title-wrap'>
                            {title ? (
                                <h2 id={titleId} className='oui-modal-title'>
                                    {title}
                                </h2>
                            ) : null}
                            {description ? (
                                <p
                                    id={descriptionId}
                                    className='oui-modal-description'
                                >
                                    {description}
                                </p>
                            ) : null}
                        </div>
                        <IconButton
                            v='ghost'
                            icon={<LuX size={18} />}
                            aria-label={copy.common.close}
                            onClick={() => onOpenChange(false)}
                        />
                    </div>
                    <div className={cn('oui-modal-body', bodyClassName)}>
                        {children}
                    </div>
                    {footer ? <div className='oui-modal-footer'>{footer}</div> : null}
                </div>
            </div>
        </Portal>
    );
}

function cssLength(value: number | string | undefined) {
    if (value === undefined) return undefined;
    return typeof value === 'number' ? `${value}px` : value;
}

function cssDuration(value: number | string) {
    return typeof value === 'number' ? `${value}ms` : value;
}

function durationMs(value: number | string | undefined, fallbackMs: number) {
    if (value === undefined) return fallbackMs;
    if (typeof value === 'number') return Math.max(0, value);

    const normalized = value.trim().toLowerCase();
    const numeric = Number.parseFloat(normalized);
    if (!Number.isFinite(numeric)) return fallbackMs;
    if (normalized.endsWith('ms')) return Math.max(0, numeric);
    if (normalized.endsWith('s')) return Math.max(0, numeric * 1000);
    return Math.max(0, numeric);
}

function modalOverlayBackground(color: string, opacity: number) {
    const normalizedOpacity = Math.max(0, Math.min(1, opacity));

    if (normalizedOpacity === 0 || color.trim().toLowerCase() === 'transparent') {
        return 'rgb(0 0 0 / 0.001)';
    }

    const rgb = hexToRgb(color);
    if (rgb) {
        return `rgb(${rgb.r} ${rgb.g} ${rgb.b} / ${normalizedOpacity})`;
    }

    return `color-mix(in srgb, ${color} ${Math.round(normalizedOpacity * 100)}%, transparent)`;
}

function hexToRgb(value: string) {
    const color = value.trim();

    if (/^#[0-9a-f]{3}$/i.test(color)) {
        return {
            r: Number.parseInt(color[1] + color[1], 16),
            g: Number.parseInt(color[2] + color[2], 16),
            b: Number.parseInt(color[3] + color[3], 16),
        };
    }

    if (/^#[0-9a-f]{6}$/i.test(color)) {
        return {
            r: Number.parseInt(color.slice(1, 3), 16),
            g: Number.parseInt(color.slice(3, 5), 16),
            b: Number.parseInt(color.slice(5, 7), 16),
        };
    }

    return null;
}
