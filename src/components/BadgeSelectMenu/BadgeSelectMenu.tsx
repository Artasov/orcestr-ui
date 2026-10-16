'use client';

import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { LuCheck } from 'react-icons/lu';

import { Badge } from '../Badge/Badge.js';
import { Popover } from '../Popover/Popover.js';
import { Spinner } from '../Spinner/Spinner.js';
import {
    splitSystemProps,
    type SystemProps,
    type ToneInput,
    type UiSize,
} from '../../theme/systemProps.js';
import { cn } from '../../utils/cn.js';

export type BadgeSelectItem<V extends string = string> = {
    value: V;
    label: ReactNode;
    disabled?: boolean;
};

export type BadgeSelectMenuProps<V extends string = string> = SystemProps & {
    value: V | null;
    items: ReadonlyArray<BadgeSelectItem<V>>;
    onValueChange: (value: V) => void;
    tone?: ToneInput;
    width?: number | string;
    maxHeight?: number;
    disabled?: boolean;
    loading?: boolean;
    icon?: ReactNode;
    size?: UiSize;
    badgeStyle?: CSSProperties;
    className?: string;
    testId?: string;
};

export function BadgeSelectMenu<V extends string = string>({
    value,
    items,
    onValueChange,
    tone = 'neutral',
    width = 220,
    maxHeight = 280,
    disabled = false,
    loading = false,
    icon,
    size,
    badgeStyle,
    className,
    testId,
    ...props
}: BadgeSelectMenuProps<V>) {
    const [open, setOpen] = useState(false);
    const [highlightedValue, setHighlightedValue] = useState<V | null>(null);
    const { systemStyle, restProps } = splitSystemProps(props);
    const locked = disabled || loading;

    const currentValue = value ?? items[0]?.value ?? null;
    const currentItem = useMemo(
        () => items.find((item) => item.value === currentValue) ?? null,
        [currentValue, items],
    );
    const currentLabel = currentItem?.label ?? currentValue;

    const triggerBadge = (
        <Badge
            tone={tone}
            v="soft"
            r={7}
            size={size}
            data-state={open ? 'open' : 'closed'}
            className="oui-badge-select-trigger"
            icon={icon !== undefined || loading ? <span aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '1em', height: '1em', flexShrink: 0 }}>{loading ? <Spinner size={1} style={{ width: '1em', height: '1em' }} /> : icon}</span> : undefined}
            testId={testId}
            role={locked ? undefined : 'button'}
            tabIndex={locked ? undefined : 0}
            aria-disabled={locked || undefined}
            aria-busy={loading || undefined}
            aria-haspopup={locked ? undefined : 'listbox'}
            onKeyDown={(event) => {
                if (locked || (event.key !== 'Enter' && event.key !== ' ')) return;
                event.preventDefault();
                setOpen((current) => !current);
            }}
            style={{
                cursor: locked ? 'default' : 'pointer',
                flexShrink: 0,
                opacity: loading ? 1 : disabled ? 0.6 : 1,
                ...systemStyle,
                ...badgeStyle,
            }}
        >
            {currentLabel}
        </Badge>
    );

    if (locked) {
        return triggerBadge;
    }

    return (
        <Popover
            open={open}
            onOpenChange={(nextOpen) => {
                setOpen(nextOpen);
                if (!nextOpen) setHighlightedValue(null);
            }}
            trigger={triggerBadge}
            className={cn('oui-select-content oui-badge-select-content', className)}
            contentStyle={{
                width,
                maxWidth: 320,
            }}
            sideOffset={4}
            testId={testId ? `${testId}-menu` : undefined}
            {...restProps}
        >
            <div
                className="oui-combobox-scroll oui-combobox-options oui-badge-select-options"
                style={{ maxHeight }}
                role="listbox"
                onKeyDown={(event) => {
                    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
                    const options = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not([disabled])')];
                    if (!options.length) return;
                    event.preventDefault();
                    const current = options.findIndex((option) => option === document.activeElement);
                    const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : (current + (event.key === 'ArrowUp' ? -1 : 1) + options.length) % options.length;
                    options[next].focus();
                }}
            >
                {items.map((item) => {
                    const isSelected = item.value === currentValue;
                    const isHighlighted = item.value === highlightedValue;
                    return (
                        <button
                            key={item.value}
                            type="button"
                            className="oui-combobox-option oui-badge-select-option"
                            data-selected={isSelected ? 'true' : 'false'}
                            data-highlighted={isHighlighted ? 'true' : 'false'}
                            disabled={item.disabled}
                            role="option"
                            aria-selected={isSelected}
                            onMouseEnter={() => {
                                if (!item.disabled) setHighlightedValue(item.value);
                            }}
                            onFocus={() => {
                                if (!item.disabled) setHighlightedValue(item.value);
                            }}
                            onClick={() => {
                                if (item.disabled) return;
                                setOpen(false);
                                setHighlightedValue(null);
                                onValueChange(item.value);
                            }}
                        >
                            <span className="oui-combobox-option-main">{item.label}</span>
                            {isSelected ? (
                                <LuCheck className="oui-combobox-check" size={15} />
                            ) : null}
                        </button>
                    );
                })}
            </div>
        </Popover>
    );
}
