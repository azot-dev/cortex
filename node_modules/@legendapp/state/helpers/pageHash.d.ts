import { Observable } from '@legendapp/state';
interface Options {
    setter: 'pushState' | 'replaceState' | 'hash';
}
declare function configurePageHash(options: Options): void;
declare const pageHash: Observable<string>;
export { configurePageHash, pageHash };
