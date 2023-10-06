import { ObservableProxy, ObservableProxyLink, ObservableProxyTwoWay, Observable as ObservableWriteable } from './observableInterfaces';
export declare function proxy<T, T2 = T>(get: (key: string) => T, set: (key: string, value: T2) => void): ObservableProxyTwoWay<Record<string, T>, T2>;
export declare function proxy<T extends Record<string, any>>(get: <K extends keyof T>(key: K) => ObservableWriteable<T[K]>): ObservableProxyLink<T>;
export declare function proxy<T>(get: (key: string) => ObservableWriteable<T>): ObservableProxyLink<Record<string, T>>;
export declare function proxy<T>(get: (key: string) => T): ObservableProxy<Record<string, T>>;
