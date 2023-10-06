import type { NodeValue } from './observableInterfaces';
export declare function configureLegendState({ observableFunctions, observableProperties, }: {
    observableFunctions?: Record<string, (node: NodeValue, ...args: any[]) => any>;
    observableProperties?: Record<string, {
        get: (node: NodeValue) => any;
        set: (node: NodeValue, value: any) => any;
    }>;
}): void;
