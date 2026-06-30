import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('../..', import.meta.url));

function read(path: string): string {
    return readFileSync(`${root}/${path}`, 'utf8');
}

test('Toast dismisses from the card and keeps close button optional', () => {
    const source = read('components/Toast/Toast.tsx');
    assert.match(source, /closeButton\?: boolean/);
    assert.match(source, /className='oui-toast-backdrop'/);
    assert.match(source, /className='oui-toast-frame'/);
    assert.match(source, /data-position=\{item\.position\}/);
    assert.match(source, /data-state=\{item\.state\}/);
    assert.match(source, /backdropFilter: `blur\(\$\{effectiveBlur\}\)`/);
    assert.match(source, /event\.animationName === 'ouiToastOut'/);
    assert.match(source, /data-clickable=\{item\.dismissible === false \? undefined : 'true'\}/);
    assert.match(source, /onClick=\{\(\) => \{/);
    assert.match(source, /\{item\.closeButton \? \(/);
    assert.doesNotMatch(source, /item\.dismissible === false \? null : \(\s*<IconButton/);
});

test('Toast visuals use backdrop blur and smooth non-bouncy motion', () => {
    const overlays = read('styles/_overlays.sass');
    const animations = read('styles/_animations.sass');
    assert.match(overlays, /\.oui-toast-backdrop[\s\S]*backdrop-filter: blur/);
    assert.match(overlays, /\.oui-toast-frame[\s\S]*animation: ouiToastIn/);
    assert.match(overlays, /\.oui-toast-frame\[data-state="closing"\][\s\S]*animation: ouiToastOut/);
    assert.match(overlays, /--oui-toast-exit-x: calc\(100% \+ 32px\)/);
    assert.match(overlays, /--oui-toast-exit-y: calc\(100% \+ 32px\)/);
    assert.match(overlays, /cubic-bezier\(\.16, 1, \.3, 1\)/);
    assert.match(overlays, /color-mix\(in srgb, var\(--oui-success\) 16%, var\(--oui-border\)\)/);
    assert.doesNotMatch(animations, /oui-toast-overshoot|scale\(1\.018\)|cubic-bezier\(\.18, 1\.34|opacity: 0\s+filter: blur\(3px\)/);
});
