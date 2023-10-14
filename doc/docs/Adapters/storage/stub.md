# Stub Storage Adapter
## installation

```sh
npm i @azot-dev/cortex-storage-stub-adapter
```
or
```sh
yarn add @azot-dev/cortex-storage-stub-adapter
```

## adapter

```ts
export * from '../storage.gateway';

import { StorageGateway } from '../storage.gateway';

export class StubStorageAdapter implements StorageGateway {
  private storage: Record<string, any> = {};

  getItem(key: string) {
    return this.storage[key];
  }
  async setItem(key: string, value: any) {
    this.storage[key] = value;
  }
  async removeItem(key: string) {
    delete this.storage[key];
  }
  async clear() {
    this.storage = {};
  }
  async getAllKeys() {
    return Object.keys(this.storage);
  }
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
