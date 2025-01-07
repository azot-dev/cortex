import { proxy, subscribe } from "valtio";
import _ from "lodash";
import { ServiceConstructor } from "../../types/service-constructor";

export const STORAGE_KEY = "@cortex-persist";
export interface Storage {
  getItem(key: string): Promise<any>;
  setItem(key: string, value: any): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
  getAllKeys(): Promise<string[]>;
}

type PathImpl<T, K extends keyof T> = K extends string
  ? T[K] extends Record<string, any>
    ? T[K] extends Array<any>
      ? K | `${K}.${PathImpl<T[K], Exclude<keyof T[K], keyof any[]>>}`
      : K | `${K}.${PathImpl<T[K], keyof T[K]>}`
    : K
  : never;

type Path<T> = PathImpl<T, keyof T> | keyof T;

type KeysMatching<T, V> = { [K in keyof T]: T[K] extends V ? K : never }[keyof T];

export const createPersistenceService = <K extends Record<string, any>, ServiceConstructorsType extends Record<string, ServiceConstructor<any, any, any>>>(
  key: KeysMatching<K, Storage>,
  storageKey: string = STORAGE_KEY
) => {
  let storage: Storage;
  let store: any;

  const getAllKeys = async () => {
    const allKeys = await storage.getAllKeys();
    return allKeys.filter((key) => key.startsWith(storageKey));
  };

  return class PersistenceService {
    static initialState = {
      hydrated: false,
    };

    constructor(injectedStore: any, _state: any, dependencies: { [P in KeysMatching<K, Storage>]: Storage } & Record<string, any>, _serviceRegistry: any) {
      store = injectedStore;
      storage = dependencies[key];
    }

    async init() {
      const fullKeys = await getAllKeys();

      for (const fullKey of fullKeys) {
        const key = fullKey.split(`${storageKey}/`)[1];
        const value = await storage.getItem(fullKey);

        const matchingPath = _.get(store, key);
        if (!matchingPath) {
          await storage.removeItem(fullKey);
        } else {
          _.set(store, key, value);
        }
      }
    }

    persist(key: Path<typeof store>) {
      const unsubscribe = subscribe(store, () => {
        const value = _.get(store, key);
        storage.setItem(`${storageKey}/${String(key)}`, value);
      });

      return unsubscribe;
    }

    async clean() {
      const keys = await getAllKeys();
      for (const key of keys) {
        await storage.removeItem(key);
      }
    }
  };
};
