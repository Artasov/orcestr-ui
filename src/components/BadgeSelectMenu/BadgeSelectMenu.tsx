'use client';

import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { LuCheck } from 'react-icons/lu';

import { Badge } from '../Badge/Badge.js';
import { Popover } from '../Popover/Popover.js';
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
    size,
    badgeStyle,
    className,
    testId,
    ...props
}: BadgeSelectMenuProps<V>) {
    const [open, setOpen] = useState(false);
    const [highlightedValue, setHighlightedValue] = useState<V | null>(null);
    const { systemStyle, restProps } = splitSystemProps(props);

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
            testId={testId}
            style={{
                cursor: disabled ? 'default' : 'pointer',
                flexShrink: 0,
                opacity: disabled ? 0.6 : 1,
                ...systemStyle,
                ...badgeStyle,
            }}
        >
            {currentLabel}
        </Badge>
    );

    if (disabled) {
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
