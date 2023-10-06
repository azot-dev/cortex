import { Observable } from '@legendapp/state';
export declare function createObservableHook<TArgs extends any[], TRet>(fn: (...args: TArgs) => TRet): (...args: TArgs) => Observable<TRet>;
