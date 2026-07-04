import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('../..', import.meta.url));

function read(path: string): string {
    return readFileSync(`${root}/${path}`, 'utf8');
}

test('field controls use one visible border contract', () => {
    const styles = read('styles/_fields.sass');

    assert.match(styles, /border: 1px solid var\(--oui-field-border-color, var\(--oui-border\)\)/);
    assert.match(
        styles,
        /border-color: var\(--oui-field-border-hover-color, var\(--oui-border-strong\)\)/,
    );
    assert.match(
        styles,
        /--oui-stepper-border-color: var\(--oui-field-border-color, var\(--oui-border\)\)/,
    );
    assert.match(
        styles,
        /\.oui-stepper \.oui-stepper-field,[\s\S]*?border-right: 0[\s\S]*?border-left: 0/,
    );
});
