'use client';

import {
    forwardRef,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type CSSProperties,
    type ReactNode,
} from 'react';
import { LuX } from 'react-icons/lu';

import { cn } from '../../utils/cn';
import { composeRefs } from '../../utils/composeRefs';
import { splitSystemProps, type SystemProps } from '../../theme/systemProps';
import { IconButton } from '../IconButton/IconButton';
import { Spinner } from '../Spinner/Spinner';

export type InlineEditFieldProps = SystemProps & {
    label: ReactNode;
    meta?: ReactNode;
    action?: ReactNode;
    editable?: boolean;
    busy?: boolean;
    disabled?: boolean;
    clearable?: boolean;
    onClear?: () => void;
    onOpen?: () => void;
    clearLabel?: string;
    flash?: number;
    className?: string;
    style?: CSSProperties;
    testId?: string;
};

export const InlineEditField = forwardRef<HTMLDivElement, InlineEditFieldProps>(
    function InlineEditField(
        {
            label,
            meta,
            action,
            editable = true,
            busy = false,
            disabled = false,
            clearable = false,
            onClear,
            onOpen,
            clearLabel = 'Clear',
            flash = 0,
            className,
            style,
            testId,
            ...props
        },
        ref,
    ) {
        const innerRef = useRef<HTMLDivElement | null>(null);
        const labelRef = useRef<HTMLButtonElement | null>(null);
        const extraRef = useRef<HTMLSpanElement | null>(null);
        const actionsRef = useRef<HTMLSpanElement | null>(null);
        const [compact, setCompact] = useState(false);
        const { systemStyle, restProps } = splitSystemProps(props);

        useEffect(() => {
            if (!flash) return;
            const element = innerRef.current;
            if (!element) return;
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.animate(
                [
                    {
                        backgroundColor: 'transparent',
                        boxShadow: '0 0 0 0 var(--oui-primary-surface)',
                    },
                    {
                        backgroundColor: 'var(--oui-primary-surface)',
                        boxShadow: '0 0 0 4px var(--oui-primary-surface)',
                    },
                    {
                        backgroundColor: 'transparent',
                        boxShadow: '0 0 0 0 var(--oui-primary-surface)',
                    },
                    {
                        backgroundColor: 'var(--oui-primary-surface)',
                        boxShadow: '0 0 0 4px var(--oui-primary-surface)',
                    },
                    {
                        backgroundColor: 'transparent',
                        boxShadow: '0 0 0 0 var(--oui-primary-surface)',
                    },
                ],
                { duration: 1400, easing: 'ease-in-out' },
            );
        }, [flash]);

        const showActions = editable && (!disabled || busy);

        useLayoutEffect(() => {
            const wrapper = innerRef.current;
            if (!wrapper) return;

            const updateLayout = () => {
                const availableWidth = wrapper.parentElement?.clientWidth || wrapper.clientWidth;
                const labelWidth = labelRef.current?.scrollWidth ?? 0;
                const extraWidth = extraRef.current?.offsetWidth ?? 0;
                const actionsWidth = actionsRef.current?.offsetWidth ?? 0;
                const visibleGaps = (extraWidth > 0 ? 6 : 0) + (actionsWidth > 0 ? 6 : 0);
                const wideWidth = labelWidth + extraWidth + actionsWidth + visibleGaps + 8;

                setCompact(wideWidth > availableWidth);
            };

            updateLayout();

            const observer = new ResizeObserver(updateLayout);
            observer.observe(wrapper);
            if (wrapper.parentElement) observer.observe(wrapper.parentElement);
            if (labelRef.current) observer.observe(labelRef.current);
            if (extraRef.current) observer.observe(extraRef.current);
            if (actionsRef.current) observer.observe(actionsRef.current);

            return () => observer.disconnect();
        }, [label, meta, action, clearable, editable, disabled, busy]);

        return (
            <div
                ref={composeRefs(innerRef, ref)}
                className={cn('oui-inline-edit', compact && 'oui-inline-edit-compact', className)}
                data-busy={busy ? 'true' : undefined}
                data-disabled={disabled ? 'true' : undefined}
                data-testid={testId}
                style={{ ...systemStyle, ...style }}
                {...restProps}
            >
                <button
                    ref={labelRef}
                    type="button"
                    className="oui-inline-edit-label"
                    disabled={!onOpen || disabled}
                    onClick={onOpen}
                >
                    {label}
                </button>
                {meta || showActions ? (
                    <div className="oui-inline-edit-meta">
                        {meta ? (
                            <span ref={extraRef} className="oui-inline-edit-extra">
                                {meta}
                            </span>
                        ) : null}
                        {showActions ? (
                            <span ref={actionsRef} className="oui-inline-edit-actions">
                                {busy ? <Spinner size={1} /> : action}
                                {clearable && !busy ? (
                                    <IconButton
                                        type="button"
                                        v="ghost"
                                        tone="neutral"
                                        size={1}
                                        aria-label={clearLabel}
                                        className="oui-inline-edit-action"
                                        onClick={onClear}
                                    >
                                        <LuX />
                                    </IconButton>
                                ) : null}
                            </span>
                        ) : null}
                    </div>
                ) : null}
            </div>
        );
    },
);

export type InlineEditMultiFieldProps = SystemProps & {
    children?: ReactNode;
    empty?: ReactNode;
    action?: ReactNode;
    col?: boolean;
    editable?: boolean;
    busy?: boolean;
    disabled?: boolean;
    onOpen?: () => void;
    flash?: number;
    className?: string;
    style?: CSSProperties;
    testId?: string;
};

export const InlineEditMultiField = forwardRef<HTMLDivElement, InlineEditMultiFieldProps>(
    function InlineEditMultiField(
        {
            children,
            empty,
            action,
            col = false,
            editable = true,
            busy = false,
            disabled = false,
            onOpen,
            flash = 0,
            className,
            style,
            testId,
            ...props
        },
        ref,
    ) {
        const innerRef = useRef<HTMLDivElement | null>(null);
        const { systemStyle, restProps } = splitSystemProps(props);

        useEffect(() => {
            if (!flash) return;
            const element = innerRef.current;
            if (!element) return;
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.animate(
                [
                    {
                        backgroundColor: 'transparent',
                        boxShadow: '0 0 0 0 var(--oui-primary-surface)',
                    },
                    {
                        backgroundColor: 'var(--oui-primary-surface)',
                        boxShadow: '0 0 0 4px var(--oui-primary-surface)',
                    },
                    {
                        backgroundColor: 'transparent',
                        boxShadow: '0 0 0 0 var(--oui-primary-surface)',
                    },
                ],
                { duration: 1000, easing: 'ease-in-out' },
            );
        }, [flash]);

        const showActions = editable && (!disabled || busy);

        return (
            <div
                ref={composeRefs(innerRef, ref)}
                className={cn('oui-inline-edit-multi', className)}
                data-col={col ? 'true' : undefined}
                data-busy={busy ? 'true' : undefined}
                data-disabled={disabled ? 'true' : undefined}
                data-clickable={onOpen && !disabled ? 'true' : undefined}
                data-testid={testId}
                role={onOpen && !disabled ? 'button' : undefined}
                tabIndex={onOpen && !disabled ? 0 : undefined}
                style={{ ...systemStyle, ...style }}
                onClick={() => {
                    if (!disabled) onOpen?.();
                }}
                onKeyDown={(event) => {
                    if (disabled || !onOpen) return;
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        onOpen();
                    }
                }}
                {...restProps}
            >
                <div className="oui-inline-edit-multi-items">
                    {children ?? <span className="oui-inline-edit-empty">{empty}</span>}
                </div>
                {showActions ? (
                    <div className="oui-inline-edit-multi-actions">
                        {busy ? <Spinner size={1} /> : action}
                    </div>
                ) : null}
            </div>
        );
    },
);
