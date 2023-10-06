import { configureLegendState, internal } from '@legendapp/state';
import { useSelector } from '@legendapp/state/react';

function enableReactUse() {
    configureLegendState({
        observableFunctions: {
            use: (node, options) => useSelector(internal.getProxy(node), options),
        },
    });
}

export { enableReactUse };
//# sourceMappingURL=enableReactUse.mjs.map
