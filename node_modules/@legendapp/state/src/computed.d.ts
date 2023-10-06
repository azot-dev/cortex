import { ObservableComputed, ObservableComputedTwoWay, ObservableReadable } from './observableInterfaces';
export declare function computed<T extends ObservableReadable>(compute: () => T | Promise<T>): T;
export declare function computed<T>(compute: () => T | Promise<T>): ObservableComputed<T>;
export declare function computed<T, T2 = T>(compute: (() => T | Promise<T>) | ObservableReadable<T>, set: (value: T2) => void): ObservableComputedTwoWay<T, T2>;
