import { tracking, optimized } from '@legendapp/state';
import { useRef } from 'react';

function getNodePath(node) {
    const arr = [];
    let n = node;
    while ((n === null || n === void 0 ? void 0 : n.key) !== undefined) {
        arr.splice(0, 0, n.key);
        n = n.parent;
    }
    return arr.join('.');
}

function useTraceListeners(name) {
    if (process.env.NODE_ENV === 'development' && tracking.current) {
        tracking.current.traceListeners = traceNodes$1.bind(this, name);
    }
}
function traceNodes$1(name, nodes) {
    if (process.env.NODE_ENV === 'development' && tracking.current) {
        tracking.current.traceListeners = undefined;
        const arr = [];
        if (nodes) {
            for (const tracked of nodes.values()) {
                const { node, track } = tracked;
                const shallow = track === true;
                const isOptimized = track === optimized;
                arr.push(`${arr.length + 1}: ${getNodePath(node)}${shallow ? ' (shallow)' : ''}${isOptimized ? ' (optimized)' : ''}`);
            }
        }
        console.log(`[legend-state] ${name ? name + ' ' : ''}tracking ${arr.length} observable${arr.length !== 1 ? 's' : ''}:\n${arr.join('\n')}`);
    }
}

function useTraceUpdates(name) {
    if (process.env.NODE_ENV === 'development' && tracking.current) {
        tracking.current.traceUpdates = replaceUpdateFn.bind(undefined, name);
    }
}
function replaceUpdateFn(name, updateFn) {
    return onChange.bind(undefined, name, updateFn);
}
function onChange(name, updateFn, params) {
    const { changes } = params;
    if (process.env.NODE_ENV === 'development') {
        changes.forEach(({ path, valueAtPath, prevAtPath }) => {
            console.log(`[legend-state] Rendering ${name ? name + ' ' : ''}because "${path}" changed:
from: ${JSON.stringify(prevAtPath)}
to: ${JSON.stringify(valueAtPath)}`);
        });
        return updateFn();
    }
}

function useVerifyNotTracking(name) {
    if (process.env.NODE_ENV === 'development') {
        tracking.current.traceListeners = traceNodes.bind(this, name);
    }
}
function traceNodes(name, nodes) {
    if (process.env.NODE_ENV === 'development') {
        tracking.current.traceListeners = undefined;
        const arr = [];
        if (nodes) {
            for (const tracked of nodes.values()) {
                const { node, track } = tracked;
                const shallow = track === true;
                const isOptimized = track === optimized;
                arr.push(`${arr.length + 1}: ${getNodePath(node)}${shallow ? ' (shallow)' : ''}${isOptimized ? ' (optimized)' : ''}`);
            }
            console.error(`[legend-state] ${name ? name + ' ' : ''}tracking ${arr.length} observable${arr.length !== 1 ? 's' : ''} when it should not be:\n${arr.join('\n')}`);
        }
    }
}

function useVerifyOneRender(name) {
    if (process.env.NODE_ENV === 'development') {
        const numRenders = ++useRef(0).current;
        if (numRenders > 1) {
            console.error(`[legend-state] ${name ? name + ' ' : ''}Component rendered more than once`);
        }
    }
}

export { useTraceListeners, useTraceUpdates, useVerifyNotTracking, useVerifyOneRender };
//# sourceMappingURL=trace.mjs.map
