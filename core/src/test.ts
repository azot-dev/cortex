import { BaseService } from './base';
import { createCortexFactory } from './coreFactory';

export abstract class Service<T = any> extends BaseService<T, typeof services, {}> {
  protected initialState?: T;
  protected init?: () => void;
  constructor(...args: [any, any, any]) {
    super(...args);
  }
}

type State = {
  isLoggedIn: boolean;
};

class UserService extends Service<State> {
  static initialState: State = {
    isLoggedIn: false,
  };

  login() {
    this.getService('counter').increment();
    const isLoggedIn = this.state.isLoggedIn.get();
  }
}

class CounterService extends Service {
  static initialState = {
    count: 0,
  };

  increment() {}
}

class RienService extends Service {}

const services = {
  user: UserService,
  counter: CounterService,
  rien: RienService,
};

export const Core = createCortexFactory()(services);

const c = new Core();
c.store.user.isLoggedIn.get();
c.getService('counter').increment();
