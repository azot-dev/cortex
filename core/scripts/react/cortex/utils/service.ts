// utils/service.ts

import { Observable } from '@legendapp/state';
import { BaseService } from '@azot-dev/cortex';
import { Services, StoreType } from './types';
import { Dependencies } from '../dependencies/_dependencies';

export abstract class Service extends BaseService<
  Services,
  Observable<StoreType>,
  Dependencies
> {
  constructor(
    store: Observable<StoreType>,
    dependencies: Partial<Dependencies>,
    serviceRegistry: any
  ) {
    super(store, dependencies, serviceRegistry);
  }
}
