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
    assert.match(source, /className='oui-toast-stack'/);
    assert.match(source, /className='oui-toast-viewport oui-toast-frame'/);
    assert.match(source, /data-position=\{item\.position\}/);
    assert.match(source, /data-state=\{item\.state\}/);
    assert.doesNotMatch(source, /background\?: string|blur\?:|shadow\?: string|effectiveBlur|cssLength|className='oui-toast-backdrop'/);
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
    const toastStackBlock = overlays.match(/\.oui-toast-stack\n[\s\S]*?\.oui-toast-stack\[data-position\^="top"\]/)?.[0] ?? '';
    const toastViewportBlock = overlays.match(/\.oui-toast-viewport\n[\s\S]*?\.oui-toast\n/)?.[0] ?? '';
    assert.match(toastStackBlock, /position: fixed[\s\S]*pointer-events: none/);
    assert.doesNotMatch(toastStackBlock, /background:|box-shadow:|-webkit-backdrop-filter:|backdrop-filter:/);
    assert.match(overlays, /\.oui-toast-viewport[\s\S]*background: var\(--oui-toast-bg/);
    assert.match(overlays, /\.oui-toast-viewport[\s\S]*backdrop-filter: blur\(6px\)/);
    assert.doesNotMatch(overlays, /saturate\(160%\)/);
    assert.doesNotMatch(overlays, /backdrop-filter: (?:var|blur\(var)/);
    assert.match(overlays, /\.oui-toast-viewport[\s\S]*border-radius: var\(--oui-radius-xl/);
    assert.match(overlays, /\.oui-toast-viewport[\s\S]*animation: ouiToastIn/);
    assert.match(overlays, /\.oui-toast\s+position: relative[\s\S]*?border: 0/);
    assert.match(overlays, /\.oui-toast\s+position: relative[\s\S]*?background: color-mix\(in srgb, var\(--oui-toast-tone-color, var\(--oui-info-base\)\) 5%, transparent\)/);
    assert.match(overlays, /\.oui-toast\s+position: relative[\s\S]*?box-shadow: none/);
    assert.match(overlays, /\.oui-toast\[data-tone="success"\]\s+--oui-toast-tone-color: var\(--oui-success-base\)/);
    assert.match(overlays, /\.oui-toast\[data-tone="danger"\]\s+--oui-toast-tone-color: var\(--oui-danger-base\)/);
    assert.match(overlays, /\.oui-toast:hover \.oui-toast-progress\s+animation-play-state: paused/);
    assert.match(overlays, /\.oui-toast-viewport\[data-state="closing"\][\s\S]*animation: ouiToastOut/);
    assert.match(overlays, /cubic-bezier\(\.22, 1, \.36, 1\)/);
    assert.match(toastViewportBlock, /will-change: opacity, transform/);
    assert.match(overlays, /--oui-toast-enter-x: calc\(100% \+ 32px\)/);
    assert.match(overlays, /--oui-toast-enter-y: calc\(-100% - 32px\)/);
    assert.match(animations, /translate3d\(var\(--oui-toast-enter-x/);
    assert.match(animations, /translate3d\(var\(--oui-toast-exit-x/);
    assert.doesNotMatch(overlays, /--oui-toast-tone-bg|border-color: var\(--oui-toast-custom-border-color|\.oui-toast\[data-clickable="true"\]:hover[\s\S]*?background:/);
    assert.doesNotMatch(animations, /oui-toast-overshoot|scale\(1\.018\)|cubic-bezier\(\.18, 1\.34|opacity: 0\s+filter: blur\(3px\)/);
});
