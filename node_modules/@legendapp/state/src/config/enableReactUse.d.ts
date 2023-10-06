import { UseSelectorOptions } from '@legendapp/state/react';
export declare function enableReactUse(): void;
declare module '@legendapp/state' {
    interface ObservableBaseFns<T> {
        use(options?: UseSelectorOptions): T;
    }
}
