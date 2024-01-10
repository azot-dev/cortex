import { StorageGateway } from "./storage.gateway";

let AsyncStorage: any;

try {
  AsyncStorage = require("@react-native-async-storage/async-storage");
} catch (e) {
  throw new Error("@react-native-async-storage/async-storage must be installed within your project");
}

export class AsyncStorageStorageAdapter implements StorageGateway {
  getItem = AsyncStorage.getItem;
  setItem = AsyncStorage.setItem;
  removeItem = AsyncStorage.removeItem;
  clear = AsyncStorage.clear;
  async getAllKeys() {
    const keys = await AsyncStorage.getAllKeys();
    return [...keys];
  }
}
