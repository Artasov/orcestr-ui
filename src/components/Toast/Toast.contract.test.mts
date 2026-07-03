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
    assert.match(source, /className='oui-toast-frame'/);
    assert.match(source, /data-position=\{item\.position\}/);
    assert.match(source, /data-state=\{item\.state\}/);
    assert.match(source, /'--oui-toast-effective-blur': effectiveBlur/);
    assert.doesNotMatch(source, /blurStyle|className='oui-toast-backdrop'/);
    assert.match(source, /event\.animationName === 'ouiToastOut'/);
    assert.match(source, /data-clickable=\{item\.dismissible === false \? undefined : 'true'\}/);
    assert.match(source, /onMouseEnter=\{\(\) => onPause\(item\.id\)\}/);
    assert.match(source, /onMouseLeave=\{\(\) => onResume\(item\.id\)\}/);
    assert.match(source, /remaining: Math\.max\(0, timer\.remaining - \(Date\.now\(\) - timer\.startedAt\)\)/);
    assert.match(source, /onClick=\{\(\) => \{/);
    assert.match(source, /\{item\.closeButton \? \(/);
    assert.doesNotMatch(source, /item\.dismissible === false \? null : \(\s*<IconButton/);
});

test('Toast visuals use backdrop blur and smooth non-bouncy motion', () => {
    const overlays = read('styles/_overlays.sass');
    const animations = read('styles/_animations.sass');
    assert.match(overlays, /\.oui-toast-frame[\s\S]*background: var\(--oui-toast-bg/);
    assert.match(overlays, /\.oui-toast-frame[\s\S]*backdrop-filter: blur\(var\(--oui-toast-effective-blur/);
    assert.match(overlays, /\.oui-toast\s+position: relative[\s\S]*?border: 0/);
    assert.match(overlays, /\.oui-toast\s+position: relative[\s\S]*?background: transparent/);
    assert.match(overlays, /\.oui-toast\s+position: relative[\s\S]*?box-shadow: none/);
    assert.match(overlays, /\.oui-toast:hover \.oui-toast-progress\s+animation-play-state: paused/);
    assert.match(overlays, /\.oui-toast-frame[\s\S]*animation: ouiToastIn/);
    assert.match(overlays, /\.oui-toast-frame\[data-state="closing"\][\s\S]*animation: ouiToastOut/);
    assert.match(overlays, /--oui-toast-exit-x: calc\(100% \+ 32px\)/);
    assert.match(overlays, /--oui-toast-exit-y: calc\(100% \+ 32px\)/);
    assert.match(overlays, /cubic-bezier\(\.22, 1, \.36, 1\)/);
    assert.doesNotMatch(overlays, /--oui-toast-tone-bg|border-color: var\(--oui-toast-custom-border-color|\.oui-toast\[data-clickable="true"\]:hover[\s\S]*?--oui-toast-bg:/);
    assert.doesNotMatch(animations, /oui-toast-overshoot|scale\(1\.018\)|cubic-bezier\(\.18, 1\.34|opacity: 0\s+filter: blur\(3px\)/);
});
