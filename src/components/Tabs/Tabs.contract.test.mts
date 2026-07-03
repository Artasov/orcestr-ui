import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';

const tabsSource = readFileSync(new URL('./Tabs.tsx', import.meta.url), 'utf8');
const selectionStyles = readFileSync(
    new URL('../../styles/_selection.sass', import.meta.url),
    'utf8',
);

test('Tabs keep stable trigger height with badges', () => {
    assert.match(tabsSource, /badge\?: ReactNode/);
    assert.match(tabsSource, /className='oui-tabs-trigger-badge'/);
    assert.match(selectionStyles, /\.oui-tabs-trigger\s+position: relative[\s\S]*?height: 34px/);
    assert.match(selectionStyles, /\.oui-tabs-trigger\s+position: relative[\s\S]*?padding: 0 14px/);
    assert.match(selectionStyles, /\.oui-tabs-trigger-badge\s+display: inline-flex[\s\S]*?min-width: 16px[\s\S]*?height: 16px[\s\S]*?font-size: 10px/);
});

test('Tabs hide hover indicator when hovering the active tab', () => {
    assert.match(tabsSource, /hoveredValue !== active\?\.value/);
    assert.match(selectionStyles, /\.oui-tabs-active-indicator,[\s\S]*?\.oui-tabs-hover-indicator[\s\S]*?transition: left 380ms[\s\S]*?opacity 220ms ease/);
    assert.match(selectionStyles, /\.oui-tabs-hover-indicator\s+z-index: 0[\s\S]*?opacity: 0/);
    assert.match(selectionStyles, /\.oui-tabs-hover-indicator\[data-visible="true"\]\s+opacity: 1/);
});

test('Tabs expose compound API for app-level document tabs', () => {
    assert.match(tabsSource, /function Root/);
    assert.match(tabsSource, /function List/);
    assert.match(tabsSource, /function Trigger/);
    assert.match(tabsSource, /function Content/);
    assert.match(tabsSource, /export const Tabs = Object\.assign\(ItemTabs, \{/);
    assert.match(tabsSource, /Root,\s*List,\s*Trigger,\s*Content,/);
    assert.match(selectionStyles, /\.oui-tabs-list-scroll/);
    assert.match(selectionStyles, /\.oui-tabs-count-badge/);
});

test('Tabs active icons use text accent active icon token', () => {
    assert.match(
        selectionStyles,
        /\.oui-tabs-trigger\[data-active="true"\] \.oui-tabs-trigger-icon\s+color: var\(--oui-primary-text\)/,
    );
});
