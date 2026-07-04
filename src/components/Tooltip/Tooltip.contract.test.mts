import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('../..', import.meta.url));

function read(path: string): string {
    return readFileSync(`${root}/${path}`, 'utf8');
}

test('Tooltip ignores programmatic focus and opens only on keyboard focus', () => {
    const source = read('components/Tooltip/Tooltip.tsx');

    assert.match(source, /isKeyboardFocus\(event\.currentTarget\)/);
    assert.match(source, /matches\(':focus-visible'\)/);
    assert.doesNotMatch(source, /onFocus: \(\) => setOpen\(true\)/);
});
