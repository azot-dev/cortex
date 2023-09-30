// example/utils/service.ts

import { Observable } from '@legendapp/state';
import { BaseService } from '../../lib/base';
import { services } from '../services/_services';
import { DependenciesType, StoreType } from '../types';

export abstract class Service extends BaseService<
  typeof services,
  Observable<StoreType>,
  DependenciesType
> {
  constructor(
    store: Observable<StoreType>,
    dependencies: Partial<DependenciesType>
  ) {
    super(store, dependencies);
  }
}
