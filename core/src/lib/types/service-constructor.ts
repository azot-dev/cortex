// lib/types/service-constructor.ts

import { Observable } from '@legendapp/state';
import { ServiceRegistry } from '../base';

export type ConstructedServiceTypes<
  ServiceConstructorsType extends Record<
    string,
    ServiceConstructor<any, Observable<StoreType>, DependenciesType>
  >,
  StoreType,
  DependenciesType
> = {
  [K in keyof ServiceConstructorsType]: InstanceType<
    ServiceConstructorsType[K]
  >;
};

export type ServiceConstructor<ServiceType, StoreType, DependenciesType> = new (
  store: Observable<StoreType>,
  dependencies: DependenciesType,
  serviceRegistry: ServiceRegistry<any, Observable<StoreType>, DependenciesType>
) => ServiceType;
