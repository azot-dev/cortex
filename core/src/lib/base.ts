import { Observable } from '@legendapp/state';
import {
  ConstructedServiceTypes,
  ServiceConstructor,
} from './types/service-constructor';

// lib/base.ts
export class ServiceRegistry<
  ServiceConstructorsType extends Record<
    string,
    ServiceConstructor<any, Observable<StoreType>, DependenciesType>
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
    ServiceConstructor<any, Observable<StoreType>, DependenciesType>
  >,
  StoreType,
  DependenciesType
> {
  private serviceRegistry: ServiceRegistry<
    ServiceConstructorsType,
    StoreType,
    DependenciesType
  >;

  constructor(
    protected store: StoreType,
    protected dependencies: Partial<DependenciesType>,
    serviceRegistry: ServiceRegistry<
      ServiceConstructorsType,
      StoreType,
      DependenciesType
    >
  ) {
    this.serviceRegistry = serviceRegistry;
  }

  protected getService<K extends keyof ServiceConstructorsType>(
    name: K
  ): ConstructedServiceTypes<
    ServiceConstructorsType,
    StoreType,
    DependenciesType
  >[K] {
    return this.serviceRegistry.get(name);
  }
}
