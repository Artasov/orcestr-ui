import assert from 'node:assert/strict';
import { after, afterEach, test } from 'node:test';

import { setupDom } from '../../test-utils/dom.mts';

const restoreDom = setupDom();
const { cleanup, fireEvent, render, screen } = await import('@testing-library/react');
const { SegmentedControl } = await import('./SegmentedControl.js');

afterEach(cleanup);
after(restoreDom);

test('compound segments retain text and count markup', () => {
    const changes: string[] = [];
    render(
        <SegmentedControl.Root value="mine" onValueChange={(value) => changes.push(value)}>
            <SegmentedControl.Item value="mine">Mine</SegmentedControl.Item>
            <SegmentedControl.Item value="unassigned">
                Unassigned <span data-testid="count">7</span>
            </SegmentedControl.Item>
        </SegmentedControl.Root>,
    );

    assert.equal(screen.getByRole('button', { name: 'Mine' }).getAttribute('aria-pressed'), 'true');
    const target = screen.getByRole('button', { name: 'Unassigned 7' });
    assert.equal(target.getAttribute('aria-pressed'), 'false');
    assert.ok(target.contains(screen.getByTestId('count')));
    assert.equal(target.textContent, 'Unassigned 7');
    fireEvent.click(target);
    assert.deepEqual(changes, ['unassigned']);
});
