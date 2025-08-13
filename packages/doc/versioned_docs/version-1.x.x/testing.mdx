---
sidebar_position: 6
---

# Testing

No need to test your logic through the UI or using React with libraries like `react-testing-library` or `react-hook-testing-library`.

You can simply test your logic with Jest, pretty quickly and easily develop some features using test driven development (TDD)

```typescript
// counter.spec.ts

describe('counter', () => {
  let core: InstanceType<typeof Core>;
  let service: InstanceType<typeof CounterService>;

  beforeEach(() => {
    core = new Core();
    service = core.getService('counter');
  });


  it('should be incremented', () => {
    expect(core.store.counter.get()).toBe(0)

    service.increment()
    expect(core.store.counter.get()).toBe(1)

    service.increment()
    expect(core.store.counter.get()).toBe(2)
  })

  it('should be decremented', () => {
    service.setValue(5)

    service.decrement()
    expect(core.store.counter.get()).toBe(4)

    service.decrement()
    expect(core.store.counter.get()).toBe(3)
  })

  it('should not be decremented at a lower value than 0', () => {
    service.setValue(1)

    service.decrement()
    expect(core.store.counter.get()).toBe(0)

    service.decrement()
    expect(core.store.counter.get()).toBe(0)
  })
}) 
```
