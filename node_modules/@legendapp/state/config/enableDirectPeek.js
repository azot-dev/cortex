'use strict';

var state = require('@legendapp/state');

function enableDirectPeek() {
    state.configureLegendState({
        observableProperties: {
            _: {
                get(node) {
                    return state.internal.peek(node);
                },
                set(node, value) {
                    state.internal.setNodeValue(node, value);
                },
            },
        },
    });
}

exports.enableDirectPeek = enableDirectPeek;
//# sourceMappingURL=enableDirectPeek.js.map
