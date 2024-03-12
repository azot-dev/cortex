import { StorageGateway } from "./storage.gateway";
import type { AsyncStorageStatic } from "@react-native-async-storage/async-storage";

export class AsyncStorageStorageAdapter implements StorageGateway {
  private AsyncStorage!: AsyncStorageStatic;

  constructor() {
    import("@react-native-async-storage/async-storage")
      .then((value) => {
        this.AsyncStorage = value.default;
      })
      .catch(() => {
        throw new Error("@react-native-async-storage/async-storage must be installed within your project");
      });
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
