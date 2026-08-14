import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const source = readFileSync(new URL('./Carousel.tsx', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../../styles/_carousel.sass', import.meta.url), 'utf8');
const index = readFileSync(new URL('../../index.ts', import.meta.url), 'utf8');

test('Carousel exposes navigation, autoplay and controlled-state capabilities', () => {
    for (const contract of [
        "'always' | 'hover' | 'never'",
        'arrowSize?: UiSize',
        'arrowVariant?: ButtonVariant',
        'arrowTone?: ToneInput',
        'showDots?: boolean',
        'autoplay?: boolean',
        'autoplayInterval?: number',
        'showAutoplayControl?: boolean',
        'pauseOnHover?: boolean',
        'loop?: boolean',
        'swipe?: boolean',
        'keyboard?: boolean',
        'value?: number',
        'onValueChange?: (value: number) => void',
    ]) {
        assert.match(source, new RegExp(contract.replace(/[?()[\]{}|*+.^$\\]/g, '\\$&')));
    }
    assert.match(source, /aria-roledescription="carousel"/);
    assert.match(source, /aria-roledescription="slide"/);
    assert.match(source, /useReducedMotion/);
    assert.match(index, /components\/Carousel\/Carousel\.js/);
});

test('Carousel styles include smooth motion and hover-only arrow behavior', () => {
    assert.match(styles, /\.oui-carousel-track/);
    assert.match(styles, /cubic-bezier/);
    assert.match(styles, /data-arrows='hover'/);
    assert.match(styles, /translateX\(-1px\)/);
    assert.match(styles, /@media \(hover: none\)/);
    assert.match(styles, /prefers-reduced-motion/);
    assert.match(styles, /contain: paint/);
    assert.match(styles, /flex: 0 0 calc\(100% \+ 1px\)/);
    assert.match(styles, /margin-inline-end: -1px/);
});
