import assert from 'node:assert/strict';
import test from 'node:test';

import { floatingLayerVisibility } from './useFloatingPosition.js';

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
