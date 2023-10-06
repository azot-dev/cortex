export default function (): {
    visitor: {
        Program(): void;
        ImportDeclaration: {
            enter(path: {
                node: any;
                replaceWith: (param: any) => any;
            }): void;
        };
        JSXElement: {
            enter(path: {
                node: any;
                replaceWith: (param: any) => any;
            }): void;
        };
    };
};
