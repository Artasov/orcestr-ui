import assert from 'node:assert/strict';
import test from 'node:test';

import { floatingLayerSize, floatingLayerVisibility } from './useFloatingPosition.js';

const viewport = { left: 0, top: 0, right: 390, bottom: 420 };

test('focused floating content stays visible when the mobile keyboard moves its trigger outside the viewport', () => {
    const triggerBelowViewport = { left: 16, top: 720, right: 374, bottom: 756 };

    assert.equal(floatingLayerVisibility(triggerBelowViewport, viewport, true), 'visible');
    assert.equal(floatingLayerVisibility(triggerBelowViewport, viewport, false), 'hidden');
});

test('unfocused floating content follows trigger visibility', () => {
    const visibleTrigger = { left: 16, top: 220, right: 374, bottom: 256 };

    assert.equal(floatingLayerVisibility(visibleTrigger, viewport, false), 'visible');
});

test('floating placement measures the untransformed layout box during scale animations', () => {
    const animatedElement = {
        offsetWidth: 184,
        offsetHeight: 36,
        getBoundingClientRect: () => ({ width: 180.32, height: 35.28 }) as DOMRect,
    };

    assert.deepEqual(floatingLayerSize(animatedElement), { width: 184, height: 36 });
});

test('floating placement falls back to the visual box before layout dimensions exist', () => {
    const detachedElement = {
        offsetWidth: 0,
        offsetHeight: 0,
        getBoundingClientRect: () => ({ width: 184.5, height: 36.5 }) as DOMRect,
    };

    assert.deepEqual(floatingLayerSize(detachedElement), { width: 184.5, height: 36.5 });
});
