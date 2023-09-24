// services/UserService.ts

import { AllServices } from '.';
import { BaseService } from '../base';
import { StoreType, DependenciesType } from '../types';

export class UserService extends BaseService<
  AllServices,
  StoreType,
  DependenciesType
> {
  getUser() {
    console.log('Fetching user...');
  }
}
