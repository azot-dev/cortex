// types.ts
import { ServiceRegistry } from './base';

export interface StoreType {
  user: { id: string; name: string };
  settings: { theme: string };
}

export interface DependenciesType {
  apiClient: any;
}

export type ServiceConstructor<ServiceType, StoreType, DependenciesType> = new (
  store: StoreType,
  dependencies: DependenciesType,
  serviceRegistry: ServiceRegistry<any, StoreType, DependenciesType>
) => ServiceType;
