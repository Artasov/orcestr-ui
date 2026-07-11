'use client';

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type KeyboardEvent,
    type MouseEvent,
    type ReactNode,
} from 'react';
import { LuCalendarDays, LuChevronLeft, LuChevronRight } from 'react-icons/lu';

import { useOrcestrUiLocale } from '../../locale/LocaleProvider';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { Popover } from '../Popover/Popover';
import { TextField } from '../TextField/TextField';
import {
    calendarMonthState,
    clampDate,
    formatDateLabel,
    formatMonthLabel,
    isValidCalendarDate,
    localTodayIsoDate,
    monthCursorForDate,
    shiftDate,
    shiftDateByMonth,
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
    const { copy, locale: contextLocale } = useOrcestrUiLocale();
    const actualLocale = locale ?? contextLocale;
    const [open, setOpen] = useState(false);
    const [cursorMonth, setCursorMonth] = useState(() => monthCursorForDate(value));
    const [focusedDate, setFocusedDate] = useState(() =>
        initialFocusDate(value, min, max, disabledDate),
    );
    const gridRef = useRef<HTMLDivElement | null>(null);
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

    useEffect(() => {
        if (!open) return;
        const frame = window.requestAnimationFrame(() => {
            const selector = `[data-oui-date="${cssAttr(focusedDate)}"]`;
            gridRef.current?.querySelector<HTMLElement>(selector)?.focus({ preventScroll: true });
        });
        return () => window.cancelAnimationFrame(frame);
    }, [cursorMonth, focusedDate, open]);

    const selectDate = (nextValue: string) => {
        onValueChange(clampDate(nextValue, min, max));
        setOpen(false);
    };
    const openCalendar = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (disabled || readOnly) return;
        setCursorMonth(monthCursorForDate(value));
        setFocusedDate(initialFocusDate(value, min, max, disabledDate));
        setOpen(true);
    };
    const focusDate = useCallback(
        (candidate: string, direction: 1 | -1) => {
            const next = findEnabledDate(candidate, direction, min, max, disabledDate);
            if (!next) return;
            setFocusedDate(next);
            setCursorMonth(monthCursorForDate(next));
        },
        [disabledDate, max, min],
    );
    const handleDayKeyDown = useCallback(
        (event: KeyboardEvent<HTMLButtonElement>, date: string, disabledDay: boolean) => {
            let next: string | null = null;
            let direction: 1 | -1 = 1;
            switch (event.key) {
                case 'ArrowLeft':
                    next = shiftDate(date, -1);
                    direction = -1;
                    break;
                case 'ArrowRight':
                    next = shiftDate(date, 1);
                    break;
                case 'ArrowUp':
                    next = shiftDate(date, -7);
                    direction = -1;
                    break;
                case 'ArrowDown':
                    next = shiftDate(date, 7);
                    break;
                case 'Home': {
                    const day = utcWeekday(date);
                    next = shiftDate(date, -((day + 6) % 7));
                    break;
                }
                case 'End': {
                    const day = utcWeekday(date);
                    next = shiftDate(date, 6 - ((day + 6) % 7));
                    direction = -1;
                    break;
                }
                case 'PageUp':
                    next = shiftDateByMonth(date, event.shiftKey ? -12 : -1);
                    direction = -1;
                    break;
                case 'PageDown':
                    next = shiftDateByMonth(date, event.shiftKey ? 12 : 1);
                    break;
                case 'Enter':
                case ' ':
                    event.preventDefault();
                    if (!disabledDay) selectDate(date);
                    return;
                default:
                    return;
            }
            event.preventDefault();
            if (next) focusDate(next, direction);
        },
        [focusDate, selectDate],
    );

    return (
        <Popover
            open={open}
            onOpenChange={(nextOpen) => {
                if (readOnly && nextOpen) return;
                if (nextOpen) {
                    const nextFocus = initialFocusDate(value, min, max, disabledDate);
                    setFocusedDate(nextFocus);
                    setCursorMonth(monthCursorForDate(nextFocus));
                }
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
                        <button
                            type="button"
                            className="oui-date-picker-trigger"
                            aria-label={openCalendarLabel ?? copy.common.openCalendar}
                            disabled={disabled || readOnly}
                            onClick={openCalendar}
                        >
                            <LuCalendarDays size={16} />
                        </button>
                    }
                />
            }
            className="oui-date-picker-popover"
            onOpenAutoFocus={(event) => event.preventDefault()}
        >
            <div className="oui-date-picker-panel">
                <div className="oui-date-picker-head">
                    <IconButton
                        size={1}
                        v="ghost"
                        type="button"
                        icon={<LuChevronLeft size={16} />}
                        aria-label={previousMonthLabel ?? copy.common.previous}
                        onClick={() => setCursorMonth((current) => shiftMonth(current, -1))}
                    />
                    <strong>{formatMonthLabel(cursorMonth, actualLocale)}</strong>
                    <IconButton
                        size={1}
                        v="ghost"
                        type="button"
                        icon={<LuChevronRight size={16} />}
                        aria-label={nextMonthLabel ?? copy.common.next}
                        onClick={() => setCursorMonth((current) => shiftMonth(current, 1))}
                    />
                </div>
                <div className="oui-date-picker-weekdays" role="row">
                    {weekdays.map((weekday) => (
                        <span key={weekday} role="columnheader">
                            {weekday}
                        </span>
                    ))}
                </div>
                <div
                    ref={gridRef}
                    className="oui-date-picker-grid"
                    role="grid"
                    aria-label={formatMonthLabel(cursorMonth, actualLocale)}
                >
                    {monthState.weeks.flatMap((week) =>
                        week.map((day) => (
                            <button
                                key={day.date}
                                type="button"
                                role="gridcell"
                                className="oui-date-picker-day"
                                data-oui-date={day.date}
                                data-outside={day.outsideMonth ? 'true' : undefined}
                                data-selected={day.selected ? 'true' : undefined}
                                data-today={day.today ? 'true' : undefined}
                                disabled={day.disabled}
                                aria-selected={day.selected}
                                aria-current={day.today ? 'date' : undefined}
                                aria-label={formatDateLabel(day.date, actualLocale)}
                                tabIndex={day.date === focusedDate ? 0 : -1}
                                onClick={() => selectDate(day.date)}
                                onKeyDown={(event) =>
                                    handleDayKeyDown(event, day.date, day.disabled)
                                }
                            >
                                {day.day}
                            </button>
                        )),
                    )}
                </div>
                <div className="oui-date-picker-foot">
                    <Button
                        size={1}
                        v="ghost"
                        type="button"
                        onClick={() => selectDate(clampDate(localTodayIsoDate(), min, max))}
                    >
                        {todayLabel ?? copy.dates.today}
                    </Button>
                    {clearable ? (
                        <Button
                            size={1}
                            v="ghost"
                            type="button"
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

function initialFocusDate(
    value: string,
    min?: string,
    max?: string,
    disabledDate?: DatePickerDisabledDate,
) {
    const initial = clampDate(isValidCalendarDate(value) ? value : localTodayIsoDate(), min, max);
    return findEnabledDate(initial, 1, min, max, disabledDate) ?? initial;
}

function findEnabledDate(
    initial: string,
    direction: 1 | -1,
    min?: string,
    max?: string,
    disabledDate?: DatePickerDisabledDate,
) {
    let candidate = initial;
    for (let index = 0; index < 3660; index += 1) {
        if (
            isValidCalendarDate(candidate) &&
            (min === undefined || candidate >= min) &&
            (max === undefined || candidate <= max) &&
            !disabledDate?.(candidate)
        ) {
            return candidate;
        }
        candidate = shiftDate(candidate, direction);
    }
    return null;
}

function utcWeekday(value: string) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(Date.UTC(year!, month! - 1, day!)).getUTCDay();
}

function cssAttr(value: string) {
    return value.replace(/"/g, '\\"');
}
