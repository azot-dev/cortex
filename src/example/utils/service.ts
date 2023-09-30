// example/utils/service.ts

import { BaseService, ServiceRegistry } from '../../lib/base';
import { AllServices } from '../services/_services';
import { DependenciesType, StoreType } from '../types';

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
