import { type ObservableObject } from '@legendapp/state';
import { QueryClient, QueryKey } from '@tanstack/query-core';
import { UseBaseQueryOptions, UseMutationOptions, type UseBaseQueryResult } from '@tanstack/react-query';
export declare function useObservableQuery<TQueryFnData, TError, TData = TQueryFnData, TQueryData = TQueryFnData, TQueryKey extends QueryKey = QueryKey, TContext = unknown>(options: UseBaseQueryOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey> & {
    queryClient?: QueryClient;
}, mutationOptions?: UseMutationOptions<TData, TError, void, TContext>): ObservableObject<UseBaseQueryResult<TData, TError>>;
