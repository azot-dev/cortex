import { BaseService, createCortexFactory } from '../src';

class UserService extends BaseService<any, any, any> {
  static initialState = { name: 'John', age: 28 };

  changeName(newName: string) {
    this.state.name.set(newName);
  }

  getName() {
    return this.state.name.get();
  }
}

class OtherService extends BaseService<any, any, any> {
  changeName(newName: string) {
    this.getService('user').changeName(newName);
  }
}

const Cortex = createCortexFactory()({
  user: UserService,
  other: OtherService,
});

describe('core', () => {
  let core = new Cortex();
  beforeEach(() => {
    core = new Cortex();
  });

  it('should instanciate its store slice', () => {
    const name = core.getService('user').getName();
    expect(name).not.toBeUndefined();
  });

  it('should access the store', () => {
    const name = core.getService('user').getName();
    expect(name).toBe('John');
  });

  it('should modify the store', () => {
    core.getService('user').changeName('Max');
    const name = core.getService('user').getName();
    expect(name).toBe('Max');
  });

  it('should call another service method', () => {
    core.getService('other').changeName('David');
    const userName = core.store.user.name.get();
    expect(userName).toBe('David');
  });
});
