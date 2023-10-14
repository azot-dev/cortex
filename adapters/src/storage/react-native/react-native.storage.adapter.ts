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
  helloYou() {}
}
