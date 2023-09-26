// example/utils/service.ts

import { BaseService } from '../../lib/base';
import { serviceConstructors } from '../services/_services';
import { DependenciesType, StoreType } from '../types';

export abstract class Service extends BaseService<
  typeof serviceConstructors,
  StoreType,
  DependenciesType
> {
  constructor(store: StoreType, dependencies: Partial<DependenciesType>) {
    super(store, dependencies);
  }
}
