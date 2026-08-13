import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('./FloatingTextField.tsx', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../../styles/_fields.sass', import.meta.url), 'utf8');
const labelStyles = styles.split('.oui-floating-text-field-label\n')[1]?.split('\n.oui-')[0] ?? '';

test('FloatingTextField uses a legend to create a background-independent outline gap', () => {
    assert.match(source, /<fieldset className="oui-floating-text-field-outline"/);
    assert.match(source, /<legend>[\s\S]*?<span>\{label\}<\/span>/);
    assert.match(styles, /\.oui-floating-text-field-outline legend[\s\S]*?max-width: 0/);
    assert.match(
        styles,
        /\.oui-floating-text-field\[data-floating="true"\] \.oui-floating-text-field-outline legend[\s\S]*?max-width: 100%/,
    );
    assert.doesNotMatch(labelStyles, /background:/);
});

test('FloatingTextField supports library sizes and floating states', () => {
    assert.match(source, /size\?: UiSize/);
    assert.match(source, /data-floating=\{floating \? 'true' : undefined\}/);
    for (const size of [1, 2, 3, 4]) {
        assert.match(styles, new RegExp(`\\.oui-floating-text-field\\[data-size="${size}"\\]`));
    }
});

test('FloatingTextField moves its label diagonally with synchronized transitions', () => {
    assert.match(
        styles,
        /\.oui-floating-text-field-label[\s\S]*?transition: top 180ms cubic-bezier\(\.2, 0, 0, 1\), left 180ms cubic-bezier\(\.2, 0, 0, 1\)/,
    );
});

test('FloatingTextField keeps a long label inside the field when a left slot is present', () => {
    assert.match(
        styles,
        /\.oui-floating-text-field\[data-has-left="true"\] \.oui-floating-text-field-label[\s\S]*?left: 36px[\s\S]*?max-width: calc\(100% - 46px\)/,
    );
});
