// Service.ts

import { BaseService, ServiceRegistry } from './base';
import { AllServices } from './services';
import { StoreType, DependenciesType } from './types';

export abstract class Service extends BaseService<
  AllServices,
  StoreType,
  DependenciesType
> {
  constructor(
    store: StoreType,
    dependencies: Partial<DependenciesType>,
    serviceRegistry: ServiceRegistry<AllServices, StoreType, DependenciesType>
  ) {
    super(store, dependencies, serviceRegistry);
  }
}
