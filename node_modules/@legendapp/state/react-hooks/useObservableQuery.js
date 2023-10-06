'use strict';

var state = require('@legendapp/state');
var queryCore = require('@tanstack/query-core');
var reactQuery = require('@tanstack/react-query');
var React = require('react');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespaceDefault(React);

// This is basically just React Query's useBaseQuery with a few changes for Legend-State:
const ensurePreventErrorBoundaryRetry = (options, errorResetBoundary) => {
    if (options.suspense || options.useErrorBoundary) {
        // Prevent retrying failed query if the error boundary has not been reset yet
        if (!errorResetBoundary.isReset()) {
            options.retryOnMount = false;
        }
    }
};
const useClearResetErrorBoundary = (errorResetBoundary) => {
    React__namespace.useEffect(() => {
        errorResetBoundary.clearReset();
    }, [errorResetBoundary]);
};
function shouldThrowError(_useErrorBoundary, params) {
    // Allow useErrorBoundary function to override throwing behavior on a per-error basis
    if (typeof _useErrorBoundary === 'function') {
        return _useErrorBoundary(...params);
    }
    return !!_useErrorBoundary;
}
const getHasError = ({ result, errorResetBoundary, useErrorBoundary, query, }) => {
    return (result.isError &&
        !errorResetBoundary.isReset() &&
        !result.isFetching &&
        shouldThrowError(useErrorBoundary, [result.error, query]));
};
function useObservableQuery(options, mutationOptions) {
    const Observer = queryCore.QueryObserver;
    const queryClient = (options === null || options === void 0 ? void 0 : options.queryClient) || reactQuery.useQueryClient({ context: options.context });
    const isRestoring = reactQuery.useIsRestoring();
    const errorResetBoundary = reactQuery.useQueryErrorResetBoundary();
    const defaultedOptions = queryClient.defaultQueryOptions(options);
    // Make sure results are optimistically set in fetching state before subscribing or updating options
    defaultedOptions._optimisticResults = isRestoring ? 'isRestoring' : 'optimistic';
    // Include callbacks in batch renders
    if (defaultedOptions.onError) {
        defaultedOptions.onError = queryCore.notifyManager.batchCalls(defaultedOptions.onError);
    }
    if (defaultedOptions.onSuccess) {
        defaultedOptions.onSuccess = queryCore.notifyManager.batchCalls(defaultedOptions.onSuccess);
    }
    if (defaultedOptions.onSettled) {
        defaultedOptions.onSettled = queryCore.notifyManager.batchCalls(defaultedOptions.onSettled);
    }
    if (defaultedOptions.suspense) {
        // Always set stale time when using suspense to prevent
        // fetching again when directly mounting after suspending
        if (typeof defaultedOptions.staleTime !== 'number') {
            defaultedOptions.staleTime = 1000;
        }
    }
    ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary);
    useClearResetErrorBoundary(errorResetBoundary);
    const [observer] = React__namespace.useState(() => new Observer(queryClient, defaultedOptions));
    const result = observer.getOptimisticResult(defaultedOptions);
    // useSyncExternalStore was here in useBaseQuery but is removed for Legend-State.
    React__namespace.useEffect(() => {
        // Do not notify on updates because of changes in the options because
        // these changes should already be reflected in the optimistic result.
        observer.setOptions(defaultedOptions, { listeners: false });
    }, [defaultedOptions, observer]);
    // Handle suspense
    if (defaultedOptions.suspense && result.isLoading && result.isFetching && !isRestoring) {
        throw observer
            .fetchOptimistic(defaultedOptions)
            .then(({ data }) => {
            var _a, _b;
            (_a = defaultedOptions.onSuccess) === null || _a === void 0 ? void 0 : _a.call(defaultedOptions, data);
            (_b = defaultedOptions.onSettled) === null || _b === void 0 ? void 0 : _b.call(defaultedOptions, data, null);
        })
            .catch((error) => {
            var _a, _b;
            errorResetBoundary.clearReset();
            (_a = defaultedOptions.onError) === null || _a === void 0 ? void 0 : _a.call(defaultedOptions, error);
            (_b = defaultedOptions.onSettled) === null || _b === void 0 ? void 0 : _b.call(defaultedOptions, undefined, error);
        });
    }
    // Handle error boundary
    if (getHasError({
        result,
        errorResetBoundary,
        useErrorBoundary: defaultedOptions.useErrorBoundary,
        query: observer.getCurrentQuery(),
    })) {
        throw result.error;
    }
    // Legend-State changes from here down
    let mutator;
    if (mutationOptions) {
        [mutator] = React__namespace.useState(() => new queryCore.MutationObserver(queryClient, mutationOptions));
    }
    const [obs] = React__namespace.useState(() => {
        const obs = state.observable(observer.getCurrentResult());
        let isSetting = false;
        // If there is a mutator watch for changes as long as they don't come from the the query observer
        if (mutationOptions) {
            state.observe(() => {
                const data = obs.data.get();
                // Don't want to call mutate if there's no data or this coming from the query changing
                if (data && !isSetting) {
                    mutator.mutate(data);
                }
            });
        }
        // Note: Don't need to worry about unsubscribing because the query observer itself
        // is scoped to this component
        observer.subscribe((result) => {
            isSetting = true;
            try {
                // Update the observable with the latest value
                obs.set(result);
            }
            finally {
                // If set causes a crash for some reason we still need to reset isSetting
                isSetting = false;
            }
        });
        return obs;
    });
    // Return the observable
    return obs;
}

exports.useObservableQuery = useObservableQuery;
//# sourceMappingURL=useObservableQuery.js.map
