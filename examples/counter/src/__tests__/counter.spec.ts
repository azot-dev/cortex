import { Core } from '../cortex/_core';

describe('counter', () => {
  it('should be instantiate with 0', () => {
    const core = new Core();

    expect(core.store.counter.count.get()).toBe(0);
  });

  it('should be incremented', () => {
    const core = new Core();

    core.getService('counter').increment();
    expect(core.store.counter.count.get()).toBe(1);
  });

  it('should be decremented', () => {
    const core = new Core();

    core.store.counter.count.set(2);
    core.getService('counter').decrement();
    expect(core.store.counter.count.get()).toBe(1);
  });

  it('should not be decremented under 0', () => {
    const core = new Core();

    core.getService('counter').decrement();
    expect(core.store.counter.count.get()).toBe(0);
  });
});
