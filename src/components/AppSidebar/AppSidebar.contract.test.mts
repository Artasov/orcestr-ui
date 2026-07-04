import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const appSidebarStyles = readFileSync(
    new URL('../../styles/_app-sidebar.sass', import.meta.url),
    'utf8',
);

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
