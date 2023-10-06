'use strict';

var state = require('@legendapp/state');
var react = require('@legendapp/state/react');

function enableReactUse() {
    state.configureLegendState({
        observableFunctions: {
            use: (node, options) => react.useSelector(state.internal.getProxy(node), options),
        },
    });
}

exports.enableReactUse = enableReactUse;
//# sourceMappingURL=enableReactUse.js.map
