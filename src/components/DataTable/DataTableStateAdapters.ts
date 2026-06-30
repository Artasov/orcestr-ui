import type {DataTableSort} from './DataTable';

export type DataTablePreferenceScope = {
    tableKey: string;
    tenantId?: string | number | null;
    userId?: string | number | null;
};

export type DataTablePersistedState = {
    visibleColumnKeys?: string[];
    columnOrder?: string[];
    columnWidths?: Record<string, number>;
    sort?: DataTableSort[];
    page?: number;
    pageSize?: number;
    savedViewKey?: string;
};

export type DataTableSavedView = DataTablePersistedState & {
    key: string;
    label: string;
    default?: boolean;
};

export type DataTableStateStorage = Pick<Storage, 'getItem' | 'removeItem' | 'setItem'>;

export function dataTablePreferenceStorageKey(scope: DataTablePreferenceScope): string {
    const tenant = scope.tenantId ?? 'global';
    const user = scope.userId ?? 'anonymous';
    return `orcestr-ui:data-table:${tenant}:${user}:${scope.tableKey}`;
}

export function readDataTableState(
    scope: DataTablePreferenceScope,
    storage: DataTableStateStorage | null = browserStorage(),
): DataTablePersistedState | null {
    if (!storage) return null;
    const raw = storage.getItem(dataTablePreferenceStorageKey(scope));
    if (!raw) return null;
    try {
        return normalizeDataTableState(JSON.parse(raw));
    } catch {
        return null;
    }
}

export function writeDataTableState(
    scope: DataTablePreferenceScope,
    state: DataTablePersistedState,
    storage: DataTableStateStorage | null = browserStorage(),
) {
    if (!storage) return;
    storage.setItem(dataTablePreferenceStorageKey(scope), JSON.stringify(state));
}

export function clearDataTableState(
    scope: DataTablePreferenceScope,
    storage: DataTableStateStorage | null = browserStorage(),
) {
    storage?.removeItem(dataTablePreferenceStorageKey(scope));
}

export function dataTableStateToSearchParams(state: DataTablePersistedState): URLSearchParams {
    const params = new URLSearchParams();
    if (state.visibleColumnKeys?.length) params.set('columns', state.visibleColumnKeys.join(','));
    if (state.columnOrder?.length) params.set('column_order', state.columnOrder.join(','));
    if (state.columnWidths && Object.keys(state.columnWidths).length > 0) {
        params.set('column_widths', serializeColumnWidths(state.columnWidths));
    }
    if (state.sort?.length) {
        params.set(
            'sort',
            state.sort.map((item) => `${encodeURIComponent(item.key)}:${item.direction}`).join(','),
        );
    }
    if (state.page) params.set('page', String(state.page));
    if (state.pageSize) params.set('page_size', String(state.pageSize));
    if (state.savedViewKey) params.set('view', state.savedViewKey);
    return params;
}

export function dataTableStateFromSearchParams(
    params: URLSearchParams,
): DataTablePersistedState {
    return normalizeDataTableState({
        visibleColumnKeys: splitParam(params.get('columns')),
        columnOrder: splitParam(params.get('column_order')),
        columnWidths: parseColumnWidthsParam(params.get('column_widths')),
        sort: parseSortParam(params.get('sort')),
        page: parsePositiveInt(params.get('page')),
        pageSize: parsePositiveInt(params.get('page_size')),
        savedViewKey: params.get('view') || undefined,
    }) ?? {};
}

export function dataTablePaginationToSearchParams({
    page,
    pageSize,
}: {
    page?: number;
    pageSize?: number;
}): URLSearchParams {
    return dataTableStateToSearchParams({page, pageSize});
}

export function dataTablePaginationFromSearchParams(
    params: URLSearchParams,
): Pick<DataTablePersistedState, 'page' | 'pageSize'> {
    const state = dataTableStateFromSearchParams(params);
    return {
        page: state.page,
        pageSize: state.pageSize,
    };
}

export function resolveDataTableState({
    defaultState,
    persistedState,
    urlState,
}: {
    defaultState?: DataTablePersistedState | null;
    persistedState?: DataTablePersistedState | null;
    urlState?: DataTablePersistedState | null;
}): DataTablePersistedState {
    return {
        ...defaultState,
        ...persistedState,
        ...urlState,
    };
}

export function defaultDataTableSavedView(
    views: ReadonlyArray<DataTableSavedView>,
): DataTableSavedView | null {
    return views.find((view) => view.default) ?? null;
}

export function applyDataTableSavedView(
    state: DataTablePersistedState,
    view: DataTableSavedView,
): DataTablePersistedState {
    return compactDataTableState({
        ...state,
        visibleColumnKeys: view.visibleColumnKeys,
        columnOrder: view.columnOrder,
        columnWidths: view.columnWidths,
        sort: view.sort,
        page: view.page,
        pageSize: view.pageSize,
        savedViewKey: view.key,
    });
}

export function resetDataTableStateToDefault(
    defaultState: DataTablePersistedState = {},
): DataTablePersistedState {
    return {...defaultState};
}

function browserStorage(): DataTableStateStorage | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage;
}

function normalizeDataTableState(value: unknown): DataTablePersistedState | null {
    if (!isRecord(value)) return null;
    return compactDataTableState({
        visibleColumnKeys: stringArray(value.visibleColumnKeys),
        columnOrder: stringArray(value.columnOrder),
        columnWidths: columnWidthsRecord(value.columnWidths),
        sort: sortArray(value.sort),
        page: typeof value.page === 'number' && value.page > 0 ? value.page : undefined,
        pageSize: typeof value.pageSize === 'number' && value.pageSize > 0 ? value.pageSize : undefined,
        savedViewKey: typeof value.savedViewKey === 'string' ? value.savedViewKey : undefined,
    });
}

function compactDataTableState(state: DataTablePersistedState): DataTablePersistedState {
    return Object.fromEntries(
        Object.entries(state).filter(([, value]) => value !== undefined),
    ) as DataTablePersistedState;
}

function stringArray(value: unknown): string[] | undefined {
    if (!Array.isArray(value)) return undefined;
    const result = value.filter((item): item is string => typeof item === 'string' && item.length > 0);
    return result.length ? result : undefined;
}

function sortArray(value: unknown): DataTableSort[] | undefined {
    if (!Array.isArray(value)) return undefined;
    const result = value.filter(isSort);
    return result.length ? result : undefined;
}

function columnWidthsRecord(value: unknown): Record<string, number> | undefined {
    if (!isRecord(value)) return undefined;
    const result: Record<string, number> = {};
    for (const [key, width] of Object.entries(value)) {
        if (!key || typeof width !== 'number' || !Number.isFinite(width) || width <= 0) continue;
        result[key] = Math.round(width);
    }
    return Object.keys(result).length ? result : undefined;
}

function serializeColumnWidths(widths: Record<string, number>): string {
    return Object.entries(widths)
        .filter(([, width]) => Number.isFinite(width) && width > 0)
        .map(([key, width]) => `${encodeURIComponent(key)}:${Math.round(width)}`)
        .join(',');
}

function parseColumnWidthsParam(value: string | null): Record<string, number> | undefined {
    if (!value) return undefined;
    const result: Record<string, number> = {};
    for (const item of value.split(',')) {
        const [encodedKey, rawWidth] = item.split(':');
        const key = decodeURIComponent(encodedKey ?? '');
        const width = Number.parseInt(rawWidth ?? '', 10);
        if (!key || !Number.isFinite(width) || width <= 0) continue;
        result[key] = width;
    }
    return Object.keys(result).length ? result : undefined;
}

function parseSortParam(value: string | null): DataTableSort[] | undefined {
    if (!value) return undefined;
    const result = value
        .split(',')
        .map((item) => {
            const [key, direction] = item.split(':');
            return {
                key: decodeURIComponent(key ?? ''),
                direction,
            };
        })
        .filter(isSort);
    return result.length ? result : undefined;
}

function splitParam(value: string | null): string[] | undefined {
    if (!value) return undefined;
    const result = value.split(',').filter(Boolean);
    return result.length ? result : undefined;
}

function parsePositiveInt(value: string | null): number | undefined {
    if (!value) return undefined;
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function isSort(value: unknown): value is DataTableSort {
    if (!isRecord(value)) return false;
    return (
        typeof value.key === 'string' &&
        (value.direction === 'asc' || value.direction === 'desc')
    );
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
