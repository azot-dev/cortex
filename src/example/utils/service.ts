// example/utils/service.ts

import { Observable } from '@legendapp/state';
import { BaseService } from '../../lib/base';
import { DependenciesType, Services, StoreType } from './types';

export abstract class Service extends BaseService<
  Services,
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
