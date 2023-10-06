import { configureReactive } from '@legendapp/state/react';

function enableReactComponents() {
    const bindInfo = { value: { handler: 'onChange', getValue: (e) => e.target.value, defaultValue: '' } };
    const bindInfoInput = Object.assign({ checked: { handler: 'onChange', getValue: (e) => e.target.checked } }, bindInfo);
    configureReactive({
        binders: {
            input: bindInfoInput,
            textarea: bindInfo,
            select: bindInfo,
        },
    });
}

export { enableReactComponents };
//# sourceMappingURL=enableReactComponents.mjs.map
