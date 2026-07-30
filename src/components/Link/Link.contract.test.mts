import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const component = readFileSync(new URL('./Link.tsx', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../../styles/_link.sass', import.meta.url), 'utf8');
const runtimeBarrel = readFileSync(new URL('../../index.ts', import.meta.url), 'utf8');
const serverBarrel = readFileSync(new URL('../../server.ts', import.meta.url), 'utf8');

test('Link is a semantic anchor with accent hover and keyboard focus states', () => {
    assert.match(component, /<a/);
    assert.match(component, /className=\{cn\('oui-link'/);
    assert.match(component, /underline = 'none'/);
    assert.match(styles, /\.oui-link:hover/);
    assert.match(styles, /color: var\(--oui-link-hover-color, var\(--oui-primary-text\)\)/);
    assert.match(styles, /\.oui-link:focus-visible/);
    assert.match(runtimeBarrel, /components\/Link\/Link\.js/);
    assert.match(serverBarrel, /components\/Link\/Link\.js/);
});
