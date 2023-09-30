import { BaseService } from './base';
import { StoreType, DependenciesType } from './types';

type ServiceMap = {
  [key: string]: BaseService<any, any, any>;
};

let GLOBAL_REGISTRY: ServiceMap = {};

export const setGlobalService = (
  key: string,
  service: BaseService<any, any, any>
) => {
  GLOBAL_REGISTRY[key] = service;
};

export const getGlobalService = <T extends BaseService<any, any, any>>(
  key: string
): T => {
  return GLOBAL_REGISTRY[key] as T;
};
