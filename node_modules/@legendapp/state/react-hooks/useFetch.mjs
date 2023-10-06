import { observableFetch } from '@legendapp/state/helpers/fetch';
import { useMemo } from 'react';

function useFetch(input, init, valueType) {
    return useMemo(() => observableFetch(input, init, valueType), []);
}

export { useFetch };
//# sourceMappingURL=useFetch.mjs.map
