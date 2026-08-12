import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('./DateRangePresetPicker.tsx', import.meta.url), 'utf8');

test('DateRangePresetPicker accepts custom ranges and menu presentation', () => {
    assert.match(source, /export type DateRangePresetDefinition/);
    assert.match(source, /label: ReactNode/);
    assert.match(source, /range:[\s\S]*DateRangePickerValue[\s\S]*today: string/);
    assert.match(source, /icon\?: ReactNode/);
    assert.match(source, /description\?: ReactNode/);
    assert.match(source, /disabled\?: boolean/);
});

test('DateRangePresetPicker supports icon, labelled and custom triggers', () => {
    assert.match(source, /trigger\?: ReactNode/);
    assert.match(source, /triggerIcon\?: ReactNode/);
    assert.match(source, /triggerLabel\?: ReactNode/);
    assert.match(source, /triggerButtonProps\?: Omit<ButtonProps/);
    assert.match(source, /triggerLabelProps\?: Omit<TextProps/);
    assert.match(source, /trigger \?\? defaultTrigger/);
});
