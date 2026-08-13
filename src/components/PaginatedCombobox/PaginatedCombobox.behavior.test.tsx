import assert from 'node:assert/strict';
import { after, afterEach, test } from 'node:test';

import { setupDom } from '../../test-utils/dom.mts';

const restoreDom = setupDom();
const { cleanup, render, screen, waitFor } = await import('@testing-library/react');
const { userEvent } = await import('@testing-library/user-event');

Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: () => undefined,
});

afterEach(cleanup);
after(restoreDom);

const { OrcestrUiProvider } = await import('../../provider/OrcestrUiProvider.js');
const { PaginatedCombobox } = await import('./PaginatedCombobox.js');

test('new searches abort stale requests and pass pageSize to the loader', async () => {
    const calls: Array<{ search: string; pageSize?: number }> = [];
    const aborted: string[] = [];
    const user = userEvent.setup();
    render(
        <OrcestrUiProvider locale="en">
            <PaginatedCombobox
                value={null}
                onChange={() => undefined}
                pageSize={25}
                debounceMs={0}
                getItemId={(item: { id: number }) => item.id}
                renderOption={(item) => item.id}
                renderSelectedLabel={(item) => item.id}
                loadPage={(_page, search, { signal, pageSize }) =>
                    new Promise((resolve, reject) => {
                        calls.push({ search, pageSize });
                        signal.addEventListener('abort', () => {
                            aborted.push(search);
                            reject(new DOMException('Aborted', 'AbortError'));
                        });
                        if (search === 'x') {
                            resolve({ items: [], page: 1, has_next: false });
                        }
                    })
                }
            />
        </OrcestrUiProvider>,
    );

    await user.click(screen.getByRole('combobox', { name: 'Not selected' }));
    const search = await screen.findByPlaceholderText('Search');
    await waitFor(() => assert.ok(calls.some((call) => call.search === '')));
    await user.type(search, 'x');
    await waitFor(() => assert.ok(calls.some((call) => call.search === 'x')));
    await screen.findByText('No options');

    assert.ok(aborted.includes(''));
    assert.ok(calls.every((call) => call.pageSize === 25));
});

test('changing an inline loader identity does not reset an open result list', async () => {
    const calls: number[] = [];
    const user = userEvent.setup();
    const load = async (page: number) => {
        calls.push(page);
        return { items: [{ id: 1 }, { id: 2 }], page: 1, has_next: false };
    };
    const view = render(
        <OrcestrUiProvider locale="en">
            <PaginatedCombobox
                value={null}
                onChange={() => undefined}
                debounceMs={0}
                getItemId={(item: { id: number }) => item.id}
                renderOption={(item) => `Item ${item.id}`}
                renderSelectedLabel={(item) => `Item ${item.id}`}
                loadPage={(page) => load(page)}
            />
        </OrcestrUiProvider>,
    );

    await user.click(screen.getByRole('combobox', { name: 'Not selected' }));
    await screen.findByText('Item 2');
    const callsAfterOpen = calls.length;

    view.rerender(
        <OrcestrUiProvider locale="en">
            <PaginatedCombobox
                value={null}
                onChange={() => undefined}
                debounceMs={0}
                getItemId={(item: { id: number }) => item.id}
                renderOption={(item) => `Item ${item.id}`}
                renderSelectedLabel={(item) => `Item ${item.id}`}
                loadPage={(page) => load(page)}
            />
        </OrcestrUiProvider>,
    );

    assert.ok(screen.getByText('Item 2'));
    assert.equal(calls.length, callsAfterOpen);
});
