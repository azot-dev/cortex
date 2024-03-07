import { BaseService, createCortexFactory } from "../src";

class UserService extends BaseService<any, any, any> {
  static initialState = { name: "John", age: 28 };

  changeName(newName: string) {
    this.state.name.set(newName);
  }
}

const Cortex = createCortexFactory()({ user: UserService });

describe("core", () => {
  let core = new Cortex();
  beforeEach(() => {
    core = new Cortex();
  });

  it("should access to the store", () => {
    const userName = core.store.user.name.get();
    expect(userName).toBe("John");
  });

  it("should modify the store", () => {
    core.store.user.name.set("David");
    const userName = core.store.user.name.get();
    expect(userName).toBe("David");
  });

  it("should call the services methods", () => {
    core.getService("user").changeName("Max");
    const userName = core.store.user.name.get();
    expect(userName).toBe("Max");
  });

  it("should get the store from the service", () => {
    const state = core.getService("user").getState();
    expect(core.getService("user").getState().name).toBe("John");
    core.getService("user").changeName("Max");
    expect(core.getService("user").getState().name).toBe("Max");
  });

  it("should get the store from the service", () => {
    const state = core.getService("user").getState();
    expect(core.getService("user").getState().name).toBe("John");
    core.getService("user").changeName("Max");
    expect(core.getService("user").getState().name).toBe("Max");
  });

  it("should modify the store from the service", () => {
    core.getService("user").setState({ name: "Xavier", age: 27 });
    expect(core.getService("user").getState().name).toBe("Xavier");
    core.getService("user").setState((state: any) => ({ ...state, age: 35 }));
    expect(core.getService("user").getState().age).toBe(35);
  });
});
