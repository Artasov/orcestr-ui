import assert from 'node:assert/strict';
import test from 'node:test';

import {
    calendarMonthState,
    clampDate,
    isValidCalendarDate,
    localTodayIsoDate,
    monthCursorForDate,
    shiftMonth,
    shiftDate,
    shiftDateByMonth,
    weekdayLabels,
} from './DatePickerState.ts';

test('calendarMonthState builds a Monday-first six-week grid', () => {
    const state = calendarMonthState({
        cursorMonth: '2026-06',
        selectedDate: '2026-06-29',
        today: '2026-06-29',
    });

    assert.equal(state.year, 2026);
    assert.equal(state.monthIndex, 5);
    assert.equal(state.weeks.length, 6);
    assert.equal(state.weeks[0]?.[0]?.date, '2026-06-01');
    assert.equal(state.weeks[5]?.[6]?.date, '2026-07-12');
    assert.equal(state.weeks.flat().find((day) => day.date === '2026-06-29')?.selected, true);
    assert.equal(state.weeks.flat().find((day) => day.date === '2026-06-29')?.today, true);
});

test('calendarMonthState marks outside and disabled dates', () => {
    const state = calendarMonthState({
        cursorMonth: '2026-06',
        min: '2026-06-10',
        max: '2026-06-20',
        disabledDate: (date) => date === '2026-06-15',
    });
    const days = state.weeks.flat();

    assert.equal(days.find((day) => day.date === '2026-06-09')?.disabled, true);
    assert.equal(days.find((day) => day.date === '2026-06-10')?.disabled, false);
    assert.equal(days.find((day) => day.date === '2026-06-15')?.disabled, true);
    assert.equal(days.find((day) => day.date === '2026-06-21')?.disabled, true);
    assert.equal(days.find((day) => day.date === '2026-07-01')?.outsideMonth, true);
});

test('month cursor helpers are stable around year boundaries', () => {
    assert.equal(monthCursorForDate('2026-06-29'), '2026-06');
    assert.equal(shiftMonth('2026-01', -1), '2025-12');
    assert.equal(shiftMonth('2026-12', 1), '2027-01');
    assert.equal(clampDate('2026-06-05', '2026-06-10', '2026-06-20'), '2026-06-10');
    assert.equal(clampDate('2026-06-25', '2026-06-10', '2026-06-20'), '2026-06-20');
});

test('weekday labels start from Monday', () => {
    assert.deepEqual(
        weekdayLabels('en').map((label) => label.toLowerCase()),
        ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    );
});

test('calendar date parsing rejects impossible dates', () => {
    assert.equal(isValidCalendarDate('2026-02-28'), true);
    assert.equal(isValidCalendarDate('2028-02-29'), true);
    assert.equal(isValidCalendarDate('2026-02-29'), false);
    assert.equal(isValidCalendarDate('2026-02-31'), false);
    assert.equal(isValidCalendarDate('2026-04-31'), false);
});

test('date navigation preserves calendar semantics', () => {
    assert.equal(shiftDate('2026-03-01', -1), '2026-02-28');
    assert.equal(shiftDateByMonth('2028-02-29', 12), '2029-02-28');
    assert.equal(shiftDateByMonth('2026-01-31', 1), '2026-02-28');
});

test('today helper uses local calendar fields', () => {
    const date = new Date(2026, 6, 11, 23, 30);
    assert.equal(
        localTodayIsoDate(date),
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
            date.getDate(),
        ).padStart(2, '0')}`,
    );
});
