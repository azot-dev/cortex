import { observable } from '@legendapp/state';

function observableFetch(input, init, valueType) {
    const obs = observable({
        data: undefined,
        error: undefined,
        errorStr: undefined,
        loading: true,
    });
    fetch(input, init)
        .then((response) => response[valueType || 'json']())
        .then((value) => obs.set({ data: value, loading: false }))
        .catch((error) => { var _a; return obs.set({ loading: false, error, errorStr: (_a = error === null || error === void 0 ? void 0 : error.toString) === null || _a === void 0 ? void 0 : _a.call(error) }); });
    return obs;
}

export { observableFetch };
//# sourceMappingURL=fetch.mjs.map
