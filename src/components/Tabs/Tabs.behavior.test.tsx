import assert from 'node:assert/strict';
import { after, afterEach, test } from 'node:test';
import { useState } from 'react';

import { setupDom } from '../../test-utils/dom.mts';

const restoreDom = setupDom();
const { cleanup, render, screen } = await import('@testing-library/react');
const { userEvent } = await import('@testing-library/user-event');

afterEach(cleanup);
after(restoreDom);

const { Tabs } = await import('./Tabs.js');

test('compound tabs use roving focus and linked tabpanel ids', async () => {
    render(
        <Tabs.Root defaultValue="one">
            <Tabs.List>
                <Tabs.Trigger value="one">One</Tabs.Trigger>
                <Tabs.Trigger value="two">Two</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="one">First panel</Tabs.Content>
            <Tabs.Content value="two">Second panel</Tabs.Content>
        </Tabs.Root>,
    );
    const user = userEvent.setup();
    const first = screen.getByRole('tab', { name: 'One' });
    const second = screen.getByRole('tab', { name: 'Two' });
    assert.equal(first.querySelector('.oui-tabs-trigger-label')?.textContent, 'One');
    assert.equal(second.querySelector('.oui-tabs-trigger-label')?.textContent, 'Two');
    const secondPanel = screen.getByText('Second panel').closest('[role="tabpanel"]');
    assert.ok(secondPanel);
    assert.equal(secondPanel.hasAttribute('hidden'), false);
    assert.equal(secondPanel.getAttribute('aria-hidden'), 'true');
    assert.equal(secondPanel.hasAttribute('inert'), true);
    assert.equal(secondPanel.querySelector('.oui-collapse')?.getAttribute('data-state'), 'closed');
    first.focus();
    await user.keyboard('{ArrowRight}');

    assert.equal(document.activeElement, second);
    assert.equal(second.getAttribute('aria-selected'), 'true');
    assert.equal(first.tabIndex, -1);
    assert.equal(secondPanel.getAttribute('aria-hidden'), null);
    assert.equal(secondPanel.hasAttribute('inert'), false);
    assert.equal(secondPanel.querySelector('.oui-collapse')?.getAttribute('data-state'), 'open');
    assert.equal(
        second.getAttribute('aria-controls'),
        screen.getByText('Second panel').closest('[role="tabpanel"]')?.id,
    );
});

test('item tabs render one label box and keep badges as sibling flex items', () => {
    render(
        <Tabs
            value="one"
            onValueChange={() => undefined}
            items={[{ value: 'one', label: 'One', badge: '3', content: 'First panel' }]}
        />,
    );

    const tab = screen.getByRole('tab', { name: 'One3' });
    assert.equal(tab.querySelectorAll('.oui-tabs-trigger-label').length, 1);
    assert.equal(tab.querySelector('.oui-tabs-trigger-label')?.textContent, 'One');
    assert.equal(tab.querySelector('.oui-tabs-trigger-badge')?.textContent, '3');
    assert.equal(tab.querySelector('.oui-tabs-trigger-badge')?.parentElement, tab);
});

test('item facade uses the same compound keyboard model', async () => {
    function Harness() {
        const [value, setValue] = useState('one');
        return (
            <Tabs
                value={value}
                onValueChange={setValue}
                items={[
                    { value: 'one', label: 'One', content: 'First' },
                    { value: 'two', label: 'Two', content: 'Second' },
                ]}
            />
        );
    }
    render(<Harness />);
    const user = userEvent.setup();
    const first = screen.getByRole('tab', { name: 'One' });
    first.focus();
    await user.keyboard('{End}');
    assert.equal(screen.getByRole('tab', { name: 'Two' }).getAttribute('aria-selected'), 'true');
});
