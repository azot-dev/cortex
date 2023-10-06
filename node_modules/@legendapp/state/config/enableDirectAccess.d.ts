export declare function enableDirectAccess(): void;
declare module '@legendapp/state' {
    interface ObservableBaseFns<T> {
        set $(value: T | null | undefined);
        get $(): T;
    }
}
