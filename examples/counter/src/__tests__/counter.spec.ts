import { Core } from '../cortex/_core';

describe('counter', () => {
  it('should be decremented', () => {
    const core = new Core();

    expect(core.store.counter.count.get()).toBe(0);
    core.getService('counter').decrement();
    expect(core.store.counter.count.get()).toBe(-1);
  });

  it('should be incremented', () => {
    const core = new Core();

    expect(core.store.counter.count.get()).toBe(0);
    core.getService('counter').increment();
    expect(core.store.counter.count.get()).toBe(1);
  });
});
