import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const source = readFileSync(new URL('./Avatar.tsx', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../../styles/_avatar.sass', import.meta.url), 'utf8');

test('Avatar owns fallback sizing for every standard size', () => {
    for (const size of [1, 2, 3, 4]) {
        assert.match(styles, new RegExp(`\\.oui-avatar\\[data-size="${size}"\\]`));
    }
    assert.match(styles, /font-size: calc\(var\(--oui-avatar-size\) \* \.44\)/);
    assert.match(styles, /line-height: 1/);
    assert.match(styles, /letter-spacing: -\.02em/);
});

test('Avatar supports theme-safe image and fallback rendering', () => {
    assert.match(source, /src \? <img className="oui-avatar-image" src=\{src\} alt="" \/> : fallback/);
    assert.match(styles, /background: var\(--oui-info-soft, var\(--oui-primary-surface\)\)/);
    assert.match(styles, /color: var\(--oui-primary-text\)/);
});
