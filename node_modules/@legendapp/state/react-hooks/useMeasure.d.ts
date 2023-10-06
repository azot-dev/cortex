import type { ObservableObject } from '@legendapp/state';
import { RefObject } from 'react';
export declare function useMeasure(ref: RefObject<HTMLElement>): ObservableObject<{
    width: number | undefined;
    height: number | undefined;
}>;
