/// <reference types="react" />
import type { Observable } from '@legendapp/state';
export declare function useHover<T extends HTMLElement>(ref: React.MutableRefObject<T>): Observable<boolean>;
