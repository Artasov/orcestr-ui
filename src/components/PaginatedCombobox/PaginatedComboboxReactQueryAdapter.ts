import {
    useCallback,
} from 'react';
import {
    type QueryKey,
    type UseQueryOptions,
    useQueryClient,
} from '@tanstack/react-query';

import type {PaginatedResult} from './PaginatedCombobox';

export type PaginatedComboboxQueryParams = {
    page: number;
    search: string;
};

export type PaginatedComboboxQueryLoaderOptions<TItem, TQueryKey extends QueryKey = QueryKey> = {
    queryKey: (params: PaginatedComboboxQueryParams) => TQueryKey;
    queryFn: (params: PaginatedComboboxQueryParams) => Promise<PaginatedResult<TItem>>;
    staleTime?: UseQueryOptions<PaginatedResult<TItem>, Error, PaginatedResult<TItem>, TQueryKey>['staleTime'];
};

export function usePaginatedComboboxQueryLoader<
    TItem,
    TQueryKey extends QueryKey = QueryKey,
>({
    queryKey,
    queryFn,
    staleTime,
}: PaginatedComboboxQueryLoaderOptions<TItem, TQueryKey>) {
    const queryClient = useQueryClient();

    return useCallback(
        (page: number, search: string) =>
            queryClient.fetchQuery({
                queryKey: queryKey({page, search}),
                queryFn: () => queryFn({page, search}),
                staleTime,
            }),
        [queryClient, queryFn, queryKey, staleTime],
    );
}
