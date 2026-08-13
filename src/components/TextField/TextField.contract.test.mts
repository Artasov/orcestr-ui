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

test('TextField owns the floating label mode without a parallel component', () => {
    const source = read('components/TextField/TextField.tsx');
    const styles = read('styles/_fields.sass');
    const barrel = read('index.ts');

    assert.match(source, /floatingLabel\?: ReactNode/);
    assert.match(source, /<FloatingFieldDecoration label=\{floatingLabel\} htmlFor=\{inputId\}/);
    assert.match(styles, /\.oui-floating-field-label[\s\S]*?line-height: 1\.35/);
    assert.match(styles, /\.oui-text-field-input,[\s\S]*?line-height: 1\.35/);
    assert.doesNotMatch(barrel, /FloatingTextField/);
});
