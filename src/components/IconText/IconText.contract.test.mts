import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('./IconText.tsx', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../../styles/_icon-text.sass', import.meta.url), 'utf8');

test('IconText forwards text styling through textProps', () => {
    assert.match(source, /textProps\?: Omit<TextProps, 'children'>/);
    assert.match(source, /const \{ className, \.\.\.restTextProps \} = textProps \?\? \{\}/);
    assert.match(source, /<Text className=\{cn\('oui-icon-text', className\)\} \{\.\.\.restTextProps\}>/);
});

test('IconText aligns an em-sized icon to the text baseline', () => {
    assert.match(styles, /\.oui-icon-text\s+display: inline-block/);
    assert.match(styles, /\.oui-icon-text-icon[\s\S]*?width: 1em[\s\S]*?height: 1em/);
    assert.match(styles, /vertical-align: -0\.125em/);
    assert.doesNotMatch(styles, /vertical-align: top/);
});
