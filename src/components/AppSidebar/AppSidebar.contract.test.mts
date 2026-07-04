import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const appSidebarStyles = readFileSync(
    new URL('../../styles/_app-sidebar.sass', import.meta.url),
    'utf8',
);
const appSidebarSource = readFileSync(new URL('./AppSidebar.tsx', import.meta.url), 'utf8');

test('AppSidebar active icons use text accent active icon token by default', () => {
    assert.match(
        appSidebarStyles,
        /\.oui-app-sidebar-item\[data-sidebar-active="true"\] \.oui-app-sidebar-item-icon\s+color: var\(--oui-primary-text\)/,
    );
});

test('AppSidebar defaults are scoped to Orcestr UI theme tokens', () => {
    assert.doesNotMatch(appSidebarStyles, /--color-background/);
    assert.doesNotMatch(appSidebarStyles, /var\(--gray-/);
});

test('AppSidebar active indicator keeps smooth transitions after first placement', () => {
    assert.doesNotMatch(appSidebarSource, /dataset\.motion/);
    assert.doesNotMatch(appSidebarSource, /readyFrameRef/);
    assert.doesNotMatch(appSidebarStyles, /data-motion/);
    assert.doesNotMatch(appSidebarStyles, /oui-app-sidebar-indicator--instant/);
    assert.match(appSidebarSource, /indicator\.dataset\.ready = 'false'/);
    assert.match(appSidebarSource, /indicator\.dataset\.ready = 'true'/);
    assert.match(appSidebarSource, /else \{\s+indicator\.dataset\.ready = 'true';\s+\}/);
    assert.doesNotMatch(appSidebarSource, /style\.transition/);
    assert.match(appSidebarSource, /const activeKey = appSidebarActiveKey\(groups\);/);
    assert.match(
        appSidebarSource,
        /const skipTransition = !indicatorPlacedRef\.current \|\| !animate/,
    );
    assert.match(appSidebarSource, /updateActiveIndicator\(false\)/);
    assert.match(
        appSidebarSource,
        /nextFrame = requestAnimationFrame\(\(\) => updateActiveIndicator\(\)\)/,
    );
    assert.match(appSidebarSource, /\}, \[activeKey, updateActiveIndicator\]\);/);
    assert.doesNotMatch(appSidebarSource, /\}, \[activeKey, groups, updateActiveIndicator\]\);/);
    assert.doesNotMatch(appSidebarSource, /transitionFrameRef/);
    assert.match(
        appSidebarStyles,
        /\.oui-app-sidebar-indicator\s+[\s\S]*transition: transform 600ms/,
    );
    assert.match(appSidebarStyles, /\.oui-app-sidebar-indicator\s+[\s\S]*height 600ms/);
    assert.match(
        appSidebarStyles,
        /\.oui-app-sidebar-indicator:not\(\[data-ready="true"\]\)\s+transition: none/,
    );
    assert.match(appSidebarStyles, /\.oui-app-sidebar-indicator\[data-ready="true"\]\s+opacity: 1/);
});
