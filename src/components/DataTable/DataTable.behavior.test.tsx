import assert from 'node:assert/strict';
import { after, afterEach, test } from 'node:test';
import { useState } from 'react';

import { setupDom } from '../../test-utils/dom.mts';

const restoreDom = setupDom();
const { cleanup, render, screen } = await import('@testing-library/react');
const { userEvent } = await import('@testing-library/user-event');

afterEach(cleanup);
after(restoreDom);

const { DataTable } = await import('./DataTable.js');

test('select-all covers every row on the page, not only the virtual window', async () => {
    function Harness() {
        const [selected, setSelected] = useState<string[]>([]);
        return (
            <>
                <output aria-label="selected count">{selected.length}</output>
                <DataTable
                    rows={[{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }]}
                    rowKey={(row) => row.id}
                    columns={[{ key: 'id', title: 'ID', render: (row) => row.id }]}
                    selectable
                    selectedRowKeys={selected}
                    onSelectedRowKeysChange={setSelected}
                    virtualized
                    virtualWindow={{ start: 0, end: 2, afterHeight: 88 }}
                />
            </>
        );
    }

    render(<Harness />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('checkbox', { name: 'Выбрать все строки' }));
    assert.equal(screen.getByRole('status', { name: 'selected count' }).textContent, '4');
});

test('keyboard state changes rerender only affected row boundaries', async () => {
    let renderCount = 0;
    const rows = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    const columns = [
        {
            key: 'id',
            title: 'ID',
            render: (row: { id: string }) => {
                renderCount += 1;
                return row.id;
            },
        },
    ];
    render(<DataTable rows={rows} rowKey={(row) => row.id} columns={columns} />);
    assert.equal(renderCount, 3);

    const grid = screen.getByRole('grid');
    grid.focus();
    const user = userEvent.setup();
    await user.keyboard('{ArrowDown}{ArrowDown}');
    assert.equal(renderCount, 6);
});
