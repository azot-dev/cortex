import { BaseService } from './base';
import { createCortexFactory } from './coreFactory';

export abstract class Service<T = undefined> extends BaseService<T, typeof services, {}> {
  constructor(...args: [any, any, any]) {
    super(...args);
  }
}

type State = {
  isLoggedIn: boolean;
};

class UserService extends Service<State> {
  initialState = { isLoggedIn: false };
  static initialState: State = {
    isLoggedIn: false,
  };

  login() {
    this.getService('counter').increment();
    const isLoggedIn = this.state.isLoggedIn.get();
  }
}

type CountState = { count: number };
class CounterService extends Service<CountState> {
  initialState = { hello: 'salut', count: 0 };
  init?: (() => void) | undefined;
  increment() {
    this.state.count.set((count) => count + 1);
  }
}

const services = {
  user: UserService,
  counter: CounterService,
};

export const Core = createCortexFactory()(services);

const c = new Core();
c.store.user.isLoggedIn.get();
c.getService('counter').increment();
