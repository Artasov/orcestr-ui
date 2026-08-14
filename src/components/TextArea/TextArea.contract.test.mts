import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');

test('TextArea shares floating field and size contracts with TextField', () => {
    const source = read('components/TextArea/TextArea.tsx');
    const styles = read('styles/_fields.sass');

    assert.match(source, /size\?: UiSize/);
    assert.match(source, /floatingLabel\?: ReactNode/);
    assert.match(source, /floatingColor\?: string/);
    assert.match(source, /<FloatingFieldDecoration[\s\S]*?label=\{floatingLabel\}[\s\S]*?color=\{floatingColor\}/);
    assert.match(styles, /\.oui-text-area-field\[data-size="1"\]/);
    assert.match(styles, /\.oui-text-area-field\[data-size="4"\]/);
    assert.match(source, /oui-text-area-input oui-text-area-floating-input/);
    assert.match(styles, /\.oui-floating-field \.oui-text-area-input::placeholder/);
    assert.match(
        styles,
        /\.oui-text-area-field \.oui-text-area[\s\S]*?clip-path: inset\(7px 0 0\)/,
    );
    assert.match(
        styles,
        /\.oui-text-area-field\[data-size="1"\] \.oui-text-area[\s\S]*?padding-top: 8px/,
    );
});

test('TextArea auto-resizes smoothly with row and pixel ceilings', () => {
    const source = read('components/TextArea/TextArea.tsx');
    const styles = read('styles/_fields.sass');
    const example = read('example/ExampleFieldsSection.tsx');

    assert.match(source, /minRows\?: number/);
    assert.match(source, /maxRows\?: number/);
    assert.match(source, /Math\.min\(declaredMaxHeight, lineHeight \* maximumRows \+ chromeHeight\)/);
    assert.match(source, /contentHeight > maximumHeight \+ 0\.5 \? 'auto' : 'hidden'/);
    assert.match(source, /targetHeightRef/);
    assert.match(source, /targetChanged/);
    assert.match(source, /measureContentHeight\(element, computed, measurementRef\)/);
    assert.doesNotMatch(source, /element\.style\.height = '0px'/);
    assert.match(source, /const handleChange[\s\S]*?onChange\?\.\(event\);[\s\S]*?resizeToContent\(\)/);
    assert.match(source, /ResizeObserver/);
    assert.match(
        styles,
        /\.oui-text-area\[data-auto-resize="true"\][\s\S]*?transition: height 260ms/,
    );
    assert.match(example, /autoResize[\s\S]*?minRows=\{1\}[\s\S]*?maxRows=\{6\}[\s\S]*?maxHeight=\{150\}/);
    assert.match(example, /floatingLabel="Delivery notes"[\s\S]*?minRows=\{3\}[\s\S]*?maxRows=\{8\}/);
    assert.match(styles, /\.oui-text-area:not\(\[data-auto-resize="true"\]\)::\-webkit-resizer/);
    assert.match(styles, /--oui-text-area-resizer-rest-color/);
    assert.match(styles, /--oui-text-area-resizer-focus-color/);
    assert.match(source, /'--oui-text-area-resizer-focus-color': floatingColor/);
});
