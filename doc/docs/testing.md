---
sidebar_position: 6
---

# Testing

No need to test your logic through the UI or using React with libraries like `react-testing-library` or `react-hook-testing-library`.

You can simply test your logic with Jest, pretty quickly and easily develop some features using test driven development (TDD)

```typescript
// counter.spec.ts

describe('counter', () => {
  let core = new Core();

  beforeEach(() => {
    core = new Core()
  })

  it('should be incremented', () => {
    expect(core.store.counter.get()).toBe(0)

    core.services.counter.increment()
    expect(core.store.counter.get()).toBe(1)

    core.services.counter.increment()
    expect(core.store.counter.get()).toBe(2)
  })

  it('should be decremented', () => {
    core.services.counter.setValue(5)

    core.services.counter.decrement()
    expect(core.store.counter.get()).toBe(4)

    core.services.counter.decrement()
    expect(core.store.counter.get()).toBe(3)
  })

  it('should not be decremented at a lower value than 0', () => {
    core.services.counter.setValue(1)

    core.services.counter.decrement()
    expect(core.store.counter.get()).toBe(0)

    core.services.counter.decrement()
    expect(core.store.counter.get()).toBe(0)
  })
}) 
```
