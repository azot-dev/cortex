import { BaseService } from "./base";
import { createCortexFactory } from "./coreFactory";

export abstract class Service<T = undefined> extends BaseService<T, typeof services, {}> {
  static initialState: any;

  constructor(...args: [any, any, any, any]) {
    super(...args);
  }
}

type UserState = {
  isLoggedIn: boolean;
};

const initialState: UserState = { isLoggedIn: false };

class UserService extends Service<UserState> {
  public static initialState = initialState;

  init(): void {}

  login() {
    this.getService("counter").increment();
    const isLoggedIn = this.state.isLoggedIn.get();
  }
}

type CountState = { count: number };
class CounterService extends Service<CountState> {
  initialState = { hello: "salut", count: 0 };
  increment() {
    this.state.count.set((count) => count + 1);
  }
}

type TroisièmeState = { lolo: string };

class TroisièmeService extends Service<TroisièmeState> {
  static initialState = { lolo: "", count: 0 };
  increment() {
    this.state.lolo.set((count) => count + 1);
  }
}

const services = {
  user: UserService,
  counter: CounterService,
  trois: TroisièmeService,
};

interface ServiceWithInitialState {
  initialState: any;
}

type GetStore<Services extends Record<string, ServiceWithInitialState>> = {
  [K in keyof Services]: Services[K]["initialState"];
};

// Type pour générer un magasin d'états à partir des services.

type Store = GetStore<typeof services>;

type G = Store["trois"]["count"];

export const Core = createCortexFactory()(services);

const c = new Core();
c.store.user.isLoggedIn.get();
c.getService("counter").increment();
const u = c.getService("counter").getState();
c.getService("counter").setState((state) => ({ count: state.count }));

export {};
