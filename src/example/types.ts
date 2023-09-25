// example/types.ts

export interface StoreType {
  user: { id: string; name: string };
  settings: { theme: string };
}

export interface DependenciesType {
  apiClient: any;
}
