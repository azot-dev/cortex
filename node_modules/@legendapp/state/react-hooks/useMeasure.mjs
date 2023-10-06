import { useObservable } from '@legendapp/state/react';
import { useLayoutEffect } from 'react';

function getSize(el) {
    return el
        ? {
            width: el.offsetWidth,
            height: el.offsetHeight,
        }
        : undefined;
}
function useMeasure(ref) {
    const obs = useObservable({
        width: undefined,
        height: undefined,
    });
    useLayoutEffect(() => {
        const el = ref.current;
        if (el) {
            const handleResize = () => {
                if (ref.current) {
                    const oldSize = obs.peek();
                    const newSize = getSize(ref.current);
                    if (newSize && (newSize.width !== oldSize.width || newSize.height !== oldSize.height)) {
                        obs.set(newSize);
                    }
                }
            };
            handleResize();
            let resizeObserver = new ResizeObserver(handleResize);
            resizeObserver.observe(el);
            return () => {
                resizeObserver.disconnect();
                resizeObserver = undefined;
            };
        }
    }, [ref.current]);
    return obs;
}

export { useMeasure };
//# sourceMappingURL=useMeasure.mjs.map
