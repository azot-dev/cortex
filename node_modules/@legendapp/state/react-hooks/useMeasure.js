'use strict';

var react = require('@legendapp/state/react');
var react$1 = require('react');

function getSize(el) {
    return el
        ? {
            width: el.offsetWidth,
            height: el.offsetHeight,
        }
        : undefined;
}
function useMeasure(ref) {
    const obs = react.useObservable({
        width: undefined,
        height: undefined,
    });
    react$1.useLayoutEffect(() => {
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

exports.useMeasure = useMeasure;
//# sourceMappingURL=useMeasure.js.map
