'use strict';

var fetch = require('@legendapp/state/helpers/fetch');
var react = require('react');

function useFetch(input, init, valueType) {
    return react.useMemo(() => fetch.observableFetch(input, init, valueType), []);
}

exports.useFetch = useFetch;
//# sourceMappingURL=useFetch.js.map
