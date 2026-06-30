'use client';

import {useMemo, useState} from 'react';

import {
    Badge,
    Button,
    DataTable,
    Text,
    TextField,
    type DataTableColumn,
    type DataTableSort,
} from '..';
import {ExampleTile} from './CodePreview';
import {codeSamples, type CodeExample} from './codeSamples';
import {UiExampleSection} from './UiExampleSection';

type DataSectionProps = {
    onOpenCode: (example: CodeExample) => void;
};

type DemoRow = {
    name: string;
    status: 'Blocked' | 'Done' | 'Working';
    owner: 'Team A' | 'Team B' | 'Team C';
    quantity: number;
};

const rows: DemoRow[] = [
    {name: 'Review item', status: 'Done', owner: 'Team C', quantity: 128},
    {name: 'Review task', status: 'Working', owner: 'Team B', quantity: 42},
    {name: 'Complete', status: 'Blocked', owner: 'Team A', quantity: 12},
    {name: 'Return', status: 'Working', owner: 'Team C', quantity: 7},
    {name: 'Audit task', status: 'Done', owner: 'Team B', quantity: 64},
    {name: 'Sync task', status: 'Blocked', owner: 'Team A', quantity: 18},
];

const columns: DataTableColumn<DemoRow>[] = [
    {
        key: 'name',
        title: 'Name',
        sortable: true,
        resizable: true,
        minWidth: 170,
        render: (row) => row.name,
    },
    {
        key: 'status',
        title: 'Status',
        sortable: true,
        resizable: true,
        width: 150,
        render: (row) => <Badge tone={statusTone(row.status)}>{row.status}</Badge>,
    },
    {
        key: 'owner',
        title: 'Owner',
        sortable: true,
        resizable: true,
        width: 180,
        render: (row) => row.owner,
    },
    {
        key: 'quantity',
        title: 'Qty',
        sortable: true,
        align: 'right',
        width: 90,
        hideable: true,
        render: (row) => row.quantity,
    },
];

const defaultVisibleColumnKeys = columns
    .filter((column) => column.defaultVisible !== false)
    .map((column) => column.key);
const defaultColumnOrder = columns.map((column) => column.key);

export function DataSection({onOpenCode}: DataSectionProps) {
    const [query, setQuery] = useState('');
    const [sort, setSort] = useState<DataTableSort | null>({
        key: 'name',
        direction: 'asc',
    });
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>(['Review item']);
    const [visibleColumnKeys, setVisibleColumnKeys] = useState<string[]>(
        defaultVisibleColumnKeys,
    );
    const [columnOrder, setColumnOrder] = useState<string[]>(defaultColumnOrder);
    const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
    const filteredRows = useMemo(
        () => sortRows(rows.filter((row) => rowMatches(row, query)), sort),
        [query, sort],
    );

    return (
        <UiExampleSection
            id='data-table-example'
            title='DataTable'
            description='Reusable DataTable without CRUD or page-level entity logic.'
        >
            <ExampleTile
                className='oui-ui-table-tile'
                title='DataTable'
                code={codeSamples.data}
                onOpen={onOpenCode}
            >
                <div className='oui-ui-table-demo'>
                    <DataTable
                        toolbar={(
                            <>
                                <TextField
                                    value={query}
                                    placeholder='Filter rows'
                                    clearable
                                    onChange={(event) => setQuery(event.target.value)}
                                    onClear={() => setQuery('')}
                                />
                                <Button
                                    size={3}
                                    v='surface'
                                    onClick={() => {
                                        setVisibleColumnKeys(defaultVisibleColumnKeys);
                                        setColumnOrder(defaultColumnOrder);
                                        setColumnWidths({});
                                    }}
                                >
                                    Reset
                                </Button>
                            </>
                        )}
                        rowKey={(row) => row.name}
                        rows={filteredRows}
                        columns={columns}
                        sort={sort}
                        onSortChange={(nextSort) =>
                            setSort(Array.isArray(nextSort) ? nextSort[0] ?? null : nextSort)
                        }
                        selectable
                        selectedRowKeys={selectedRowKeys}
                        onSelectedRowKeysChange={setSelectedRowKeys}
                        total={rows.length}
                        emptyText='No rows match the filter.'
                        columnSettings={{
                            columns,
                            visibleColumnKeys,
                            onVisibleColumnKeysChange: setVisibleColumnKeys,
                            columnOrder,
                            onColumnOrderChange: setColumnOrder,
                            columnWidths,
                            onColumnWidthsChange: setColumnWidths,
                            onReset: () => {
                                setVisibleColumnKeys(defaultVisibleColumnKeys);
                                setColumnOrder(defaultColumnOrder);
                                setColumnWidths({});
                            },
                        }}
                        rowContextMenuActions={(row) => [
                            {
                                key: 'open',
                                label: `Open ${row.name}`,
                                onSelect: () => undefined,
                            },
                            {
                                key: 'archive',
                                label: 'Archive',
                                tone: 'danger',
                                onSelect: () => undefined,
                            },
                        ]}
                    />
                    <div className='oui-ui-table-variants'>
                        <div className='oui-ui-table-variant'>
                            <Text fs='13px' fw={760}>
                                Plain table
                            </Text>
                            <DataTable
                                rowKey={(row) => row.name}
                                rows={rows.slice(0, 4)}
                                columns={columns}
                                sort={sort}
                                onSortChange={(nextSort) =>
                                    setSort(
                                        Array.isArray(nextSort)
                                            ? nextSort[0] ?? null
                                            : nextSort,
                                    )
                                }
                                total={rows.length}
                                emptyText='No rows.'
                            />
                        </div>
                    </div>
                </div>
            </ExampleTile>
        </UiExampleSection>
    );
}

function sortRows(rows: DemoRow[], sort: DataTableSort | null): DemoRow[] {
    if (!sort) return rows;
    const sign = sort.direction === 'asc' ? 1 : -1;
    return [...rows].sort((left, right) => {
        const leftValue = left[sort.key as keyof DemoRow];
        const rightValue = right[sort.key as keyof DemoRow];
        if (typeof leftValue === 'number' && typeof rightValue === 'number') {
            return (leftValue - rightValue) * sign;
        }
        return String(leftValue).localeCompare(String(rightValue)) * sign;
    });
}

function rowMatches(row: DemoRow, query: string): boolean {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return true;
    return `${row.name} ${row.owner} ${row.status}`.toLowerCase().includes(normalized);
}

function statusTone(status: DemoRow['status']) {
    if (status === 'Done') return 'success';
    if (status === 'Blocked') return 'danger';
    return 'warning';
}
