import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const source = readFileSync(new URL('./IconTextButton.tsx', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../../styles/_buttons.sass', import.meta.url), 'utf8');
const barrel = readFileSync(new URL('../../index.ts', import.meta.url), 'utf8');

test('IconTextButton owns icon and label spacing', () => {
    assert.match(source, /export type IconTextButtonProps/);
    assert.match(source, /icon\?: ReactNode/);
    assert.match(source, /endIcon\?: ReactNode/);
    assert.match(source, /leftIcon=\{startIcon\}/);
    assert.match(source, /rightIcon=\{finishIcon\}/);
    assert.match(source, /className=\{cn\('oui-icon-text-button'/);
    assert.match(styles, /\.oui-icon-text-button/);
    assert.match(styles, /--oui-icon-text-button-gap/);
    assert.match(styles, /\.oui-icon-text-button-label/);
    assert.match(styles, /text-overflow: ellipsis/);
    assert.match(styles, /gap: var\(--oui-button-label-gap, 8px\)/);
    assert.match(barrel, /components\/IconTextButton\/IconTextButton/);
});
