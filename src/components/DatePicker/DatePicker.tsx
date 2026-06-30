'use client';

import {useMemo, useState, type ReactNode} from 'react';
import {LuCalendarDays, LuChevronLeft, LuChevronRight} from 'react-icons/lu';

import {useOrcestrUiLocale} from '../../locale/LocaleProvider';
import {Button} from '../Button/Button';
import {IconButton} from '../IconButton/IconButton';
import {Popover} from '../Popover/Popover';
import {TextField} from '../TextField/TextField';
import {
    calendarMonthState,
    clampDate,
    formatDateLabel,
    formatMonthLabel,
    monthCursorForDate,
    shiftMonth,
    weekdayLabels,
    type DatePickerDisabledDate,
} from './DatePickerState';

export type DatePickerProps = {
    value: string;
    onValueChange: (value: string) => void;
    min?: string;
    max?: string;
    disabledDate?: DatePickerDisabledDate;
    placeholder?: string;
    clearable?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    openCalendarLabel?: string;
    previousMonthLabel?: string;
    nextMonthLabel?: string;
    todayLabel?: ReactNode;
    locale?: string;
    testId?: string;
};

export function DatePicker({
    value,
    onValueChange,
    min,
    max,
    disabledDate,
    placeholder,
    clearable = true,
    disabled = false,
    readOnly = false,
    openCalendarLabel,
    previousMonthLabel,
    nextMonthLabel,
    todayLabel,
    locale,
    testId,
}: DatePickerProps) {
    const {copy, locale: contextLocale} = useOrcestrUiLocale();
    const actualLocale = locale ?? contextLocale;
    const [open, setOpen] = useState(false);
    const [cursorMonth, setCursorMonth] = useState(() => monthCursorForDate(value));
    const monthState = useMemo(
        () =>
            calendarMonthState({
                cursorMonth,
                selectedDate: value,
                min,
                max,
                disabledDate,
            }),
        [cursorMonth, disabledDate, max, min, value],
    );
    const weekdays = useMemo(() => weekdayLabels(actualLocale), [actualLocale]);
    const displayValue = value ? formatDateLabel(value, actualLocale) : '';

    const selectDate = (nextValue: string) => {
        onValueChange(clampDate(nextValue, min, max));
        setOpen(false);
    };

    return (
        <Popover
            open={open}
            onOpenChange={(nextOpen) => {
                if (readOnly && nextOpen) return;
                if (nextOpen) setCursorMonth(monthCursorForDate(value));
                setOpen(nextOpen);
            }}
            disabled={disabled || readOnly}
            matchTriggerWidth={false}
            sideOffset={6}
            testId={testId ? `${testId}-popover` : undefined}
            trigger={
                <TextField
                    value={displayValue}
                    placeholder={placeholder}
                    readOnly
                    disabled={disabled}
                    clearable={clearable && Boolean(value) && !readOnly}
                    testId={testId}
                    aria-label={openCalendarLabel ?? copy.common.openCalendar}
                    onClear={() => onValueChange('')}
                    rightSlot={
                        <span
                            className='oui-date-picker-trigger'
                            aria-hidden
                        >
                            <LuCalendarDays size={16} />
                        </span>
                    }
                />
            }
            className='oui-date-picker-popover'
        >
            <div className='oui-date-picker-panel'>
                <div className='oui-date-picker-head'>
                    <IconButton
                        size={1}
                        v='ghost'
                        type='button'
                        icon={<LuChevronLeft size={16} />}
                        aria-label={previousMonthLabel ?? copy.common.previous}
                        onClick={() => setCursorMonth((current) => shiftMonth(current, -1))}
                    />
                    <strong>{formatMonthLabel(cursorMonth, actualLocale)}</strong>
                    <IconButton
                        size={1}
                        v='ghost'
                        type='button'
                        icon={<LuChevronRight size={16} />}
                        aria-label={nextMonthLabel ?? copy.common.next}
                        onClick={() => setCursorMonth((current) => shiftMonth(current, 1))}
                    />
                </div>
                <div className='oui-date-picker-weekdays'>
                    {weekdays.map((weekday) => (
                        <span key={weekday}>{weekday}</span>
                    ))}
                </div>
                <div className='oui-date-picker-grid'>
                    {monthState.weeks.flatMap((week) =>
                        week.map((day) => (
                            <button
                                key={day.date}
                                type='button'
                                className='oui-date-picker-day'
                                data-outside={day.outsideMonth ? 'true' : undefined}
                                data-selected={day.selected ? 'true' : undefined}
                                data-today={day.today ? 'true' : undefined}
                                disabled={day.disabled}
                                aria-pressed={day.selected}
                                onClick={() => selectDate(day.date)}
                            >
                                {day.day}
                            </button>
                        )),
                    )}
                </div>
                <div className='oui-date-picker-foot'>
                    <Button
                        size={1}
                        v='ghost'
                        type='button'
                        onClick={() => selectDate(clampDate(new Date().toISOString().slice(0, 10), min, max))}
                    >
                        {todayLabel ?? copy.dates.today}
                    </Button>
                    {clearable ? (
                        <Button
                            size={1}
                            v='ghost'
                            type='button'
                            disabled={!value}
                            onClick={() => {
                                onValueChange('');
                                setOpen(false);
                            }}
                        >
                            {copy.common.clear}
                        </Button>
                    ) : null}
                </div>
            </div>
        </Popover>
    );
}
