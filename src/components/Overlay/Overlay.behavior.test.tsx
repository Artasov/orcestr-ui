import assert from 'node:assert/strict';
import { after, afterEach, test } from 'node:test';

import { setupDom } from '../../test-utils/dom.mts';

const restoreDom = setupDom();
const { cleanup, fireEvent, render, screen, waitFor } = await import('@testing-library/react');
const { useState } = await import('react');

afterEach(cleanup);
after(restoreDom);

const { AppShell } = await import('../AppShell/AppShell.js');
const { Dialog } = await import('../Dialog/Dialog.js');
const { Modal } = await import('../Modal/Modal.js');
const { SpecialModal } = await import('../SpecialModal/SpecialModal.js');
const { OrcestrUiProvider } = await import('../../provider/OrcestrUiProvider.js');

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

test('SpecialModal.Close requests closing the owning modal', async () => {
    const changes: boolean[] = [];
    render(
        <OrcestrUiProvider>
            <SpecialModal
                open
                onOpenChange={(open) => changes.push(open)}
                ariaLabel="Closable dialog"
            >
                <SpecialModal.Header actions={<SpecialModal.Close aria-label="Close" />} />
                <SpecialModal.Body>Content</SpecialModal.Body>
            </SpecialModal>
        </OrcestrUiProvider>,
    );

    await screen.findByRole('dialog', { name: 'Closable dialog' });
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    assert.deepEqual(changes, [false]);
});

test('Dialog compound parts do not replace Modal or SpecialModal close buttons', async () => {
    assert.notEqual(Dialog, Modal);
    assert.equal(Modal.Close.name, 'ModalClose');

    const changes: boolean[] = [];
    render(
        <OrcestrUiProvider>
            <SpecialModal
                open
                onOpenChange={(open) => changes.push(open)}
                ariaLabel="Close remains a button"
            >
                <SpecialModal.Header actions={<SpecialModal.Close aria-label="Close preview" />} />
            </SpecialModal>
        </OrcestrUiProvider>,
    );

    const close = await screen.findByRole('button', { name: 'Close preview' });
    assert.equal(close.tagName, 'BUTTON');
    fireEvent.click(close);
    assert.deepEqual(changes, [false]);
});

test('modal overlay requests closing when it is pressed outside the content', async () => {
    const changes: boolean[] = [];
    render(
        <OrcestrUiProvider>
            <SpecialModal
                open
                onOpenChange={(open) => changes.push(open)}
                ariaLabel="Overlay close"
                testId="overlay-close"
            >
                <SpecialModal.Body>Content</SpecialModal.Body>
            </SpecialModal>
        </OrcestrUiProvider>,
    );

    await screen.findByRole('dialog', { name: 'Overlay close' });
    fireEvent.pointerDown(screen.getByTestId('overlay-close'));
    assert.deepEqual(changes, [false]);
});

test('AppShell mobile drawer closes outside without blocking its parent modal', async () => {
    function Harness() {
        const [open, setOpen] = useState(true);

        return (
            <OrcestrUiProvider>
                <SpecialModal
                    open
                    onOpenChange={() => undefined}
                    ariaLabel="AppShell preview"
                >
                    <SpecialModal.Header
                        actions={<SpecialModal.Close aria-label="Close preview" />}
                    />
                    <SpecialModal.Body>
                        <AppShell
                            sidebar={<nav>Navigation</nav>}
                            sidebarMode="mobile"
                            sidebarOpen={open}
                            onSidebarOpenChange={setOpen}
                            testId="shell"
                        >
                            <div>Content</div>
                        </AppShell>
                    </SpecialModal.Body>
                </SpecialModal>
            </OrcestrUiProvider>
        );
    }

    render(<Harness />);

    const backdrop = await screen.findByTestId('shell-sidebar-drawer-backdrop');
    const drawerRoot = document.querySelector<HTMLElement>('.oui-app-shell-drawer-root');
    assert.ok(drawerRoot);
    await waitFor(() => {
        assert.equal(backdrop.hasAttribute('inert'), false);
        assert.equal(backdrop.closest('[inert]'), null);
        assert.equal(screen.getByTestId('shell').dataset.sidebarOpen, 'true');
        assert.equal(
            screen.getByRole('dialog', { name: 'AppShell preview' }).hasAttribute('inert'),
            false,
        );
    });

    fireEvent.pointerDown(backdrop);

    await waitFor(() => {
        assert.equal(screen.getByTestId('shell').dataset.sidebarOpen, 'false');
        assert.equal(
            screen.getByRole('button', { name: 'Close preview' }).closest('[inert]'),
            null,
        );
    });

    cleanup();
    assert.equal(document.querySelector('.oui-drawer-layer'), null);
});
