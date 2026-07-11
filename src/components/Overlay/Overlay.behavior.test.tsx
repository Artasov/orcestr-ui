import assert from 'node:assert/strict';
import { after, afterEach, test } from 'node:test';

import { setupDom } from '../../test-utils/dom.mts';

const restoreDom = setupDom();
const { cleanup, render, screen, waitFor } = await import('@testing-library/react');

afterEach(cleanup);
after(restoreDom);

const { Modal } = await import('../Modal/Modal');
const { OrcestrUiProvider } = await import('../../provider/OrcestrUiProvider');

test('empty modal receives focus and makes background inert', async () => {
    render(
        <OrcestrUiProvider>
            <button type="button">Background</button>
            <Modal open onOpenChange={() => undefined} ariaLabel="Example dialog">
                Plain content
            </Modal>
        </OrcestrUiProvider>,
    );

    const dialog = await screen.findByRole('dialog', { name: 'Example dialog' });
    await waitFor(() => assert.equal(document.activeElement, dialog));
    const background = screen.getByText('Background');
    assert.equal(background.getAttribute('aria-hidden'), 'true');
    assert.equal(background.inert, true);
});

test('modal autofocus can be cancelled by the public event', async () => {
    let prevented = false;
    render(
        <OrcestrUiProvider>
            <Modal
                open
                onOpenChange={() => undefined}
                ariaLabel="Cancelled focus"
                onOpenAutoFocus={(event) => {
                    event.preventDefault();
                    prevented = true;
                }}
            >
                <button type="button">Inside</button>
            </Modal>
        </OrcestrUiProvider>,
    );

    await screen.findByRole('dialog', { name: 'Cancelled focus' });
    assert.equal(prevented, true);
    assert.notEqual(document.activeElement, screen.getByRole('button', { name: 'Inside' }));
});
