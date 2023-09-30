// services/index.ts

import { BaseService } from '../base';
import { DependenciesType, StoreType } from '../types';
import { AuthService } from './AuthService';
import { UserService } from './UserService';

// Map de constructeurs
export const serviceConstructors = {
  AuthService,
  UserService,
};

// Type déduit pour AllServices
export type AllServices = {
  [K in keyof typeof serviceConstructors]: InstanceType<
    (typeof serviceConstructors)[K]
  >;
};

export class Service extends BaseService<
  AllServices,
  StoreType,
  DependenciesType
> {}
