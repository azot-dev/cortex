// lib/coreFactory.ts

import { observable } from '@legendapp/state';
import { ServiceRegistry } from './base';
import { ServiceConstructor } from './types/service-constructor';

export function createCortexFactory<DependenciesType>() {
  return <
    StoreType extends Record<string, any>,
    ServiceConstructorsType extends Record<
      string,
      ServiceConstructor<any, StoreType, DependenciesType>
    >
  >(
    rawStore: StoreType,
    serviceConstructors: ServiceConstructorsType
  ) => {
    type ServiceInstances = {
      [K in keyof ServiceConstructorsType]: InstanceType<
        ServiceConstructorsType[K]
      >;
    };
    const store = observable(rawStore);

    return class Core {
      #serviceRegistry: ServiceRegistry<
        ServiceInstances,
        StoreType,
        DependenciesType
      >;
      public store: typeof store;

      constructor(dependencies: Partial<DependenciesType> = {}) {
        this.#serviceRegistry = new ServiceRegistry();
        this.store = store;

        for (const [key, ServiceConstructor] of Object.entries(
          serviceConstructors
        )) {
          const instance = new ServiceConstructor(
            this.store,
            dependencies as DependenciesType,
            this.#serviceRegistry
          );
          this.#serviceRegistry.setInstance(
            key as keyof ServiceInstances,
            instance
          );
        }

        Object.keys(serviceConstructors).forEach((service) => {
          this.#serviceRegistry.get(service).init?.();
        });
      }

      getService<K extends keyof ServiceInstances>(
        name: K
      ): ServiceInstances[K] {
        return this.#serviceRegistry.get(name);
      }
    };
  };
}
