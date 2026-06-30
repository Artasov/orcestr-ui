'use client';

import {LuCalendarDays} from 'react-icons/lu';

import {useOrcestrUiLocale} from '../../locale/LocaleProvider';
import {IconButton} from '../IconButton/IconButton';
import {Menu, type MenuItem} from '../Menu/Menu';
import type {DateRangePickerValue} from '../DateRangePicker/DateRangePicker';
import {resolveDateRangePreset} from './DateRangePresetPickerState';

export type DateRangePreset = 'today' | 'week' | 'month';

export function DateRangePresetPicker({
    onSelect,
    onValueChange,
    presets = ['today', 'week', 'month'],
    today,
    testId,
}: {
    onSelect?: (preset: DateRangePreset) => void;
    onValueChange?: (value: DateRangePickerValue, preset: DateRangePreset) => void;
    presets?: ReadonlyArray<DateRangePreset>;
    today?: string;
    testId?: string;
}) {
    const {copy} = useOrcestrUiLocale();
    const items: MenuItem[] = presets.map((preset) => ({
        key: preset,
        label: presetLabel(preset, copy.dates),
        onSelect: () => {
            onSelect?.(preset);
            onValueChange?.(resolveDateRangePreset(preset, today), preset);
        },
    }));

    return (
        <Menu
            side='top'
            align='start'
            items={items}
            testId={testId}
            trigger={
                <IconButton
                    size={2}
                    v='ghost'
                    icon={<LuCalendarDays size={15} />}
                    aria-label={copy.dates.quickPeriods}
                    type='button'
                    testId={testId ? `${testId}-trigger` : undefined}
                />
            }
        />
    );
}

function presetLabel(
    preset: DateRangePreset,
    copy: {today: string; week: string; month: string},
): string {
    if (preset === 'today') return copy.today;
    if (preset === 'week') return copy.week;
    return copy.month;
}
