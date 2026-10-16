import assert from 'node:assert/strict';
import { after, afterEach, test } from 'node:test';

import { setupDom } from '../../test-utils/dom.mts';

const restoreDom = setupDom();
const { act, cleanup, render, screen, waitFor } = await import('@testing-library/react');
const { userEvent } = await import('@testing-library/user-event');

Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: () => undefined,
});

afterEach(cleanup);
after(restoreDom);

const { OrcestrUiProvider } = await import('../../provider/OrcestrUiProvider.js');
const { PaginatedCombobox } = await import('./PaginatedCombobox.js');

for (const retry of [false, true]) test(`failed next page preserves selectable rows; retry=${retry}`, async () => {
    const previous = Object.getOwnPropertyDescriptor(globalThis, 'IntersectionObserver');
    const observers: Array<{ target: Element | null; callback: IntersectionObserverCallback }> = [];
    class Observer {
        state: (typeof observers)[number];
        constructor(callback: IntersectionObserverCallback) {
            this.state = { target: null, callback };
            observers.push(this.state);
        }
        observe(target: Element) { this.state.target = target; }
        disconnect() { this.state.target = null; }
        unobserve() { this.state.target = null; }
    }
    Object.defineProperty(globalThis, 'IntersectionObserver', { configurable: true, value: Observer });
    const calls: number[] = [];
    const selected: number[] = [];
    let fail = true;
    const user = userEvent.setup();
    const view = render(
        <OrcestrUiProvider locale="en">
            <PaginatedCombobox
                value={null}
                onChange={(item: { id: number } | null) => { if (item) selected.push(item.id); }}
                getItemId={(item) => item.id}
                renderOption={(item) => `Item ${item.id}`}
                renderSelectedLabel={(item) => `Item ${item.id}`}
                retryLabel="Retry page"
                loadPage={async (page) => {
                    calls.push(page);
                    if (page === 2 && fail) throw new Error('Unavailable');
                    return { items: [{ id: page * 2 - 1 }, { id: page * 2 }], page, has_next: page === 1 };
                }}
            />
        </OrcestrUiProvider>,
    );
    try {
        await user.click(screen.getByRole('combobox', { name: 'Not selected' }));
        await screen.findByText('Item 2');
        await waitFor(() => assert.ok(observers.some((observer) => observer.target)));
        const observer = observers.find((item) => item.target)!;
        await act(async () => observer.callback(
            [{ isIntersecting: true, target: observer.target! } as IntersectionObserverEntry],
            {} as IntersectionObserver,
        ));
        await screen.findByRole('alert', { hidden: true });
        assert.equal(screen.getAllByRole('option', { hidden: true }).length, 2);
        assert.ok(observers.every((item) => item.target === null));
        assert.deepEqual(calls, [1, 2]);
        if (retry) {
            await user.click(screen.getByText('Retry page'));
            await screen.findByRole('alert', { hidden: true });
            assert.equal(screen.getAllByRole('option', { hidden: true }).length, 2);
            fail = false;
            await user.click(screen.getByText('Retry page'));
            await screen.findByText('Item 4');
            assert.deepEqual(screen.getAllByRole('option', { hidden: true }).map((item) => item.textContent), ['Item 1', 'Item 2', 'Item 3', 'Item 4']);
            assert.deepEqual(calls, [1, 2, 2, 2]);
            assert.equal(screen.queryByRole('alert', { hidden: true }), null);
        }
        await user.click(screen.getByText('Item 2'));
        assert.deepEqual(selected, [2]);
    } finally {
        view.unmount();
        if (previous) Object.defineProperty(globalThis, 'IntersectionObserver', previous);
        else Reflect.deleteProperty(globalThis, 'IntersectionObserver');
    }
});

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
