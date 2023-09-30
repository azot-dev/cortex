// example/types.ts

import { store } from './store/_store';

export type StoreType = typeof store;

export interface DependenciesType {
  apiClient: any;
}
