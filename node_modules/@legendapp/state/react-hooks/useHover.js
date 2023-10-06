'use strict';

var react = require('@legendapp/state/react');
var react$1 = require('react');

function useHover(ref) {
    const obs = react.useObservable(false);
    react$1.useEffect(() => {
        const handleMouseOver = () => obs.set(true);
        const handleMouseOut = (e) => {
            if (obs.peek() === true) {
                let parent = e.toElement;
                let foundRef = false;
                while (parent && !foundRef) {
                    if (parent === ref.current) {
                        foundRef = true;
                    }
                    parent = parent.parentElement;
                }
                if (!foundRef) {
                    obs.set(false);
                }
            }
        };
        const node = ref.current;
        if (node) {
            node.addEventListener('mouseover', handleMouseOver);
            node.addEventListener('mouseout', handleMouseOut);
            return () => {
                node.removeEventListener('mouseover', handleMouseOver);
                node.removeEventListener('mouseout', handleMouseOut);
            };
        }
    }, [ref.current]);
    return obs;
}

exports.useHover = useHover;
//# sourceMappingURL=useHover.js.map
