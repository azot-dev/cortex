import { observable } from '@legendapp/state';

let _options = { setter: 'hash' };
function configurePageHashParams(options) {
    _options = options;
}
function toParams(str) {
    const ret = {};
    const searchParams = new URLSearchParams(str);
    for (const [key, value] of searchParams) {
        ret[key] = value;
    }
    return ret;
}
function toString(params) {
    return new URLSearchParams(params).toString().replace(/=$/, '');
}
const hasWindow = typeof window !== 'undefined';
const pageHashParams = observable(hasWindow ? toParams(window.location.hash.slice(1)) : {});
if (hasWindow) {
    let isSetting = false;
    // Set the page hash when the observable changes
    pageHashParams.onChange(({ value }) => {
        if (!isSetting) {
            const hash = '#' + toString(value);
            const setter = (_options === null || _options === void 0 ? void 0 : _options.setter) || 'hash';
            if (setter === 'pushState') {
                history.pushState(null, null, hash);
            }
            else if (setter === 'replaceState') {
                history.replaceState(null, null, hash);
            }
            else {
                location.hash = hash;
            }
        }
    });
    // Update the observable whenever the hash changes
    const cb = () => {
        isSetting = true;
        pageHashParams.set(toParams(window.location.hash.slice(1)));
        isSetting = false;
    };
    // Subscribe to window hashChange event
    window.addEventListener('hashchange', cb);
}

export { configurePageHashParams, pageHashParams };
//# sourceMappingURL=pageHashParams.mjs.map
