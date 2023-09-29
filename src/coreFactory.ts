import { ServiceRegistry } from './base';

type ServiceConstructor<ServiceType, StoreType, DependenciesType> = new (
  store: StoreType,
  dependencies: Partial<DependenciesType>,
  serviceRegistry: ServiceRegistry<any, StoreType, DependenciesType>
) => ServiceType;

export function createCoreFactory<
  ServiceConstructorsType extends Record<
    string,
    ServiceConstructor<any, any, any>
  >,
  StoreType,
  DependenciesType
>(store: StoreType, serviceConstructors: ServiceConstructorsType) {
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
      this.serviceRegistry = new ServiceRegistry(store, dependencies);

      for (const [key, ServiceConstructor] of Object.entries(
        serviceConstructors
      )) {
        const instance = new ServiceConstructor(
          store,
          dependencies,
          this.serviceRegistry
        );
        this.serviceRegistry.setInstance(
          key as keyof ServiceInstances,
          instance
        );
      }
    }

    getService<K extends keyof ServiceInstances>(name: K): ServiceInstances[K] {
      return this.serviceRegistry.get(name);
    }
  };
}
