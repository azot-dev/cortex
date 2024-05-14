import { Observable } from "@legendapp/state";
import { BaseService } from "../../base";
import { createCortexFactory } from "../../coreFactory";
import { GetStore, ServiceConstructor } from "../../types/service-constructor";
import { createPersistenceService } from "./create-persistence-service";

describe("createPersistenceService", () => {
  it("should create the service", () => {});
});

export abstract class Service<T = any> extends BaseService<T, typeof services & typeof coreServices, Dependencies> {
  constructor(...args: [any, any, any, any]) {
    super(...args);
  }
}

type UserState = { name: string; age: number };

class UserService extends Service<UserState> {
  static initialState: UserState = { name: "John", age: 28 };

  init() {
    const t = this.getService("persistence").persist("user.name");
  }

  changeName(newName: string) {
    this.state.name.set(newName);
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

// faire en sorte que seuls les coreServices aient accès au store => signature differente, ou on ignore le store injecté dans les services qui ne sera plus un attribut
// decorateAllMethods n'a besoin d'etre accessible que pour le debugger donc on peut supprimer
