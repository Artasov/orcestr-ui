'use client';

import {
    useContext,
    useEffect,
    useId,
    useMemo,
    useRef,
    type CSSProperties,
    type ReactNode,
} from 'react';
import {LuX} from 'react-icons/lu';

import {useDisclosure} from '../../hooks/useDisclosure';
import {useFocusTrap} from '../../hooks/useFocusTrap';
import {usePresence} from '../../hooks/usePresence';
import {useOrcestrUiLocale} from '../../locale/LocaleProvider';
import {OrcestrThemeContext} from '../../theme/useTheme';
import {cn} from '../../utils/cn';
import {IconButton} from '../IconButton/IconButton';
import {
    lockOverlayScroll,
    useOverlayContext,
    useOverlayLayerIndex,
} from '../Overlay/OverlayProvider';
import {Portal} from '../Portal/Portal';

export type DrawerSide = 'bottom' | 'left' | 'right' | 'top';

export type DrawerProps = {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    side?: DrawerSide;
    size?: number | string;
    title?: ReactNode;
    description?: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    modal?: boolean;
    trapFocus?: boolean;
    lockScroll?: boolean;
    closeOnBackdropClick?: boolean;
    closeOnEscape?: boolean;
    showBackdrop?: boolean;
    showCloseButton?: boolean;
    className?: string;
    panelClassName?: string;
    bodyClassName?: string;
    backdropClassName?: string;
    style?: CSSProperties;
    panelStyle?: CSSProperties;
    backdropStyle?: CSSProperties;
    testId?: string;
};

export function Drawer({
    open,
    defaultOpen,
    onOpenChange,
    side = 'right',
    size,
    title,
    description,
    children,
    footer,
    modal = true,
    trapFocus = modal,
    lockScroll = modal,
    closeOnBackdropClick = true,
    closeOnEscape = true,
    showBackdrop = modal,
    showCloseButton = true,
    className,
    panelClassName,
    bodyClassName,
    backdropClassName,
    style,
    panelStyle,
    backdropStyle,
    testId,
}: DrawerProps) {
    const {copy} = useOrcestrUiLocale();
    const themeContext = useContext(OrcestrThemeContext);
    const overlay = useOverlayContext();
    const disclosure = useDisclosure({open, defaultOpen, onOpenChange});
    const {open: isOpen, setOpen} = disclosure;
    const duration = themeContext?.theme.motion.modalDuration ?? '260ms';
    const durationMs = durationToMs(duration, 260);
    const ease = themeContext?.theme.motion.ease ?? 'cubic-bezier(0.22, 1, 0.36, 1)';
    const {present, state} = usePresence(isOpen, durationMs);
    const layerIndex = useOverlayLayerIndex(present);
    const zIndex = overlay.zIndex.modal + layerIndex * 20;
    const panelRef = useRef<HTMLDivElement | null>(null);
    const titleId = useId();
    const descriptionId = useId();
    const resolvedSize = cssSize(size ?? defaultDrawerSize(side));
    const drawerStyle = useMemo(
        () => ({
            '--oui-drawer-size': resolvedSize,
            '--oui-drawer-duration': cssDuration(duration),
            '--oui-drawer-ease': ease,
            zIndex,
            ...style,
        }) as CSSProperties,
        [duration, ease, resolvedSize, style, zIndex],
    );

    useFocusTrap(panelRef, present && trapFocus);

    useEffect(() => {
        if (!present || !closeOnEscape) return;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Escape') return;
            event.preventDefault();
            setOpen(false);
        };
        document.addEventListener('keydown', handleKeyDown, true);
        return () => document.removeEventListener('keydown', handleKeyDown, true);
    }, [closeOnEscape, present, setOpen]);

    useEffect(() => {
        if (!present || !lockScroll) return;
        return lockOverlayScroll();
    }, [lockScroll, present]);

    if (!present) return null;

    return (
        <Portal>
            <div
                className={cn('oui-drawer-layer', className)}
                data-state={state}
                data-side={side}
                data-modal={modal ? 'true' : undefined}
                data-testid={testId}
                style={drawerStyle}
            >
                {showBackdrop ? (
                    <button
                        type='button'
                        aria-label={copy.common.close}
                        className={cn('oui-drawer-backdrop', backdropClassName)}
                        data-state={state}
                        data-testid={testId ? `${testId}-backdrop` : undefined}
                        style={backdropStyle}
                        onClick={() => {
                            if (closeOnBackdropClick) setOpen(false);
                        }}
                    />
                ) : null}
                <div
                    ref={panelRef}
                    role={modal ? 'dialog' : 'complementary'}
                    aria-modal={modal ? 'true' : undefined}
                    aria-labelledby={title ? titleId : undefined}
                    aria-describedby={description ? descriptionId : undefined}
                    className={cn('oui-drawer-panel', panelClassName)}
                    data-state={state}
                    data-side={side}
                    data-testid={testId ? `${testId}-panel` : undefined}
                    style={panelStyle}
                >
                    {title || description || showCloseButton ? (
                        <div className='oui-drawer-header'>
                            <div className='oui-drawer-title-wrap'>
                                {title ? (
                                    <h2 id={titleId} className='oui-drawer-title'>
                                        {title}
                                    </h2>
                                ) : null}
                                {description ? (
                                    <p
                                        id={descriptionId}
                                        className='oui-drawer-description'
                                    >
                                        {description}
                                    </p>
                                ) : null}
                            </div>
                            {showCloseButton ? (
                                <IconButton
                                    v='ghost'
                                    icon={<LuX size={18} />}
                                    aria-label={copy.common.close}
                                    onClick={() => setOpen(false)}
                                />
                            ) : null}
                        </div>
                    ) : null}
                    <div className={cn('oui-drawer-body', bodyClassName)}>
                        {children}
                    </div>
                    {footer ? <div className='oui-drawer-footer'>{footer}</div> : null}
                </div>
            </div>
        </Portal>
    );
}

function defaultDrawerSize(side: DrawerSide) {
    return side === 'left' || side === 'right' ? 'min(86vw, 360px)' : 'min(80vh, 420px)';
}

function cssSize(value: number | string) {
    return typeof value === 'number' ? `${value}px` : value;
}

function cssDuration(value: number | string) {
    return typeof value === 'number' ? `${value}ms` : value;
}

function durationToMs(value: number | string, fallback: number) {
    if (typeof value === 'number') return Math.max(0, value);
    const normalized = value.trim().toLowerCase();
    const parsed = Number.parseFloat(normalized);
    if (!Number.isFinite(parsed)) return fallback;
    if (normalized.endsWith('ms')) return Math.max(0, parsed);
    if (normalized.endsWith('s')) return Math.max(0, parsed * 1000);
    return Math.max(0, parsed);
}
