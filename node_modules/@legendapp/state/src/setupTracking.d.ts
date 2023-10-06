import type { ListenerFn, NodeValue, TrackingNode } from './observableInterfaces';
export declare function setupTracking(nodes: Map<NodeValue, TrackingNode> | undefined, update: ListenerFn, noArgs?: boolean, immediate?: boolean): () => void;
