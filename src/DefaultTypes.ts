import { BaseService } from './base';

export interface DefaultServices {
  [key: string]: BaseService<any, any, any>;
}

export interface DefaultStoreType {}
export interface DefaultDependenciesType {}
