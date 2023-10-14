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
