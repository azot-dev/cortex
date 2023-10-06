'use strict';

var types = require('@babel/types');

function babel () {
    let imported;
    return {
        visitor: {
            Program() {
                imported = {};
            },
            ImportDeclaration: {
                enter(path) {
                    if (path.node.source.value === '@legendapp/state/react') {
                        const specifiers = path.node.specifiers;
                        for (let i = 0; i < specifiers.length; i++) {
                            const s = specifiers[i].imported.name;
                            if (!imported[s] && (s === 'Computed' || s === 'Memo')) {
                                imported[s] = specifiers[i].local.name;
                            }
                        }
                    }
                },
            },
            JSXElement: {
                enter(path) {
                    const openingElement = path.node.openingElement;
                    const children_ = path.node.children;
                    const name = openingElement.name.name;
                    if (name === 'Computed' || name === 'Memo' || name === 'Show') {
                        const children = removEmptyText(children_);
                        const attrs = openingElement.attributes;
                        if (children.length > 0 && children[0].type === 'JSXElement') {
                            path.replaceWith(types.jsxElement(types.jsxOpeningElement(types.jsxIdentifier(name), attrs), types.jsxClosingElement(types.jsxIdentifier(name)), [
                                types.jsxExpressionContainer(types.arrowFunctionExpression([], types.jsxFragment(types.jsxOpeningFragment(), types.jsxClosingFragment(), children))),
                            ]));
                        }
                    }
                },
            },
        },
    };
}
function removEmptyText(nodes) {
    return nodes.filter((node) => !(node.type === 'JSXText' && node.value.trim().length === 0));
}

module.exports = babel;
//# sourceMappingURL=babel.js.map
