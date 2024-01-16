import { StorageGateway } from "./storage.gateway";

export class AsyncStorageStorageAdapter implements StorageGateway {
  private AsyncStorage: any;

  constructor() {
    try {
      this.AsyncStorage = require("@react-native-async-storage/async-storage");
    } catch (e) {
      throw new Error("@react-native-async-storage/async-storage must be installed within your project");
    }
  }

  async clear() {
    this.AsyncStorage.clear();
  }

  async removeItem(key: string) {
    this.AsyncStorage.removeItem(key);
  }

  async setItem(key: string, value: any) {
    this.AsyncStorage.setItem(key, value);
  }

  async getItem(key: string) {
    return this.AsyncStorage.getItem(key);
  }

  async getAllKeys() {
    const keys = await this.AsyncStorage.getAllKeys();
    return [...keys];
  }
}
