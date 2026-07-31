import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const styles = readFileSync(new URL('../../styles/_card.sass', import.meta.url), 'utf8');

test('Card uses the pad background by default', () => {
    assert.match(styles, /\.oui-card\s+[\s\S]*background: var\(--oui-pad-bg\)/);
});
