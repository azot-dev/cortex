import { BaseService, createCortexFactory } from "../src";

abstract class Service<T = undefined> extends BaseService<T, typeof services, {}> {
  constructor(...args: [any, any, any, any]) {
    super(...args);
  }
}

type UserState = { name: string; age: number };

class UserService extends Service<UserState> {
  static initialState: UserState = { name: "John", age: 28 };

  changeName(newName: string) {
    this.state.name.set(newName);
  }

  getName() {
    return this.state.name.get();
  }

  changeOtherServiceNb(newNb: number) {
    this.store.other.nb.set(newNb);
  }

  getOtherServiceNb() {
    return this.store.other.nb.get();
  }
}

type OtherState = { nb: number };

class OtherService extends Service<OtherState> {
  static initialState: OtherState = { nb: 5 };

  changeName(newName: string) {
    this.getService("user").changeName(newName);
  }

  incrementNbWhenMethodIsCalled() {
    this.decorateAllMethods((serviceKey, methodName) => {
      this.state.nb.set((nb) => nb + 1);
    });
  }
}

const services = {
  user: UserService,
  other: OtherService,
};

const Core = createCortexFactory()(services);

describe("core service", () => {
  let core = new Core();
  beforeEach(() => {
    core = new Core();
  });

  it("should get any store value", () => {
    const value = core.getService("user").getOtherServiceNb();
    expect(value).toBe(5);
  });

  it("should modify any store value", () => {
    core.getService("user").changeOtherServiceNb(8);
    const value = core.getService("user").getOtherServiceNb();
    expect(value).toBe(8);
  });

  describe("decorateAllMethods", () => {
    it("should execute a callback each time a method is called", () => {
      core.getService("other").incrementNbWhenMethodIsCalled();
      expect(core.store.other.nb.get()).toBe(5);
      core.getService("user").getOtherServiceNb();
      expect(core.store.other.nb.get()).toBe(6);
    });
  });
});
