import { Observable } from '@legendapp/state';
interface Options {
    setter: 'pushState' | 'replaceState' | 'hash';
}
declare function configurePageHashParams(options: Options): void;
declare const pageHashParams: Observable<Record<string, string>>;
export { configurePageHashParams, pageHashParams };
