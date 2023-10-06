import { useObservable } from '@legendapp/state/react';
import { useEffect } from 'react';

function useHover(ref) {
    const obs = useObservable(false);
    useEffect(() => {
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

export { useHover };
//# sourceMappingURL=useHover.mjs.map
