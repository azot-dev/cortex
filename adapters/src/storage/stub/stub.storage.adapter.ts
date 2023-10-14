import { StorageGateway } from '../storage.gateway';

export class StubStorageAdapter implements StorageGateway {
  private items: Record<string, any> = {};

  async getItem(key: string) {
    return this.items[key];
  }

  async setItem(key: string, value: any) {
    this.items[key] = value;
  }

  async removeItem(key: string) {
    delete this.items[key];
  }

  async clear() {
    this.items = {};
  }

  async getAllKeys() {
    return Object.keys(this.items);
  }

  feedWith(items: Record<string, any>) {
    this.items = items;
  }
}
