export type CalendarDayState = {
    date: string;
    day: number;
    outsideMonth: boolean;
    selected: boolean;
    today: boolean;
    disabled: boolean;
};

export type CalendarMonthState = {
    month: string;
    year: number;
    monthIndex: number;
    weeks: CalendarDayState[][];
};

export type DatePickerDisabledDate = (date: string) => boolean;

export function calendarMonthState({
    cursorMonth,
    selectedDate,
    today,
    min,
    max,
    disabledDate,
}: {
    cursorMonth: string;
    selectedDate?: string | null;
    today?: string;
    min?: string;
    max?: string;
    disabledDate?: DatePickerDisabledDate;
}): CalendarMonthState {
    const cursor = parseDateParts(cursorMonth) ?? requiredDateParts(todayIsoDate());
    const monthStart = new Date(Date.UTC(cursor.year, cursor.monthIndex, 1));
    const gridStart = new Date(monthStart);
    const startOffset = (monthStart.getUTCDay() + 6) % 7;
    gridStart.setUTCDate(monthStart.getUTCDate() - startOffset);

    const normalizedToday = today ?? todayIsoDate();
    const days = Array.from({length: 42}, (_, index) => {
        const date = new Date(gridStart);
        date.setUTCDate(gridStart.getUTCDate() + index);
        const dateValue = formatDate(date);
        return {
            date: dateValue,
            day: date.getUTCDate(),
            outsideMonth: date.getUTCMonth() !== cursor.monthIndex,
            selected: selectedDate === dateValue,
            today: normalizedToday === dateValue,
            disabled:
                (min !== undefined && dateValue < min) ||
                (max !== undefined && dateValue > max) ||
                Boolean(disabledDate?.(dateValue)),
        };
    });

    return {
        month: formatMonth(cursor.year, cursor.monthIndex),
        year: cursor.year,
        monthIndex: cursor.monthIndex,
        weeks: chunk(days, 7),
    };
}

export function monthCursorForDate(value?: string | null, fallback?: string): string {
    const parts = parseDateParts(value ?? '') ?? parseDateParts(fallback ?? '') ?? requiredDateParts(todayIsoDate());
    return formatMonth(parts.year, parts.monthIndex);
}

export function shiftMonth(cursorMonth: string, offset: number): string {
    const parts = parseDateParts(cursorMonth) ?? requiredDateParts(todayIsoDate());
    return formatMonth(parts.year, parts.monthIndex + offset);
}

export function clampDate(value: string, min?: string, max?: string): string {
    if (min !== undefined && value < min) return min;
    if (max !== undefined && value > max) return max;
    return value;
}

export function formatDateLabel(value: string, locale: string): string {
    const parts = parseDateParts(value);
    if (!parts) return value;
    return new Intl.DateTimeFormat(locale, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(Date.UTC(parts.year, parts.monthIndex, parts.day)));
}

export function formatMonthLabel(cursorMonth: string, locale: string): string {
    const parts = parseDateParts(cursorMonth);
    if (!parts) return cursorMonth;
    return new Intl.DateTimeFormat(locale, {
        month: 'long',
        year: 'numeric',
    }).format(new Date(Date.UTC(parts.year, parts.monthIndex, 1)));
}

export function weekdayLabels(locale: string): string[] {
    return Array.from({length: 7}, (_, index) => {
        const day = new Date(Date.UTC(2026, 5, 29 + index));
        return new Intl.DateTimeFormat(locale, {weekday: 'short'}).format(day);
    });
}

function parseDateParts(value: string): {year: number; monthIndex: number; day: number} | null {
    const match = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(value);
    if (!match) return null;
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3] ?? '01');
    if (!Number.isInteger(year) || month < 1 || month > 12 || day < 1 || day > 31) return null;
    return {year, monthIndex: month - 1, day};
}

function requiredDateParts(value: string): {year: number; monthIndex: number; day: number} {
    const parts = parseDateParts(value);
    if (!parts) return {year: 1970, monthIndex: 0, day: 1};
    return parts;
}

function formatMonth(year: number, monthIndex: number): string {
    const date = new Date(Date.UTC(year, monthIndex, 1));
    return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}`;
}

function formatDate(date: Date): string {
    return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

function todayIsoDate(): string {
    return formatDate(new Date());
}

function pad(value: number): string {
    return String(value).padStart(2, '0');
}

function chunk<T>(items: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let index = 0; index < items.length; index += size) {
        result.push(items.slice(index, index + size));
    }
    return result;
}
