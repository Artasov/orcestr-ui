import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

import { resolveMenuSubmenuPlacement } from './menuPlacement.ts';

const menuSource = readFileSync(new URL('./Menu.tsx', import.meta.url), 'utf8');
const overlayStyles = readFileSync(new URL('../../styles/_overlays.sass', import.meta.url), 'utf8');

test('submenu flips left when the right side would leave the viewport', () => {
    assert.deepEqual(
        resolveMenuSubmenuPlacement({
            rowLeft: 760,
            rowRight: 980,
            submenuWidth: 220,
            submenuTop: 100,
            submenuBottom: 180,
            viewportWidth: 1000,
            viewportHeight: 800,
        }),
        { side: 'left', shiftX: 0, shiftY: 0 },
    );
});

test('submenu keeps the preferred right side when it fits', () => {
    assert.deepEqual(
        resolveMenuSubmenuPlacement({
            rowLeft: 40,
            rowRight: 260,
            submenuWidth: 220,
            submenuTop: 100,
            submenuBottom: 180,
            viewportWidth: 1000,
            viewportHeight: 800,
        }),
        { side: 'right', shiftX: 0, shiftY: 0 },
    );
});

test('submenu clamps horizontally when neither side can fully fit', () => {
    const placement = resolveMenuSubmenuPlacement({
        rowLeft: 210,
        rowRight: 430,
        submenuWidth: 240,
        submenuTop: 100,
        submenuBottom: 180,
        viewportWidth: 641,
        viewportHeight: 800,
    });

    assert.equal(placement.side, 'right');
    assert.equal(430 + 4 + placement.shiftX, 389);
});

test('submenu shifts vertically inside viewport collision padding', () => {
    assert.equal(
        resolveMenuSubmenuPlacement({
            rowLeft: 500,
            rowRight: 720,
            submenuWidth: 220,
            submenuTop: 720,
            submenuBottom: 900,
            viewportWidth: 1000,
            viewportHeight: 800,
        }).shiftY,
        -112,
    );
    assert.equal(
        resolveMenuSubmenuPlacement({
            rowLeft: 500,
            rowRight: 720,
            submenuWidth: 220,
            submenuTop: -20,
            submenuBottom: 160,
            viewportWidth: 1000,
            viewportHeight: 800,
        }).shiftY,
        32,
    );
});

test('Menu applies measured submenu placement to its floating content', () => {
    assert.match(menuSource, /resolveMenuSubmenuPlacement\(\{/);
    assert.match(menuSource, /data-side=\{submenuPlacement\.side\}/);
    assert.match(menuSource, /--oui-menu-submenu-shift-x/);
    assert.match(menuSource, /--oui-menu-submenu-shift-y/);
    assert.match(overlayStyles, /\.oui-menu-subcontent\[data-side="left"\][\s\S]*right: calc\(/);
});
