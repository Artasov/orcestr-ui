import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

function read(path: string): string {
    return readFileSync(new URL(path, import.meta.url), 'utf8');
}

test('library roots and Text establish a theme-owned readable line height', () => {
    const theme = read('../styles/_theme.sass');

    assert.match(theme, /\.oui-root[\s\S]*line-height: var\(--oui-line-height, 1\.45\)/);
    assert.match(theme, /\.oui-text[\s\S]*line-height: var\(--oui-line-height, 1\.45\)/);
});

test('single-line truncated navigation labels preserve descender space', () => {
    const sidebar = read('../styles/_app-sidebar.sass');
    const shell = read('../styles/_shell.sass');
    const buttons = read('../styles/_buttons.sass');

    for (const styles of [sidebar, shell, buttons]) {
        assert.match(styles, /padding-block: 1px/);
        assert.match(styles, /line-height: 1\.35/);
    }
});
