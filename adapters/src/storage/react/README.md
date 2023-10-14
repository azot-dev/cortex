# React Storage Adapter
## installation

```sh
npm i @azot-dev/cortex-storage-react-adapter
```
or
```sh
yarn add @azot-dev/cortex-storage-react-adapter
```

## adapter

```ts
export * from '../storage.gateway';

import { StorageGateway } from '../storage.gateway';

export class ReactStorageAdapter implements StorageGateway {
  async getItem(key: string) {
    return localStorage.getItem(key);
  }

  async setItem(key: string, value: any) {
    return localStorage.setItem(key, value);
  }

  async removeItem(key: string) {
    localStorage.removeItem(key);
  }

  async clear() {
    localStorage.clear();
  }

  async getAllKeys() {
    return Object.keys(localStorage);
  }

  helloYou() {}
}
```

## gateway

```ts
export interface StorageGateway {
  getItem(key: string): Promise<any>;
  setItem(key: string, value: any): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
  getAllKeys(): Promise<string[]>;
}
```
