'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type ReactNode,
} from 'react';
import {LuX} from 'react-icons/lu';

import {useOrcestrUiLocale} from '../../locale/LocaleProvider';
import {Button} from '../Button/Button';
import {IconButton} from '../IconButton/IconButton';
import {useOverlayContext} from '../Overlay/OverlayProvider';
import {Portal} from '../Portal/Portal';

export type ToastTone = 'info' | 'success' | 'warning' | 'danger';
export type ToastPosition =
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';

export type ToastAction = {
    label: string;
    onClick: () => void;
    closeOnClick?: boolean;
};

export type ToastOptions = {
    title: ReactNode;
    message?: ReactNode;
    tone?: ToastTone;
    position?: ToastPosition;
    background?: string;
    blur?: number | string | false;
    borderColor?: string;
    shadow?: string;
    progressColor?: string;
    action?: ToastAction;
    duration?: number | null;
    dedupeKey?: string;
    dismissible?: boolean;
    closeButton?: boolean;
};

export type ToastInput = string | ToastOptions;

type ToastItem = ToastOptions & {
    id: number;
    tone: ToastTone;
    position: ToastPosition;
    createdAt: number;
    state: 'open' | 'closing';
};

type ToastContextValue = {
    push: (input: ToastInput, tone?: ToastTone) => number;
    success: (input: ToastInput) => number;
    error: (input: ToastInput) => number;
    warning: (input: ToastInput) => number;
    info: (input: ToastInput) => number;
    dismiss: (id: number) => void;
    clear: () => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);
const DEFAULT_TOAST_DURATION = 4200;
const MAX_VISIBLE_TOASTS = 4;
const TOAST_EXIT_FALLBACK_MS = 5000;
const DEFAULT_TOAST_POSITION: ToastPosition = 'bottom-right';
const toastPositions: ToastPosition[] = [
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
];

function normalizeToast(
    input: ToastInput,
    tone?: ToastTone,
    defaultPosition: ToastPosition = DEFAULT_TOAST_POSITION,
): Omit<ToastItem, 'id' | 'createdAt' | 'state'> {
    if (typeof input === 'string') {
        return {
            title: input,
            tone: tone ?? 'info',
            position: defaultPosition,
        };
    }
    return {
        ...input,
        tone: tone ?? input.tone ?? 'info',
        position: input.position ?? defaultPosition,
    };
}

export function ToastProvider({
    children,
    defaultPosition = DEFAULT_TOAST_POSITION,
    maxVisible = MAX_VISIBLE_TOASTS,
    testId,
}: {
    children: ReactNode;
    defaultPosition?: ToastPosition;
    maxVisible?: number;
    testId?: string;
}) {
    const overlay = useOverlayContext();
    const [items, setItems] = useState<ToastItem[]>([]);
    const itemsRef = useRef<ToastItem[]>([]);
    const nextId = useRef(1);
    const timeoutIds = useRef(new Map<number, number>());
    const removalIds = useRef(new Map<number, number>());

    const setToastItems = useCallback((update: (current: ToastItem[]) => ToastItem[]) => {
        setItems((current) => {
            const next = update(current);
            itemsRef.current = next;
            return next;
        });
    }, []);

    const clearTimer = useCallback((id: number) => {
        const timeoutId = timeoutIds.current.get(id);
        if (timeoutId !== undefined) {
            window.clearTimeout(timeoutId);
            timeoutIds.current.delete(id);
        }
    }, []);

    const clearRemovalTimer = useCallback((id: number) => {
        const timeoutId = removalIds.current.get(id);
        if (timeoutId !== undefined) {
            window.clearTimeout(timeoutId);
            removalIds.current.delete(id);
        }
    }, []);

    const removeToast = useCallback((id: number) => {
        clearRemovalTimer(id);
        setToastItems((current) => current.filter((item) => item.id !== id));
    }, [clearRemovalTimer, setToastItems]);

    const dismiss = useCallback((id: number) => {
        clearTimer(id);
        setToastItems((current) =>
            current.map((item) =>
                item.id === id ? {...item, state: 'closing'} : item,
            ),
        );
        clearRemovalTimer(id);
        const removalId = window.setTimeout(() => {
            removeToast(id);
        }, TOAST_EXIT_FALLBACK_MS);
        removalIds.current.set(id, removalId);
    }, [clearRemovalTimer, clearTimer, removeToast, setToastItems]);

    const clear = useCallback(() => {
        timeoutIds.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
        timeoutIds.current.clear();
        removalIds.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
        removalIds.current.clear();
        setToastItems(() => []);
    }, [setToastItems]);

    const scheduleDismiss = useCallback((item: ToastItem) => {
        clearTimer(item.id);
        if (item.duration === null) return;
        const duration = item.duration ?? DEFAULT_TOAST_DURATION;
        if (duration <= 0) return;
        const timeoutId = window.setTimeout(() => dismiss(item.id), duration);
        timeoutIds.current.set(item.id, timeoutId);
    }, [clearTimer, dismiss]);

    const push = useCallback((input: ToastInput, tone?: ToastTone) => {
        const normalized = normalizeToast(input, tone, defaultPosition);
        const existingItem = normalized.dedupeKey
            ? itemsRef.current.find((item) => item.dedupeKey === normalized.dedupeKey)
            : null;
        if (existingItem) clearRemovalTimer(existingItem.id);
        const item = {
            ...normalized,
            id: existingItem?.id ?? nextId.current++,
            createdAt: Date.now(),
            state: 'open' as const,
        };

        setToastItems((current) => {
            const nextItems = existingItem
                ? current.map((currentItem) =>
                    currentItem.id === existingItem.id ? item : currentItem,
                )
                : [...current, item];
            return limitToastItems(nextItems, maxVisible);
        });
        scheduleDismiss(item);
        return item.id;
    }, [
        clearRemovalTimer,
        defaultPosition,
        maxVisible,
        scheduleDismiss,
        setToastItems,
    ]);

    const value = useMemo(
        () => ({
            push,
            success: (input: ToastInput) => push(input, 'success'),
            error: (input: ToastInput) => push(input, 'danger'),
            warning: (input: ToastInput) => push(input, 'warning'),
            info: (input: ToastInput) => push(input, 'info'),
            dismiss,
            clear,
        }),
        [clear, dismiss, push],
    );

    useEffect(() => clear, [clear]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            <Portal>
                {toastPositions.map((position) => {
                    const positionItems = items.filter(
                        (item) => item.position === position,
                    );
                    if (positionItems.length === 0) return null;
                    return (
                        <div
                            key={position}
                            className='oui-toast-viewport'
                            data-position={position}
                            data-testid={testId ? `${testId}-${position}` : undefined}
                            aria-live='polite'
                            aria-relevant='additions text'
                            style={{zIndex: overlay.zIndex.toast}}
                        >
                            {positionItems.map((item) => (
                                <ToastCard
                                    key={item.id}
                                    item={item}
                                    onDismiss={dismiss}
                                    onExited={removeToast}
                                    testId={testId ? `${testId}-${item.id}` : undefined}
                                />
                            ))}
                        </div>
                    );
                })}
            </Portal>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used inside ToastProvider');
    }
    return context;
}

function ToastCard({
    item,
    onDismiss,
    onExited,
    testId,
}: {
    item: ToastItem;
    onDismiss: (id: number) => void;
    onExited: (id: number) => void;
    testId?: string;
}) {
    const {copy} = useOrcestrUiLocale();
    const duration = toastDuration(item);
    const hasProgress = item.duration !== null && duration > 0;
    const effectiveBlur =
        item.blur !== undefined ? cssLength(item.blur) : 'var(--oui-toast-blur, 14px)';
    const style = {
        ...(item.background ? {'--oui-toast-bg': item.background} : null),
        '--oui-toast-effective-blur': effectiveBlur,
        ...(item.borderColor ? {'--oui-toast-custom-border-color': item.borderColor} : null),
        ...(item.shadow ? {'--oui-toast-shadow': item.shadow} : null),
        ...(item.progressColor ? {'--oui-toast-progress-color': item.progressColor} : null),
    } as CSSProperties;
    const blurStyle = {
        backdropFilter: `blur(${effectiveBlur})`,
        WebkitBackdropFilter: `blur(${effectiveBlur})`,
    } as CSSProperties;

    return (
        <div
            className='oui-toast-frame'
            data-position={item.position}
            data-state={item.state}
            style={style}
            onAnimationEnd={(event) => {
                if (event.animationName === 'ouiToastOut') {
                    onExited(item.id);
                }
            }}
        >
            <span className='oui-toast-backdrop' aria-hidden='true' style={blurStyle} />
            <div
                className='oui-toast'
                data-tone={item.tone}
                data-state={item.state}
                data-position={item.position}
                data-clickable={item.dismissible === false ? undefined : 'true'}
                data-testid={testId}
                role={item.tone === 'danger' ? 'alert' : 'status'}
                style={blurStyle}
                onClick={() => {
                    if (item.dismissible !== false) onDismiss(item.id);
                }}
            >
                <div className='oui-toast-main'>
                    <div className='oui-toast-title'>{item.title}</div>
                    {item.message ? (
                        <div className='oui-toast-message'>{item.message}</div>
                    ) : null}
                    {item.action ? (
                        <Button
                            className='oui-toast-action'
                            size={1}
                            v='surface'
                            tone={item.tone}
                            onClick={(event) => {
                                event.stopPropagation();
                                item.action?.onClick();
                                if (item.action?.closeOnClick !== false) {
                                    onDismiss(item.id);
                                }
                            }}
                        >
                            {item.action.label}
                        </Button>
                    ) : null}
                </div>
                {item.closeButton ? (
                    <IconButton
                        className='oui-toast-close'
                        size={1}
                        v='ghost'
                        icon={<LuX size={14} />}
                        aria-label={copy.common.dismissNotification}
                        onClick={(event) => {
                            event.stopPropagation();
                            onDismiss(item.id);
                        }}
                    />
                ) : null}
                {hasProgress ? (
                    <span
                        key={item.createdAt}
                        className='oui-toast-progress'
                        style={{'--oui-toast-duration': `${duration}ms`} as CSSProperties}
                    />
                ) : null}
            </div>
        </div>
    );
}

function cssLength(value: number | string | false) {
    if (value === false) return '0px';
    return typeof value === 'number' ? `${value}px` : value;
}

function toastDuration(item: ToastItem) {
    return item.duration ?? DEFAULT_TOAST_DURATION;
}

function limitToastItems(items: ToastItem[], maxVisible: number) {
    if (maxVisible <= 0) return items;
    const buckets = new Map<ToastPosition, ToastItem[]>();
    for (const item of items) {
        const bucket = buckets.get(item.position) ?? [];
        bucket.push(item);
        buckets.set(item.position, bucket);
    }

    const visibleIds = new Set<number>();
    for (const bucket of buckets.values()) {
        for (const item of bucket.slice(-maxVisible)) {
            visibleIds.add(item.id);
        }
    }

    return items.filter((item) => visibleIds.has(item.id));
}
