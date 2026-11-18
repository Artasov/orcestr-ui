import assert from 'node:assert/strict';
import { after, afterEach, test } from 'node:test';
import { useState } from 'react';

import { setupDom } from '../../test-utils/dom.mts';

const restoreDom = setupDom();
const { cleanup, fireEvent, render, screen } = await import('@testing-library/react');
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

for (const variant of ['items', 'compound'] as const) {
    test(`${variant} tabs expose only the scrollable edges and retain keyboard navigation`, async () => {
        render(
            <Tabs.Root defaultValue="one">
                <Tabs.List variant={variant}>
                    <Tabs.Trigger value="one">One</Tabs.Trigger>
                    <Tabs.Trigger value="two">Two</Tabs.Trigger>
                    <Tabs.Trigger value="three">Three</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="one">First panel</Tabs.Content>
                <Tabs.Content value="two">Second panel</Tabs.Content>
                <Tabs.Content value="three">Third panel</Tabs.Content>
            </Tabs.Root>,
        );
        const list = screen.getByRole('tablist');
        let viewport = 180;
        Object.defineProperties(list, {
            clientWidth: {configurable: true, get: () => viewport},
            scrollWidth: {configurable: true, get: () => Math.max(366, viewport)},
            scrollBy: {configurable: true, value: ({left}: ScrollToOptions) => {
                list.scrollLeft = Math.max(0, Math.min(list.scrollWidth - viewport, list.scrollLeft + (left ?? 0)));
                fireEvent.scroll(list);
            }},
        });
        const edge = (side: 'left' | 'right') => list.parentElement?.querySelector(`.oui-tabs-scroll-button-${side}`);
        fireEvent.scroll(list);
        assert.equal(list.dataset.scrollLeft, undefined, 'There must be no left gutter at the start');
        assert.equal(list.dataset.scrollRight, 'true');
        assert.equal(edge('left'), null);
        assert.ok(edge('right'));

        const user = userEvent.setup();
        await user.click(edge('right')!);
        assert.equal(list.scrollLeft, 160);
        assert.equal(list.dataset.scrollLeft, 'true');
        assert.equal(list.dataset.scrollRight, 'true');
        assert.ok(edge('left'));
        assert.ok(edge('right'));

        await user.click(edge('right')!);
        assert.equal(list.scrollLeft, 186);
        assert.equal(list.dataset.scrollLeft, 'true');
        assert.equal(list.dataset.scrollRight, undefined, 'The final tab must not retain a right control gutter');
        assert.equal(edge('right'), null);

        const first = screen.getByRole('tab', {name: 'One'});
        const last = screen.getByRole('tab', {name: 'Three'});
        last.focus();
        await user.keyboard('{Home}');
        assert.equal(document.activeElement, first);
        assert.equal(first.getAttribute('aria-selected'), 'true');
        assert.equal(first.tabIndex, 0);
        await user.keyboard('{End}');
        assert.equal(document.activeElement, last);
        assert.equal(last.getAttribute('aria-selected'), 'true');
        assert.equal(first.tabIndex, -1);
        await user.keyboard('{ArrowLeft}');
        assert.equal(document.activeElement, screen.getByRole('tab', {name: 'Two'}));

        viewport = 400;
        list.scrollLeft = 0;
        fireEvent.scroll(list);
        assert.equal(list.dataset.overflow, undefined);
        assert.equal(list.dataset.scrollLeft, undefined);
        assert.equal(list.dataset.scrollRight, undefined);
        assert.equal(edge('left'), null);
        assert.equal(edge('right'), null);
    });

    test(`${variant} tabs hand hover to selection once and clear pointer feedback for keyboard navigation`, async () => {
        const changes: string[] = [];
        render(
            <Tabs.Root defaultValue="one" onValueChange={value => changes.push(value)}>
                <Tabs.List variant={variant}>
                    <Tabs.Trigger value="one">One</Tabs.Trigger>
                    <Tabs.Trigger value="two">Two</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="one">First panel</Tabs.Content>
                <Tabs.Content value="two">Second panel</Tabs.Content>
            </Tabs.Root>,
        );
        const user = userEvent.setup();
        const first = screen.getByRole('tab', {name: 'One'}), second = screen.getByRole('tab', {name: 'Two'});
        for (const [index, tab] of [first, second].entries()) {
            Object.defineProperties(tab, {
                offsetLeft: {configurable: true, value: index * 120},
                offsetTop: {configurable: true, value: 2},
                offsetWidth: {configurable: true, value: 110},
                offsetHeight: {configurable: true, value: 34},
            });
        }
        const prefix = variant === 'items' ? 'oui-tabs' : 'oui-tabs-compound';
        const active = document.querySelector<HTMLElement>(`.${prefix}-active-indicator`)!;
        await user.hover(second);
        const hover = document.querySelector<HTMLElement>(`.${prefix}-hover-indicator`)!;
        assert.equal(hover.dataset.visible, 'true');
        assert.equal(hover.dataset.selected, undefined);
        assert.equal(active.style.left, '0px');
        await user.hover(first);
        assert.equal(hover.dataset.selected, 'true');
        assert.equal(hover.dataset.visible, undefined);
        assert.equal(hover.style.left, active.style.left, 'The hover background should move back to the selected tab');
        assert.equal(document.querySelector(`.${prefix}-hover-indicator`), hover);
        assert.deepEqual(changes, []);
        await user.hover(second);
        await user.click(second);
        assert.deepEqual(changes, ['two']);
        assert.equal(hover.dataset.selected, 'true', 'The hover layer stays mounted for the CSS handoff');
        assert.equal(document.querySelector(`.${prefix}-hover-indicator`), hover);
        assert.equal(hover.dataset.visible, undefined);
        assert.equal(active.style.left, '120px');
        assert.equal(hover.style.left, active.style.left);
        assert.equal(active.style.top, hover.style.top);
        assert.equal(document.querySelector(`.${prefix}-active-indicator`), active);
        await user.click(second);
        assert.deepEqual(changes, ['two'], 'Clicking the selected tab must not emit another selection');
        await user.keyboard('{Home}');
        assert.deepEqual(changes, ['two', 'one']);
        assert.equal(active.style.left, '0px');
        assert.equal(hover.dataset.visible, undefined, 'Keyboard navigation must not leave a second pointer highlight');
        await user.unhover(second);
        assert.equal(active.style.left, '0px');
        assert.equal(hover.dataset.visible, undefined);
    });
}
