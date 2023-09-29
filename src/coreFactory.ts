import { ServiceRegistry } from './base';

export function createCoreFactory<ServiceClasses, StoreType, DependenciesType>(
  store: StoreType,
  serviceConstructors: {
    [K in keyof ServiceClasses]: new (
      store: StoreType,
      dependencies: DependenciesType,
      serviceRegistry: ServiceRegistry<
        ServiceClasses,
        StoreType,
        DependenciesType
      >
    ) => ServiceClasses[K];
  }
) {
  return class Core {
    private serviceRegistry: ServiceRegistry<
      ServiceClasses,
      StoreType,
      DependenciesType
    >;

    constructor(dependencies: Partial<DependenciesType>) {
      this.serviceRegistry = new ServiceRegistry(
        store,
        dependencies as DependenciesType
      );

      for (const [key, ServiceConstructor] of Object.entries(
        serviceConstructors
      )) {
        const instance = new ServiceConstructor(
          store,
          dependencies as DependenciesType,
          this.serviceRegistry
        );
        this.serviceRegistry.setInstance(key as keyof ServiceClasses, instance);
      }
    }

    getService<K extends keyof ServiceClasses>(name: K): ServiceClasses[K] {
      return this.serviceRegistry.get(name);
    }
  };
}
