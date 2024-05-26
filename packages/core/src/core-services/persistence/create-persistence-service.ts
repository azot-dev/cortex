import { Observable } from "@legendapp/state";
import _ from "lodash";
import { GetStore, ServiceConstructor } from "../../types/service-constructor";

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

type ExtractObservableType<O> = O extends Observable<infer T> ? T : never;

export const createPersistenceService = <K extends Record<string, any>, ServiceConstructorsType extends Record<string, ServiceConstructor<any, any, any>>>(
  key: KeysMatching<K, Storage>,
  storageKey: string = STORAGE_KEY
) => {
  type Store = Observable<GetStore<ServiceConstructorsType>>;

  let storage: Storage; // no class with private or protected member can be exported in a Typescript function
  let store: Store;

  const getAllKeys = async () => {
    const allKeys = await storage.getAllKeys();
    return allKeys.filter((key) => key.startsWith(storageKey));
  };

  return class PersistenceService {
    static initialState = {
      hydrated: false,
    };

    constructor(
      injectedStore: Observable<GetStore<any>>,
      _state: any,
      dependencies: { [P in KeysMatching<K, Storage>]: Storage } & Record<string, any>,
      _serviceRegistry: any
    ) {
      store = injectedStore as Observable<GetStore<ServiceConstructorsType>>;
      storage = dependencies[key];
    }

    async init() {
      const fullKeys = await getAllKeys();

      fullKeys.forEach(async (fullKey) => {
        const key = fullKey.split(`${storageKey}/`)[1];
        const value = await storage.getItem(fullKey);

        const matchingPath = _.get(store, key);
        if (!matchingPath) {
          storage.removeItem(fullKey);
        } else {
          matchingPath.set(value);
        }
      });
    }

    persist(key: Path<ExtractObservableType<Store>>) {
      const matchingPath = _.get(store, key);

      matchingPath.onChange((data: any) => {
        storage.setItem(`${storageKey}/${String(key)}`, data.value);
      });
    }

    async clean() {
      const keys = await getAllKeys();
      keys.forEach(async (key) => {
        await storage.removeItem(key);
      });
    }
  };
};
