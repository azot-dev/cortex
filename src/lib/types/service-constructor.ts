// lib/types/service-constructor.ts

import { ServiceRegistry } from '../base';

export type ConstructedServiceTypes<
  ServiceConstructorsType extends Record<
    string,
    ServiceConstructor<any, StoreType, DependenciesType>
  >,
  StoreType,
  DependenciesType
> = {
  [K in keyof ServiceConstructorsType]: InstanceType<
    ServiceConstructorsType[K]
  >;
};

export type ServiceConstructor<ServiceType, StoreType, DependenciesType> = new (
  store: StoreType,
  dependencies: DependenciesType,
  serviceRegistry: ServiceRegistry<any, StoreType, DependenciesType>
) => ServiceType;
