import { Observable } from "@legendapp/state";
import { ServiceConstructor, ConstructedServiceTypes } from "./types/service-constructor";

export class ServiceRegistry<
  ServiceConstructorsType extends Record<string, ServiceConstructor<any, Observable<StoreType>, DependenciesType>>,
  StoreType,
  DependenciesType
> {
  private instances: Partial<ConstructedServiceTypes<ServiceConstructorsType, StoreType, DependenciesType>> = {};

  setInstance<K extends keyof ConstructedServiceTypes<ServiceConstructorsType, StoreType, DependenciesType>>(
    name: K,
    instance: ConstructedServiceTypes<ServiceConstructorsType, StoreType, DependenciesType>[K]
  ) {
    this.instances[name] = instance;
  }

  getNames(): (keyof ConstructedServiceTypes<ServiceConstructorsType, StoreType, DependenciesType>)[] {
    return Object.keys(this.instances);
  }

  get<K extends keyof ConstructedServiceTypes<ServiceConstructorsType, StoreType, DependenciesType>>(
    name: K
  ): ConstructedServiceTypes<ServiceConstructorsType, StoreType, DependenciesType>[K] {
    if (!this.instances[name]) {
      throw new Error(`Service ${String(name)} has not been registered.`);
    }
    return this.instances[name] as ConstructedServiceTypes<ServiceConstructorsType, StoreType, DependenciesType>[K];
  }
}
