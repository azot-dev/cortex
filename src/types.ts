export interface StoreType {
  user: { id: string; name: string };
  settings: { theme: string };
}

export interface DependenciesType {
  apiClient: any;
}

export type Constructor<T = {}> = new (...args: any[]) => T;
