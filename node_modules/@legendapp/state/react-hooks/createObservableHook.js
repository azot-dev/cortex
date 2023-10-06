'use strict';

var state = require('@legendapp/state');
var React = require('react');

function overrideHooks(refObs) {
    // @ts-expect-error Types don't match React's expected types
    React.useState = function useState(initialState) {
        var _a;
        const obs = (_a = refObs.current) !== null && _a !== void 0 ? _a : (refObs.current = state.observable(state.isFunction(initialState) ? initialState() : initialState));
        return [obs.get(), obs.set];
    };
    // @ts-expect-error Types don't match React's expected types
    React.useReducer = function useReducer(reducer, initializerArg, initializer) {
        var _a;
        const obs = (_a = refObs.current) !== null && _a !== void 0 ? _a : (refObs.current = state.observable(initializerArg !== undefined && state.isFunction(initializerArg)
            ? initializer(initializerArg)
            : initializerArg));
        const dispatch = (action) => {
            obs.set(reducer(obs.get(), action));
        };
        return [obs, dispatch];
    };
}
function createObservableHook(fn) {
    const _useState = React.useState;
    const _useReducer = React.useReducer;
    return function (...args) {
        const refObs = React.useRef();
        // First override the built-in hooks to create/update observables
        overrideHooks(refObs);
        // Then call the original hook
        fn(...args);
        // And reset back to the built-in hooks
        React.useState = _useState;
        React.useReducer = _useReducer;
        return refObs.current;
    };
}

exports.createObservableHook = createObservableHook;
//# sourceMappingURL=createObservableHook.js.map
