// base.ts
import { StoreType, DependenciesType } from './types';

export class ServiceRegistry<ServiceClasses> {
  private instances: Partial<ServiceClasses> = {};

  constructor(
    private store: StoreType,
    private dependencies: DependenciesType
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

  getService<K extends keyof ServiceList>(name: K): ServiceList[K] {
    return this.services[name]!;
  }
}

export class BaseService<ServiceClasses> {
  constructor(
    public store: StoreType,
    public dependencies: Partial<DependenciesType>,
    private serviceRegistry: ServiceRegistry<ServiceClasses>
  ) {}

  getService<K extends keyof ServiceClasses>(name: K): ServiceClasses[K] {
    return this.serviceRegistry.get(name);
  }
}
