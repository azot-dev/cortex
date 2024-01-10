import { StorageGateway } from './storage.gateway';

if (!localStorage) {
  throw new Error('localStorage cannot be used in this environment, make sure to use the right adapter');
}
export class LocalStorageStorageAdapter implements StorageGateway {
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
}
