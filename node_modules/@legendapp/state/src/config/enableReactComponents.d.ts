/// <reference types="react" />
import { FCReactiveObject } from '@legendapp/state/react';
export declare function enableReactComponents(): void;
declare module '@legendapp/state/react' {
    interface IReactive extends FCReactiveObject<JSX.IntrinsicElements> {
    }
}
