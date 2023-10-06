export declare function enableDirectPeek(): void;
declare module '@legendapp/state' {
    interface ObservableBaseFns<T> {
        set _(value: T | null | undefined);
        get _(): T;
    }
}
