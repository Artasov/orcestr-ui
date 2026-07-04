import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('../..', import.meta.url));

function read(path: string): string {
    return readFileSync(`${root}/${path}`, 'utf8');
}

test('DatePicker calendar icon is an interactive trigger', () => {
    const source = read('components/DatePicker/DatePicker.tsx');

    assert.match(source, /const openCalendar = \(event: MouseEvent<HTMLButtonElement>\)/);
    assert.match(source, /event\.stopPropagation\(\)/);
    assert.match(source, /setOpen\(true\)/);
    assert.match(
        source,
        /<button[\s\S]*?className=["\']oui-date-picker-trigger["\'][\s\S]*?onClick=\{openCalendar\}/,
    );
    assert.doesNotMatch(source, /className=["\']oui-date-picker-trigger["\'][\s\S]*?aria-hidden/);
});
