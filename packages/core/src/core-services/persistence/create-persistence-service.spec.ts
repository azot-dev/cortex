import { Observable } from "@legendapp/state";
import { BaseService } from "../../base";
import { createCortexFactory } from "../../coreFactory";
import { GetStore, ServiceConstructor } from "../../types/service-constructor";
import { STORAGE_KEY, createPersistenceService } from "./create-persistence-service";

describe("createPersistenceService", () => {
  let storageService: StorageService;
  let core: InstanceType<typeof Core>;

  beforeEach(() => {
    storageService = new StorageService();
    core = new Core({ storage: storageService });
  });

  it("should call setItem of the storage adapter when user.name is changed", async () => {
    core.getService("user").changeName("Xavier");
    const value = await storageService.getItem(`${STORAGE_KEY}/user.name`);

    expect(value).toBe("Xavier");
  });

  it("should not call setItem of the storage adapter when user.age is changed", async () => {
    core.getService("user").changeAge(30);
    expect(await storageService.getItem("user.age")).toBeUndefined();
  });

  it.only("should instantiate a new core with the persisted value", async () => {
    core.getService("user").changeName("Xavier");

    const newCore = new Core({ storage: storageService });

    await sleep(10);

    expect(newCore.store.user.name.get()).toBe("Xavier");
  });
});

function sleep(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export abstract class Service<T = any> extends BaseService<T, typeof services & typeof coreServices, Dependencies> {
  constructor(...args: [any, any, any, any]) {
    super(...args);
  }
}

type UserState = { name: string; age: number };

class UserService extends Service<UserState> {
  static initialState: UserState = { name: "John", age: 28 };

  init() {
    this.getService("persistence").persist("user.name");
  }

  changeName(newName: string) {
    this.state.name.set(newName);
  }

  changeAge(newAge: number) {
    this.state.age.set(newAge);
  }

  getName() {
    return this.state.name.get();
  }
}

interface Storage {
  getItem(key: string): Promise<any>;
  setItem(key: string, value: any): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
  getAllKeys(): Promise<string[]>;
}

const PersistenceService = createPersistenceService<Dependencies, typeof services>("storage");

class StorageService implements Storage {
  private storage: Record<string, any> = {};

  async getItem(key: string): Promise<any> {
    return this.storage[key];
  }

  async setItem(key: string, value: any): Promise<void> {
    this.storage[key] = value;
  }

  async removeItem(key: string): Promise<void> {
    delete this.storage[key];
  }

  async clear(): Promise<void> {
    this.storage = {};
  }

  async getAllKeys(): Promise<string[]> {
    return Object.keys(this.storage);
  }
}

const services = {
  user: UserService,
};

const coreServices = {
  persistence: PersistenceService,
};

type Dependencies = {
  storage: Storage;
};

const Core = createCortexFactory<Dependencies>()(services, coreServices);
