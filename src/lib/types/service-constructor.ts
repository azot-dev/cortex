// lib/types/service-constructor.ts

import { ServiceRegistry } from '../base';

export type ServiceConstructor<ServiceType, StoreType, DependenciesType> = new (
  store: StoreType,
  dependencies: DependenciesType,
  serviceRegistry: ServiceRegistry<any, StoreType, DependenciesType>
) => ServiceType;
