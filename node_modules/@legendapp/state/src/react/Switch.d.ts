import type { Selector } from '@legendapp/state';
import { ReactElement, ReactNode } from 'react';
export declare function Switch<T extends object>({ value, children, }: {
    value?: Selector<T>;
    children: Partial<Record<keyof T | 'null' | 'undefined' | 'default', () => ReactNode>>;
}): ReactElement;
export declare function Switch<T extends string | number | symbol>({ value, children, }: {
    value?: Selector<T>;
    children: Partial<Record<T | 'null' | 'undefined' | 'default', () => ReactNode>>;
}): ReactElement;
export declare function Switch<T extends boolean>({ value, children, }: {
    value?: Selector<T>;
    children: Partial<Record<'false' | 'true' | 'null' | 'undefined' | 'default', () => ReactNode>>;
}): ReactElement;
