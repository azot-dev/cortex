import { BaseService, createCortexFactory } from '../src';

const store = { user: { name: 'John', age: 28 } };

class UserService extends BaseService<any, any, any> {
  changeName(newName: string) {
    this.store.user.name.set(newName);
  }
}

const Cortex = createCortexFactory<{}>()(store, { user: UserService });

describe('core', () => {
  let core = new Cortex();
  beforeEach(() => {
    core = new Cortex();
  });

  it('should access the store', () => {
    const userName = core.store.user.name.get();
    expect(userName).toBe('John');
  });

  it('should modify the store', () => {
    core.store.user.name.set('David');
    const userName = core.store.user.name.get();
    expect(userName).toBe('David');
  });

  it('should call the services methods', () => {
    core.getService('user').changeName('Max');
    const userName = core.store.user.name.get();
    expect(userName).toBe('Max');
  });
});
