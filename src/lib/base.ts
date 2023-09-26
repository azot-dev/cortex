import {
  ConstructedServiceTypes,
  ServiceConstructor,
} from './types/service-constructor';

// lib/base.ts
export class ServiceRegistry<
  ServiceConstructorsType extends Record<
    string,
    ServiceConstructor<any, StoreType, DependenciesType>
  >,
  StoreType,
  DependenciesType
> {
  private instances: Partial<
    ConstructedServiceTypes<
      ServiceConstructorsType,
      StoreType,
      DependenciesType
    >
  > = {};

  constructor(
    private store: StoreType,
    private dependencies: Partial<DependenciesType>
  ) {}

  setInstance<
    K extends keyof ConstructedServiceTypes<
      ServiceConstructorsType,
      StoreType,
      DependenciesType
    >
  >(
    name: K,
    instance: ConstructedServiceTypes<
      ServiceConstructorsType,
      StoreType,
      DependenciesType
    >[K]
  ) {
    this.instances[name] = instance;
  }

  get<
    K extends keyof ConstructedServiceTypes<
      ServiceConstructorsType,
      StoreType,
      DependenciesType
    >
  >(
    name: K
  ): ConstructedServiceTypes<
    ServiceConstructorsType,
    StoreType,
    DependenciesType
  >[K] {
    if (!this.instances[name]) {
      throw new Error(`Service ${String(name)} has not been registered.`);
    }
    return this.instances[name] as ConstructedServiceTypes<
      ServiceConstructorsType,
      StoreType,
      DependenciesType
    >[K];
  }
}

export class BaseService<
  ServiceConstructorsType extends Record<
    string,
    ServiceConstructor<any, StoreType, DependenciesType>
  >,
  StoreType,
  DependenciesType
> {
  protected serviceRegistry: ServiceRegistry<
    ServiceConstructorsType,
    StoreType,
    DependenciesType
  >;

  constructor(
    public store: StoreType,
    public dependencies: Partial<DependenciesType>
  ) {
    this.serviceRegistry = new ServiceRegistry<
      ServiceConstructorsType,
      StoreType,
      DependenciesType
    >(store, dependencies);
  }

  getService<K extends keyof ServiceConstructorsType>(
    name: K
  ): ConstructedServiceTypes<
    ServiceConstructorsType,
    StoreType,
    DependenciesType
  >[K] {
    return this.serviceRegistry.get(name);
  }
}
