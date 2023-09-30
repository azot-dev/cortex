// lib/coreFactory.ts

import { ServiceRegistry } from './base';
import { ServiceConstructor } from './types/service-constructor';

export function createCoreFactory<DependenciesType>() {
  return <
    StoreType extends Record<string, any>,
    ServiceConstructorsType extends Record<
      string,
      ServiceConstructor<any, StoreType, DependenciesType>
    >
  >(
    store: StoreType,
    serviceConstructors: ServiceConstructorsType
  ) => {
    type ServiceInstances = {
      [K in keyof ServiceConstructorsType]: InstanceType<
        ServiceConstructorsType[K]
      >;
    };

    return class Core {
      private serviceRegistry: ServiceRegistry<
        ServiceInstances,
        StoreType,
        DependenciesType
      >;

      constructor(dependencies: Partial<DependenciesType> = {}) {
        this.serviceRegistry = new ServiceRegistry();

        for (const [key, ServiceConstructor] of Object.entries(
          serviceConstructors
        )) {
          const instance = new ServiceConstructor(
            store,
            dependencies as DependenciesType,
            this.serviceRegistry
          );
          this.serviceRegistry.setInstance(
            key as keyof ServiceInstances,
            instance
          );
        }
      }

      getService<K extends keyof ServiceInstances>(
        name: K
      ): ServiceInstances[K] {
        return this.serviceRegistry.get(name);
      }
    };
  };
}
