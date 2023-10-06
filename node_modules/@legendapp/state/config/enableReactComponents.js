'use strict';

var react = require('@legendapp/state/react');

function enableReactComponents() {
    const bindInfo = { value: { handler: 'onChange', getValue: (e) => e.target.value, defaultValue: '' } };
    const bindInfoInput = Object.assign({ checked: { handler: 'onChange', getValue: (e) => e.target.checked } }, bindInfo);
    react.configureReactive({
        binders: {
            input: bindInfoInput,
            textarea: bindInfo,
            select: bindInfo,
        },
    });
}

exports.enableReactComponents = enableReactComponents;
//# sourceMappingURL=enableReactComponents.js.map
