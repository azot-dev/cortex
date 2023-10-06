import { ObservableComputed, ObservableComputedTwoWay, ObservableReadable } from '@legendapp/state';
export declare function useComputed<T>(compute: () => T | Promise<T>): ObservableComputed<T>;
export declare function useComputed<T>(compute: () => T | Promise<T>, deps: any[]): ObservableComputed<T>;
export declare function useComputed<T, T2 = T>(compute: (() => T | Promise<T>) | ObservableReadable<T>, set: (value: T2) => void): ObservableComputedTwoWay<T, T2>;
export declare function useComputed<T, T2 = T>(compute: (() => T | Promise<T>) | ObservableReadable<T>, set: (value: T2) => void, deps: any[]): ObservableComputedTwoWay<T, T2>;
