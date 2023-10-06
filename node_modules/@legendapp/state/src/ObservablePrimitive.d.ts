import type { NodeValue, ObservablePrimitive } from './observableInterfaces';
interface ObservablePrimitiveState {
    _node: NodeValue;
    toggle: () => void;
}
export declare function ObservablePrimitiveClass<T>(this: ObservablePrimitive<T> & ObservablePrimitiveState, node: NodeValue): void;
export {};
