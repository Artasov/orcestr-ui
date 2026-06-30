import assert from 'node:assert/strict';
import test from 'node:test';

import {resolveDateRangePreset} from './DateRangePresetPickerState.ts';

test('resolveDateRangePreset resolves today', () => {
    assert.deepEqual(resolveDateRangePreset('today', '2026-06-29'), {
        from: '2026-06-29',
        to: '2026-06-29',
    });
});

test('resolveDateRangePreset resolves last seven days inclusively', () => {
    assert.deepEqual(resolveDateRangePreset('week', '2026-06-29'), {
        from: '2026-06-23',
        to: '2026-06-29',
    });
});

test('resolveDateRangePreset resolves current month to today', () => {
    assert.deepEqual(resolveDateRangePreset('month', '2026-06-29'), {
        from: '2026-06-01',
        to: '2026-06-29',
    });
});
