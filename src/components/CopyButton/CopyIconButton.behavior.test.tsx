import assert from 'node:assert/strict';
import {after, afterEach, test} from 'node:test';
import {setupDom} from '../../test-utils/dom.mts';

const restoreDom = setupDom();
const {act, cleanup, fireEvent, render, waitFor} = await import('@testing-library/react');
const {CopyIconButton} = await import('./CopyButton.js');
const {OrcestrUiProvider} = await import('../../provider/OrcestrUiProvider.js');
afterEach(cleanup);
after(restoreDom);

test('a copy icon can represent a link without a visible label while retaining clipboard feedback', async (context) => {
    const writes: string[] = [];
    const previous = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
    Object.defineProperty(navigator, 'clipboard', {configurable: true, value: {writeText: async (text: string) => {writes.push(text);}}});
    context.after(() => {if (previous) Object.defineProperty(navigator, 'clipboard', previous); else Reflect.deleteProperty(navigator, 'clipboard');});
    const view = render(<OrcestrUiProvider><CopyIconButton text='https://example.com/card' label='Copy link' icon={<svg data-testid='link-icon' />} successMessage='' errorMessage='' resetMs={50} /></OrcestrUiProvider>);
    const button = view.getByRole('button', {name: 'Copy link'});
    assert.equal(button.textContent, ''); assert.ok(button.querySelector('[data-testid=link-icon]'));
    await act(async () => fireEvent.click(button));
    await waitFor(() => assert.deepEqual(writes, ['https://example.com/card']));
    assert.equal(button.querySelector('[data-testid=link-icon]'), null, 'Successful copy temporarily shows its confirmation icon.');
    await waitFor(() => assert.ok(button.querySelector('[data-testid=link-icon]')));
    assert.equal(button.textContent, '');
});
