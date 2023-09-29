import { ServiceRegistry } from './base';

export interface StoreType {
  user: { id: string; name: string };
  settings: { theme: string };
}

export interface DependenciesType {
  apiClient: any;
}

export type ServiceConstructor<ServiceClasses, Store, Dependencies> = {
  [K in keyof ServiceClasses]: new (
    store: Store,
    dependencies: Partial<Dependencies>,
    serviceRegistry: ServiceRegistry<ServiceClasses, Store, Dependencies>
  ) => ServiceClasses[K];
};
