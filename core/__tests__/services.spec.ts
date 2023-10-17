import { BaseService, createCortexFactory } from '../src';

const store = { user: { name: 'John', age: 28 } };

class UserService extends BaseService<any, any, any> {
  changeName(newName: string) {
    this.store.user.name.set(newName);
  }

  getName() {
    return this.store.user.name.get();
  }
}

class OtherService extends BaseService<any, any, any> {
  changeName(newName: string) {
    this.getService('user').changeName(newName);
  }
}

const Cortex = createCortexFactory<{}>()(store, {
  user: UserService,
  other: OtherService,
});

describe('core', () => {
  let core = new Cortex();
  beforeEach(() => {
    core = new Cortex();
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
