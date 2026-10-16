import assert from 'node:assert/strict';
import {after, afterEach, test} from 'node:test';
import {setupDom} from '../../test-utils/dom.mts';

const restoreDom = setupDom();
const {act, cleanup, fireEvent, render, waitFor} = await import('@testing-library/react');
const {useState} = await import('react');
const {OrcestrUiProvider} = await import('../../provider/OrcestrUiProvider.js');
const {BadgeSelectMenu} = await import('./BadgeSelectMenu.js');
afterEach(cleanup);
after(restoreDom);

test('badge selectors are reachable by keyboard and Enter/Space open a navigable listbox', async () => {
    const changes: string[] = [];
    function Harness() {
        const [value, setValue] = useState('normal');
        return <OrcestrUiProvider><BadgeSelectMenu value={value} items={[{value: 'normal', label: 'Normal'}, {value: 'blocked', label: 'Blocked', disabled: true}, {value: 'high', label: 'High'}]} onValueChange={(next) => {setValue(next); changes.push(next);}} /></OrcestrUiProvider>;
    }
    const view = render(<Harness />);
    const trigger = view.getByRole('button', {name: 'Normal'});
    assert.equal(trigger.tabIndex, 0); assert.equal(trigger.getAttribute('aria-haspopup'), 'listbox');
    await act(async () => {trigger.focus(); fireEvent.keyDown(trigger, {key: 'Enter', code: 'Enter'});});
    await waitFor(() => assert.ok(document.querySelector('[role="listbox"]')));
    const first = document.querySelector<HTMLElement>('[role="option"][aria-selected="true"]'); assert.ok(first);
    await act(async () => {first.focus(); fireEvent.keyDown(first, {key: 'ArrowDown'});});
    assert.equal(document.activeElement?.textContent?.trim(), 'High', 'Arrow navigation skips disabled options.');
    await act(async () => fireEvent.click(document.activeElement!));
    assert.deepEqual(changes, ['high']);
    await waitFor(() => assert.equal(trigger.getAttribute('aria-expanded'), 'false'));
    await act(async () => fireEvent.keyDown(trigger, {key: ' ', code: 'Space'}));
    await waitFor(() => assert.equal(trigger.getAttribute('aria-expanded'), 'true'));
    const selected = document.querySelector<HTMLElement>('[role="option"][aria-selected="true"]'); assert.ok(selected);
    await act(async () => {selected.focus(); fireEvent.keyDown(selected, {key: 'Home'});});
    assert.equal(document.activeElement?.textContent?.trim(), 'Normal');
    await act(async () => fireEvent.click(document.activeElement!)); assert.deepEqual(changes, ['high', 'normal']);
});

test('a disabled badge selector remains readable and cannot open or change selection', async () => {
    let changed = false;
    const view = render(<OrcestrUiProvider><BadgeSelectMenu value='normal' disabled items={[{value: 'normal', label: 'Normal'}]} onValueChange={() => {changed = true;}} /></OrcestrUiProvider>);
    const badge = view.getByText('Normal'); assert.equal(badge.getAttribute('aria-disabled'), 'true'); assert.equal(badge.hasAttribute('tabindex'), false);
    await act(async () => {fireEvent.click(badge); fireEvent.keyDown(badge, {key: 'Enter', code: 'Enter'});});
    assert.equal(document.querySelector('[role="listbox"]'), null); assert.equal(changed, false);
});

for (const succeeds of [true, false]) test(`loading replaces the icon in its fixed slot, preserves the label and leaves a disabled neighbour idle (${succeeds ? 'resolve' : 'reject'})`, async () => {
    let finish: () => void = () => {};
    const changes: string[] = [];
    function Harness() {
        const [value, setValue] = useState('normal'), [loading, setLoading] = useState(false);
        return <OrcestrUiProvider><BadgeSelectMenu testId='saving-badge' value={value} icon={<span data-testid='idle-icon'>◆</span>} loading={loading} items={[{value: 'normal', label: 'Normal'}, {value: 'high', label: 'High'}]} onValueChange={(next) => {
            changes.push(next); setValue(next); setLoading(true);
            void new Promise<void>((resolve, reject) => {finish = succeeds ? resolve : () => reject(new Error('Unavailable'));}).catch(() => undefined).finally(() => setLoading(false));
        }} /><BadgeSelectMenu testId='neighbour-badge' value='other' disabled={loading} icon={<span>●</span>} items={[{value: 'other', label: 'Neighbour'}]} onValueChange={() => {}} /></OrcestrUiProvider>;
    }
    const view = render(<Harness />);
    let [badge, neighbour] = [...view.container.querySelectorAll<HTMLElement>('.oui-badge-select-trigger')];
    const slot = badge.querySelector<HTMLElement>('.oui-badge-icon>span'); assert.ok(slot); assert.equal(slot.style.width, '1em'); assert.equal(slot.style.height, '1em');
    await act(async () => {fireEvent.click(badge);});
    await waitFor(() => assert.ok(document.querySelector('[role="listbox"]')));
    const option = [...document.querySelectorAll<HTMLButtonElement>('[role="option"]')].find((item) => item.textContent === 'High'); assert.ok(option);
    await act(async () => {fireEvent.click(option);});
    [badge, neighbour] = [...view.container.querySelectorAll<HTMLElement>('.oui-badge-select-trigger')];
    assert.equal(badge.getAttribute('aria-busy'), 'true'); assert.ok(badge.querySelector('.oui-spinner')); assert.equal(badge.textContent, 'High');
    assert.equal(badge.querySelector('[data-testid="idle-icon"]'), null); assert.equal(neighbour.querySelector('.oui-spinner'), null); assert.equal(neighbour.getAttribute('aria-busy'), null);
    assert.equal(badge.querySelector<HTMLElement>('.oui-badge-icon>span')?.style.width, slot.style.width);
    await act(async () => {fireEvent.click(badge); fireEvent.keyDown(badge, {key: 'Enter', code: 'Enter'});});
    assert.equal(document.querySelector('[role="listbox"]'), null); assert.deepEqual(changes, ['high']);
    await act(async () => {finish();});
    [badge] = [...view.container.querySelectorAll<HTMLElement>('.oui-badge-select-trigger')];
    await waitFor(() => assert.equal(badge.getAttribute('aria-busy'), null));
    assert.equal(badge.querySelector('.oui-spinner'), null); assert.ok(badge.querySelector('[data-testid="idle-icon"]')); assert.ok(badge.textContent?.includes('High'));
});
