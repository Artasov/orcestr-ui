import type {DateRangePickerValue} from '../DateRangePicker/DateRangePicker';

import type {DateRangePreset} from './DateRangePresetPicker';

export function resolveDateRangePreset(
    preset: DateRangePreset,
    today = new Date().toISOString().slice(0, 10),
): DateRangePickerValue {
    if (preset === 'today') return {from: today, to: today};

    if (preset === 'week') {
        return {
            from: shiftDate(today, -6),
            to: today,
        };
    }

    return {
        from: `${today.slice(0, 8)}01`,
        to: today,
    };
}

function shiftDate(value: string, days: number): string {
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
}
