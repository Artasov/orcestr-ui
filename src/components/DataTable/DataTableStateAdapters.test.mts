import assert from 'node:assert/strict';
import test from 'node:test';

import {
    applyDataTableSavedView,
    clearDataTableState,
    dataTablePaginationFromSearchParams,
    dataTablePaginationToSearchParams,
    dataTablePreferenceStorageKey,
    dataTableStateFromSearchParams,
    dataTableStateToSearchParams,
    defaultDataTableSavedView,
    readDataTableState,
    resetDataTableStateToDefault,
    resolveDataTableState,
    writeDataTableState,
    type DataTableStateStorage,
} from './DataTableStateAdapters.ts';

test('data table state roundtrips through URL params', () => {
    const params = dataTableStateToSearchParams({
        visibleColumnKeys: ['name', 'status'],
        columnOrder: ['status', 'name'],
        columnWidths: {'created at': 180, name: 220},
        sort: [
            {key: 'created at', direction: 'desc'},
            {key: 'name', direction: 'asc'},
        ],
        page: 3,
        pageSize: 50,
        savedViewKey: 'ops',
    });

    assert.deepEqual(dataTableStateFromSearchParams(params), {
        visibleColumnKeys: ['name', 'status'],
        columnOrder: ['status', 'name'],
        columnWidths: {'created at': 180, name: 220},
        sort: [
            {key: 'created at', direction: 'desc'},
            {key: 'name', direction: 'asc'},
        ],
        page: 3,
        pageSize: 50,
        savedViewKey: 'ops',
    });
});

test('data table pagination adapter ignores invalid values', () => {
    const params = dataTablePaginationToSearchParams({page: 2, pageSize: 100});
    assert.deepEqual(dataTablePaginationFromSearchParams(params), {
        page: 2,
        pageSize: 100,
    });

    assert.deepEqual(
        dataTablePaginationFromSearchParams(new URLSearchParams('page=0&page_size=-1')),
        {
            page: undefined,
            pageSize: undefined,
        },
    );
});

test('data table persisted state uses scoped storage and normalizes values', () => {
    const storage = memoryStorage();
    const scope = {tableKey: 'queue', tenantId: 10, userId: 20};
    assert.equal(
        dataTablePreferenceStorageKey(scope),
        'orcestr-ui:data-table:10:20:queue',
    );

    writeDataTableState(scope, {
        visibleColumnKeys: ['name'],
        columnWidths: {name: 180},
        sort: [{key: 'name', direction: 'asc'}],
        pageSize: 25,
    }, storage);

    assert.deepEqual(readDataTableState(scope, storage), {
        visibleColumnKeys: ['name'],
        columnWidths: {name: 180},
        sort: [{key: 'name', direction: 'asc'}],
        pageSize: 25,
    });

    storage.setItem(dataTablePreferenceStorageKey(scope), '{bad json');
    assert.equal(readDataTableState(scope, storage), null);

    clearDataTableState(scope, storage);
    assert.equal(readDataTableState(scope, storage), null);
});

test('data table saved views and state precedence are deterministic', () => {
    const defaultState = {visibleColumnKeys: ['name'], pageSize: 25};
    const persistedState = {pageSize: 50};
    const urlState = {page: 2, sort: [{key: 'status', direction: 'desc' as const}]};
    assert.deepEqual(resolveDataTableState({defaultState, persistedState, urlState}), {
        visibleColumnKeys: ['name'],
        pageSize: 50,
        page: 2,
        sort: [{key: 'status', direction: 'desc'}],
    });

    const savedView = {
        key: 'default',
        label: 'Default',
        default: true,
        visibleColumnKeys: ['status'],
        columnOrder: ['status', 'name'],
        columnWidths: {status: 160},
        pageSize: 100,
    };
    assert.equal(defaultDataTableSavedView([savedView])?.key, 'default');
    assert.deepEqual(applyDataTableSavedView({page: 3}, savedView), {
        visibleColumnKeys: ['status'],
        columnOrder: ['status', 'name'],
        columnWidths: {status: 160},
        pageSize: 100,
        savedViewKey: 'default',
    });
    assert.deepEqual(resetDataTableStateToDefault(defaultState), defaultState);
});

function memoryStorage(): DataTableStateStorage {
    const map = new Map<string, string>();
    return {
        getItem: (key) => map.get(key) ?? null,
        removeItem: (key) => {
            map.delete(key);
        },
        setItem: (key, value) => {
            map.set(key, value);
        },
    };
}
