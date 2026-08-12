import assert from 'node:assert/strict';
import test from 'node:test';

import {
    parseEditableThemeColor,
    serializeEditableThemeColor,
} from './themeEditorColor.js';

test('theme color editor accepts opaque, transparent and alpha CSS colors', () => {
    assert.deepEqual(parseEditableThemeColor('#ffffff1b'), {
        hex: '#ffffff',
        opacity: 27 / 255,
    });
    assert.deepEqual(parseEditableThemeColor('transparent'), {
        hex: '#000000',
        opacity: 0,
    });
    assert.deepEqual(parseEditableThemeColor('rgb(255 255 255 / 4%)'), {
        hex: '#ffffff',
        opacity: 0.04,
    });
    assert.deepEqual(parseEditableThemeColor('rgba(12, 24, 36, 0.5)'), {
        hex: '#0c1824',
        opacity: 0.5,
    });
});

test('theme color editor serializes alpha without losing the selected color', () => {
    assert.equal(serializeEditableThemeColor('#ffffff', 1), '#ffffff');
    assert.equal(serializeEditableThemeColor('#ffffff', 0.04), 'rgb(255 255 255 / 4%)');
    assert.equal(serializeEditableThemeColor('#123456', 0), 'rgb(18 52 86 / 0%)');
});
