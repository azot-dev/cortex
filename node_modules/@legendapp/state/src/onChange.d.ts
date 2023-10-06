import type { ListenerFn, NodeValue, TrackingType } from './observableInterfaces';
export declare function onChange(node: NodeValue, callback: ListenerFn, options?: {
    trackingType?: TrackingType;
    initial?: boolean;
    immediate?: boolean;
    noArgs?: boolean;
}): () => void;
