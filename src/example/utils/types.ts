// example/types.ts

import { CoreClass } from '..';
import { services } from '../services/_services';
import { store } from '../store/_store';

export type StoreType = typeof store;

export interface DependenciesType {
  apiClient: any;
}

export type Services = typeof services;

export type Core = typeof CoreClass;
