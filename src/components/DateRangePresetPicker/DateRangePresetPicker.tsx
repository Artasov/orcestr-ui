'use client';

import type { ReactNode } from 'react';
import { LuCalendarDays } from 'react-icons/lu';

import { useOrcestrUiLocale } from '../../locale/LocaleProvider.js';
import { Button, type ButtonProps } from '../Button/Button.js';
import { IconButton } from '../IconButton/IconButton.js';
import { Menu, type MenuItem } from '../Menu/Menu.js';
import type { DateRangePickerValue } from '../DateRangePicker/DateRangePicker.js';
import { Text, type TextProps } from '../Text/Text.js';
import { resolveDateRangePreset } from './DateRangePresetPickerState.js';

export type DateRangePreset = 'today' | 'week' | 'month';

export type DateRangePresetDefinition<TKey extends string = string> = {
    key: TKey;
    label: ReactNode;
    range: DateRangePickerValue | ((today: string) => DateRangePickerValue);
    icon?: ReactNode;
    description?: ReactNode;
    disabled?: boolean;
};

export type DateRangePresetOption<TKey extends string = DateRangePreset> =
    DateRangePreset | DateRangePresetDefinition<TKey>;

export type DateRangePresetPickerProps<TKey extends string = DateRangePreset> = {
    onSelect?: (presetKey: DateRangePreset | TKey) => void;
    onValueChange?: (value: DateRangePickerValue, presetKey: DateRangePreset | TKey) => void;
    presets?: ReadonlyArray<DateRangePresetOption<TKey>>;
    today?: string;
    trigger?: ReactNode;
    triggerIcon?: ReactNode;
    triggerLabel?: ReactNode;
    triggerButtonProps?: Omit<ButtonProps, 'children' | 'leftIcon' | 'rightIcon'>;
    triggerLabelProps?: Omit<TextProps, 'children'>;
    testId?: string;
};

export function DateRangePresetPicker<TKey extends string = DateRangePreset>({
    onSelect,
    onValueChange,
    presets = ['today', 'week', 'month'],
    today,
    trigger,
    triggerIcon = <LuCalendarDays size={15} />,
    triggerLabel,
    triggerButtonProps,
    triggerLabelProps,
    testId,
}: DateRangePresetPickerProps<TKey>) {
    const { copy } = useOrcestrUiLocale();
    const resolvedToday = today ?? new Date().toISOString().slice(0, 10);
    const items: MenuItem[] = presets.map((preset) => {
        const definition = normalizePreset(preset, copy.dates);
        return {
            key: definition.key,
            label: definition.label,
            icon: definition.icon,
            description: definition.description,
            disabled: definition.disabled,
            onSelect: () => {
                onSelect?.(definition.key);
                onValueChange?.(resolvePresetRange(definition, resolvedToday), definition.key);
            },
        };
    });

    const defaultTrigger =
        triggerLabel === undefined ? (
            <IconButton
                size={2}
                v="ghost"
                icon={triggerIcon}
                aria-label={copy.dates.quickPeriods}
                type="button"
                testId={testId ? `${testId}-trigger` : undefined}
            />
        ) : (
            <Button
                size={2}
                v="surface"
                leftIcon={triggerIcon}
                type="button"
                testId={testId ? `${testId}-trigger` : undefined}
                {...triggerButtonProps}
            >
                <Text {...triggerLabelProps}>{triggerLabel}</Text>
            </Button>
        );

    return (
        <Menu
            side="top"
            align="start"
            items={items}
            testId={testId}
            trigger={trigger ?? defaultTrigger}
        />
    );
}

function normalizePreset<TKey extends string>(
    preset: DateRangePresetOption<TKey>,
    copy: { today: string; week: string; month: string },
): DateRangePresetDefinition<DateRangePreset | TKey> {
    if (typeof preset !== 'string') return preset;
    return {
        key: preset,
        label: presetLabel(preset, copy),
        range: (today) => resolveDateRangePreset(preset, today),
    };
}

function resolvePresetRange(
    preset: DateRangePresetDefinition<string>,
    today: string,
): DateRangePickerValue {
    return typeof preset.range === 'function' ? preset.range(today) : preset.range;
}

function presetLabel(
    preset: DateRangePreset,
    copy: { today: string; week: string; month: string },
): string {
    if (preset === 'today') return copy.today;
    if (preset === 'week') return copy.week;
    return copy.month;
}
