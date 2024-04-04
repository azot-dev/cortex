import { Observable, observable } from "@legendapp/state";
import _ from "lodash";

export interface Storage {
  getItem(key: string): Promise<any>;
  setItem(key: string, value: any): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
  getAllKeys(): Promise<string[]>;
}

export class FakeStorage implements Storage {
  getItem(key: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
  setItem(key: string, value: any): Promise<void> {
    throw new Error("Method not implemented.");
  }
  removeItem(key: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  clear(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getAllKeys(): Promise<string[]> {
    throw new Error("Method not implemented.");
  }
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

export const createPersistenceService = <K extends Record<string, any>>(key: KeysMatching<K, Storage>, storageKey: string = "@cortex-persist") => {
  let storage: Storage; // no class with private or protected member can be exported in a Typescript function
  let store: Observable<Record<string, any>>;

  const getAllKeys = async () => (await storage.getAllKeys()).filter((key) => key.startsWith(storageKey));

  return class PersistenceService<Store extends Observable<Record<string, any>>> {
    constructor(injectedStore: Store, _state: any, dependencies: { [P in KeysMatching<K, Storage>]: Storage } & Record<string, any>, _serviceRegistry: any) {
      store = injectedStore;
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
        storage.setItem(`${storageKey}/${String(key)}`, data);
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

const T = createPersistenceService("hello");

const t = new T(observable({ hello: "salut", res: { yes: "", no: "" } }), {}, { hello: new FakeStorage() }, {});

t.persist("res.no");

// faire vieille implem console.logs pour storage
// L'intégrer en typescript au Service
// tests
