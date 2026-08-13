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
    assert.match(source, /floatingColor\?: string/);
    assert.match(source, /<FloatingFieldDecoration[\s\S]*?label=\{floatingLabel\}[\s\S]*?htmlFor=\{inputId\}[\s\S]*?color=\{floatingColor\}/);
    assert.match(styles, /\.oui-floating-field-label[\s\S]*?line-height: 1\.35/);
    assert.match(styles, /\.oui-text-field-input,[\s\S]*?line-height: 1\.35/);
    assert.match(
        styles,
        /--oui-floating-field-motion-duration: 300ms[\s\S]*?--oui-floating-field-color-duration: 240ms/,
    );
    assert.match(
        styles,
        /\.oui-floating-field-label[\s\S]*?transform: translate3d\(var\(--oui-floating-field-label-rest-x\), -50%, 0\) scale\(1\)[\s\S]*?transition: transform/,
    );
    assert.match(
        styles,
        /\.oui-floating-field\[data-floating="true"\] \.oui-floating-field-label[\s\S]*?transform: translate3d\(var\(--oui-floating-field-label-float-x\), calc\(-50% - var\(--oui-floating-field-height\) \/ 2\), 0\) scale\(\.75\)/,
    );
    assert.match(
        styles,
        /\.oui-text-field\.oui-floating-field\[data-size="1"\][\s\S]*?height: 28px[\s\S]*?\.oui-text-field\.oui-floating-field\[data-size="4"\][\s\S]*?height: 48px/,
    );
    assert.match(
        styles,
        /\.oui-floating-field\[data-floating="true"\] \.oui-floating-field-outline-gap[\s\S]*?transition-delay: 90ms/,
    );
    assert.doesNotMatch(
        styles,
        /\.oui-floating-field-label[\s\S]{0,1000}?transition:[^\n]*(?:top|left|font-size)/,
    );
    assert.match(
        styles,
        /\.oui-text-field\.oui-floating-field,[\s\S]*?\.oui-text-field\.oui-floating-field\[data-invalid="true"\][\s\S]*?border-color: transparent/,
    );
    assert.match(
        styles,
        /--oui-floating-field-border-color[\s\S]*?--oui-floating-field-focus-color[\s\S]*?--oui-floating-field-invalid-color/,
    );
    assert.match(
        styles,
        /--oui-floating-field-label-color[\s\S]*?--oui-floating-field-label-focus-color[\s\S]*?--oui-floating-field-label-invalid-color/,
    );
    assert.doesNotMatch(barrel, /FloatingTextField/);
});
