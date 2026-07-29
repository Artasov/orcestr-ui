'use client';

import { useCallback, useRef } from 'react';
import { type QueryKey, type UseQueryOptions, useQueryClient } from '@tanstack/react-query';

import {
    PaginatedCombobox as CorePaginatedCombobox,
    type PaginatedComboboxProps as CorePaginatedComboboxProps,
    type PaginatedResult,
} from './PaginatedCombobox.js';

export type PaginatedComboboxQueryParams = {
    page: number;
    search: string;
    pageSize?: number;
};

export type PaginatedComboboxQueryFnParams = PaginatedComboboxQueryParams & {
    signal: AbortSignal;
};

export type PaginatedComboboxQueryLoaderOptions<TItem, TQueryKey extends QueryKey = QueryKey> = {
    queryKey: TQueryKey | ((params: PaginatedComboboxQueryParams) => TQueryKey);
    queryFn: (params: PaginatedComboboxQueryFnParams) => Promise<PaginatedResult<TItem>>;
    staleTime?: UseQueryOptions<
        PaginatedResult<TItem>,
        Error,
        PaginatedResult<TItem>,
        TQueryKey
    >['staleTime'];
};

export function usePaginatedComboboxQueryLoader<TItem, TQueryKey extends QueryKey = QueryKey>({
    queryKey,
    queryFn,
    staleTime,
}: PaginatedComboboxQueryLoaderOptions<TItem, TQueryKey>) {
    const queryClient = useQueryClient();
    const optionsRef = useRef({ queryKey, queryFn, staleTime });
    optionsRef.current = { queryKey, queryFn, staleTime };

    return useCallback(
        (page: number, search: string, options: { signal: AbortSignal; pageSize?: number }) => {
            const current = optionsRef.current;
            const params = { page, search, pageSize: options.pageSize };
            const resolvedQueryKey =
                typeof current.queryKey === 'function'
                    ? current.queryKey(params)
                    : current.queryKey;

            return queryClient.fetchQuery({
                queryKey: resolvedQueryKey,
                queryFn: ({ signal }) => current.queryFn({ ...params, signal }),
                staleTime: current.staleTime,
            });
        },
        [queryClient],
    );
}

export type ReactQueryPaginatedComboboxProps<T> = Omit<
    CorePaginatedComboboxProps<T>,
    'loadPage'
> & {
    queryKey: QueryKey;
    loadPage: (
        page: number,
        search: string,
        options: { signal: AbortSignal; pageSize?: number },
    ) => Promise<PaginatedResult<T>>;
    pageSize?: number;
    staleTime?: number;
};

export function ReactQueryPaginatedCombobox<T>({
    queryKey,
    loadPage,
    pageSize,
    staleTime = 30_000,
    resetKey,
    ...props
}: ReactQueryPaginatedComboboxProps<T>) {
    const cachedLoadPage = usePaginatedComboboxQueryLoader<T>({
        queryKey: ({ page, search, pageSize: requestedPageSize }) => [
            ...queryKey,
            'paginated-combobox',
            search,
            page,
            requestedPageSize ?? null,
            resetKey ?? null,
        ],
        queryFn: ({ page, search, signal, pageSize: requestedPageSize }) =>
            loadPage(page, search, { signal, pageSize: requestedPageSize }),
        staleTime,
    });

    return (
        <CorePaginatedCombobox<T>
            {...props}
            loadPage={cachedLoadPage}
            pageSize={pageSize}
            resetKey={resetKey}
        />
    );
}

export { ReactQueryPaginatedCombobox as PaginatedCombobox };
export type {
    PaginatedComboboxOptionAction,
    PaginatedComboboxSearchAction,
} from './PaginatedCombobox.js';
