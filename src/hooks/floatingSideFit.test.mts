import assert from 'node:assert/strict';
import test from 'node:test';
import { floatingSideFit } from './floatingSideFit.js';

const boundary = { top: 0, left: 0, right: 1000, bottom: 800 };
const size = { width: 300, height: 260 };

test('keeps the preferred side when it fits and flips near either vertical edge', () => {
    assert.deepEqual(floatingSideFit('bottom', { top: 100, bottom: 130, left: 50, right: 200 }, boundary, size, 8, 4),
        { side: 'bottom', availableSize: 658 });
    assert.equal(floatingSideFit('bottom', { top: 700, bottom: 730, left: 50, right: 200 }, boundary, size, 8, 4).side, 'top');
    assert.equal(floatingSideFit('top', { top: 20, bottom: 50, left: 50, right: 200 }, boundary, size, 8, 4).side, 'bottom');
});

test('when neither side fits, constrains to the roomier side instead of overlapping the trigger', () => {
    const small = { ...boundary, bottom: 400 };
    assert.deepEqual(floatingSideFit('bottom', { top: 220, bottom: 250, left: 50, right: 200 }, small, size, 8, 4),
        { side: 'top', availableSize: 208 });
    assert.deepEqual(floatingSideFit('bottom', { top: 140, bottom: 170, left: 50, right: 200 }, small, size, 8, 4),
        { side: 'bottom', availableSize: 218 });
});

test('horizontal placement flips and unavailable space never becomes negative', () => {
    assert.deepEqual(floatingSideFit('right', { top: 100, bottom: 130, left: 800, right: 980 }, boundary, size, 8, 4),
        { side: 'left', availableSize: 788 });
    assert.deepEqual(floatingSideFit('left', { top: 100, bottom: 130, left: 0, right: 1000 }, boundary, size, 8, 4),
        { side: 'left', availableSize: 0 });
});
