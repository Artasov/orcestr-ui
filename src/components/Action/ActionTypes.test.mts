import assert from 'node:assert/strict';
import test from 'node:test';

import {createElement} from 'react';

import {
    actionItemSearchText,
    actionItemText,
    isActionItemDisabled,
    normalizeActionItems,
} from './ActionTypes.ts';

test('actionItemText extracts searchable text from action labels', () => {
    assert.equal(actionItemText('Open'), 'Open');
    assert.equal(actionItemText(42), '42');
    assert.equal(actionItemText(['Open ', createElement('strong', null, 'details')]), 'Open details');
    assert.equal(actionItemText(false), '');
});

test('isActionItemDisabled treats loading actions as unavailable', () => {
    assert.equal(isActionItemDisabled({key: 'open', label: 'Open'}), false);
    assert.equal(isActionItemDisabled({key: 'disabled', label: 'Disabled', disabled: true}), true);
    assert.equal(isActionItemDisabled({key: 'loading', label: 'Loading', loading: true}), true);
});

test('action helpers normalize recursive action items for shared surfaces', () => {
    const items = normalizeActionItems([
        {
            key: 'delete',
            label: 'Delete',
            description: createElement('span', null, 'Remove item'),
            shortcut: 'D',
            loading: true,
            tone: 'danger',
            confirm: {title: 'Delete?'},
            children: [
                {key: 'delete-soft', label: 'Soft delete'},
            ],
        },
    ]);

    assert.equal(actionItemSearchText(items[0]!.source), 'Delete Remove item D');
    assert.equal(items[0]!.disabled, true);
    assert.equal(items[0]!.loading, true);
    assert.equal(items[0]!.tone, 'danger');
    assert.equal(items[0]!.confirm?.title, 'Delete?');
    assert.equal(items[0]!.children?.[0]?.key, 'delete-soft');
    assert.equal(items[0]!.children?.[0]?.disabled, false);
});
