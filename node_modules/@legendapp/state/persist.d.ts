export { configureObservablePersistence } from './src/persist/configureObservablePersistence';
export { invertFieldMap, transformObject, transformPath } from './src/persist/fieldTransformer';
export { mapPersistences, onChangeRemote, persistObservable, persistState } from './src/persist/persistObservable';
export declare function isInRemoteChange(): boolean;
import type { ObservablePersistenceConfig } from './src/observableInterfaces';
export declare const internal: {
    observablePersistConfiguration: ObservablePersistenceConfig;
};
