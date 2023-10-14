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

  hello() {}
}
