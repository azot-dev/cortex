import { ObserveEvent, ObserveEventCallback, Selector } from '@legendapp/state';
import type { ObserveOptions } from '../observe';
export declare function useObserve<T>(run: (e: ObserveEvent<T>) => T | void, options?: ObserveOptions): () => void;
export declare function useObserve<T>(selector: Selector<T>, reaction?: (e: ObserveEventCallback<T>) => any, options?: ObserveOptions): () => void;
