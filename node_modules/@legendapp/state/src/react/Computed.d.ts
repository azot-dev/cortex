import { ReactElement, ReactNode } from 'react';
import type { ObservableReadable } from '../observableInterfaces';
export declare function Computed({ children }: {
    children: ObservableReadable | (() => ReactNode);
}): ReactElement;
