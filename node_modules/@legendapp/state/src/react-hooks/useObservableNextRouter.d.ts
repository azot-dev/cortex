import { Observable } from '@legendapp/state';
import { NextRouter } from 'next/router';
type ParsedUrlQuery = {
    [key: string]: string | string[] | undefined;
};
interface TransitionOptions {
    shallow?: boolean;
    locale?: string | false;
    scroll?: boolean;
    unstable_skipClientCache?: boolean;
}
export interface ObservableNextRouterState {
    pathname: string;
    hash: string;
    query: ParsedUrlQuery;
}
type RouteInfo = Partial<ObservableNextRouterState>;
export interface ParamsUseObservableNextRouterBase {
    transitionOptions?: TransitionOptions;
    method?: 'push' | 'replace';
    subscribe?: boolean;
}
export interface ParamsUseObservableNextRouter<T extends object> extends ParamsUseObservableNextRouterBase {
    compute: (value: ObservableNextRouterState) => T;
    set: (value: T, previous: T, router: NextRouter) => RouteInfo & {
        transitionOptions?: TransitionOptions;
        method?: 'push' | 'replace';
    };
}
export declare function useObservableNextRouter(): Observable<ObservableNextRouterState>;
export declare function useObservableNextRouter<T extends object>(params: ParamsUseObservableNextRouter<T>): Observable<T>;
export declare function useObservableNextRouter(params: ParamsUseObservableNextRouterBase): Observable<ObservableNextRouterState>;
export {};
