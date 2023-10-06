import { configureLegendState, internal } from '@legendapp/state';

function enableDirectPeek() {
    configureLegendState({
        observableProperties: {
            _: {
                get(node) {
                    return internal.peek(node);
                },
                set(node, value) {
                    internal.setNodeValue(node, value);
                },
            },
        },
    });
}

export { enableDirectPeek };
//# sourceMappingURL=enableDirectPeek.mjs.map
