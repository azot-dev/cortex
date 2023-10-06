import type { Selector } from '@legendapp/state';
import { FC, ReactElement, ReactNode } from 'react';
interface PropsIf<T> {
    if: Selector<T>;
    ifReady?: never;
}
interface PropsIfReady<T> {
    if?: never;
    ifReady: Selector<T>;
}
interface PropsBase<T> {
    else?: ReactNode | (() => ReactNode);
    wrap?: FC;
    children: ReactNode | ((value?: T) => ReactNode);
}
type Props<T> = PropsBase<T> & (PropsIf<T> | PropsIfReady<T>);
export declare function Show<T>(props: Props<T>): ReactElement;
export {};
