// base.ts
export class ServiceRegistry<ServiceClasses, StoreType, DependenciesType> {
  private instances: Partial<ServiceClasses> = {};

  constructor(
    private store: StoreType,
    private dependencies: Partial<DependenciesType>
  ) {}

  setInstance<K extends keyof ServiceClasses>(
    name: K,
    instance: ServiceClasses[K]
  ) {
    this.instances[name] = instance;
  }

  get<K extends keyof ServiceClasses>(name: K): ServiceClasses[K] {
    if (!this.instances[name]) {
      throw new Error(`Service ${String(name)} has not been registered.`);
    }
    return this.instances[name] as ServiceClasses[K];
  }
}

export class BaseService<ServiceClasses, StoreType, DependenciesType> {
  constructor(
    public store: StoreType,
    public dependencies: Partial<DependenciesType>,
    private serviceRegistry: ServiceRegistry<
      ServiceClasses,
      StoreType,
      DependenciesType
    >
  ) {}

  getService<K extends keyof ServiceClasses>(name: K): ServiceClasses[K] {
    return this.serviceRegistry.get(name);
  }
}
