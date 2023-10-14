# React-native Storage Adapter
## installation

```sh
npm i @azot-dev/cortex-storage-react-native-adapter
```
or
```sh
yarn add @azot-dev/cortex-storage-react-native-adapter
```

## adapter

```ts
export * from '../storage.gateway';
import { StorageGateway } from '../storage.gateway';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class ReactStorageAdapter implements StorageGateway {
  getItem = AsyncStorage.getItem;
  setItem = AsyncStorage.setItem;
  removeItem = AsyncStorage.removeItem;
  clear = AsyncStorage.clear;
  async getAllKeys() {
    const keys = await AsyncStorage.getAllKeys();
    return [...keys];
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
