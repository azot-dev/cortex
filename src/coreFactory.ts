// coreFactory.ts
import { StoreType, DependenciesType } from './types';
import { ServiceRegistry } from './base';

export function createCoreFactory<ServiceClasses>(
  store: StoreType,
  dependencies: DependenciesType,
  serviceConstructors: {
    [K in keyof ServiceClasses]: new (
      store: StoreType,
      dependencies: DependenciesType,
      serviceRegistry: ServiceRegistry<ServiceClasses>
    ) => ServiceClasses[K];
  }
) {
  const serviceRegistry = new ServiceRegistry<ServiceClasses>(
    store,
    dependencies
  );

  for (const [key, ServiceConstructor] of Object.entries(serviceConstructors)) {
    const instance = new ServiceConstructor(
      store,
      dependencies,
      serviceRegistry
    );
    serviceRegistry.setInstance(key as keyof ServiceClasses, instance);
  }

  return {
    getService<K extends keyof ServiceClasses>(name: K): ServiceClasses[K] {
      return serviceRegistry.get(name);
    },
  };
}
