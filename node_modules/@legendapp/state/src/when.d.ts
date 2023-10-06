import type { Selector } from './observableInterfaces';
export declare function when<T>(predicate: Selector<T>, effect?: (value: T) => any | (() => any)): Promise<T>;
export declare function whenReady<T>(predicate: Selector<T>, effect?: (value: T) => any | (() => any)): Promise<T>;
