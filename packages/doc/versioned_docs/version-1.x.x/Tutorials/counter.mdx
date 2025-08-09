---
sidebar_position: 1
---

# Counter

Test Driven Development is a a concept quite easy to understand in theory but hard to practice, even more in front end development.
It requires a good architecture for testing the use cases and not the implementations, otherwise we would change the tests each time we change the code and make the tests almost impossible to maintain

:::tip What You'll Learn

- Create a service
- Test a service with Jest
- Code any feature with test driven development (TDD)

:::

:::info Prerequisites

- Setup [Jest](https://kulshekhar.github.io/ts-jest/docs/getting-started/installation/) with Typescript on your project

:::

This will be done with a simple counter to be more focused on test driven development.

<iframe 
    src="https://t7w33f-5173.csb.app/"
    style={{ width: "100%", height: "500px", border: "0", borderRadius: "4px", overflow: "hidden" }}
    title="frosty-surf-4kp6v2"
    allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

[![Edit frosty-surf-4kp6v2](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/devbox/github/azot-dev/cortex/tree/main/examples/counter?embed=1&file=%2Fsrc%2Fcortex%2Fservices%2Fcounter.service.ts)

## Introduction to TDD

Test-Driven Development (TDD) is a software development process that relies on a short, repetitive development cycle

It's a method where you write a test for a piece of functionality before you write the code to implement it

Test driven development is made of 3 steps:

### - Add a test

Before you write the functional code, you write a test for the new functionality. This test will initially fail, as the functionality has not been implemented yet.

### - Write the code

Write the minimal amount of code necessary to make the test pass. This often means the code is not perfect and might need refactoring later.

### - Refactor

Look at your code and consider if it can be cleaned up. Refactoring is about making the code cleaner and more maintainable without changing its functionality. You can refactor with confidence because you know you have tests that will alert you if you break something.

## Counter example

### Increment

#### Add a test

```typescript title="src/__tests__/counter.spec.ts"
import { Core } from '../cortex/_core';

describe('counter', () => {
  it('should be instantiate with 0', () => {
    const core = new Core();

    expect(core.store.counter.count.get()).toBe(0);
  })
});
```

:::info

The `Core` is the same that is injected in the `CortexProvider` in `main.tsx` so we can test it independently from React and be sure that the changes will be reflected on the UI

:::

We expect first that the initialState of the counter will be 0,
The test cannot run because the service doesn't exist yet

#### Write the service

```typescript title="src/cortex/services/counter.service.ts"
type State = {
  count: number;
};

export class CounterService extends Service<State> {
  static initialState: State = {
    count: 0,
  };
}
```

After running the test, it should succeed

#### Testing the increment

We want to create a method that will increment the counter when called

Let's write it empty and follow by writing the test, so the test can run and fail

```typescript title="src/cortex/services/counter.service.ts"
type State = {
  count: number;
};

export class CounterService extends Service<State> {
  static initialState: State = {
    count: 0,
  };

  increment() {}
}
```

```typescript title="src/__tests__/counter.spec.ts"
import { Core } from '../cortex/_core';

describe('counter', () => {
  it('should be incremented', () => {
    const core = new Core();

    core.getService('counter').increment();
    expect(core.store.counter.count.get()).toBe(1);
  });
});
```

After running this test it should fail because the counter stays at 0

Let's write the minimum code to make it work

```typescript title="src/cortex/services/counter.service.ts"
type State = {
  count: number;
};

export class CounterService extends Service<State> {
  static initialState: State = {
    count: 0,
  };

  increment() {
    // highlight-next-line
    const count = this.state.count.get()
    // highlight-next-line
    this.state.count.set(count + 1);
  }
}
```

#### Refactor

There is not much to refactor in this simple example, but if we look closer to the [the legend app state lib](https://legendapp.com/open-source/state/), we can see that `set` can take a callback with the previous state as parameter

```typescript title="src/cortex/services/counter.service.ts"
type State = {
  count: number;
};

export class CounterService extends Service<State> {
  static initialState: State = {
    count: 0,
  };

  increment() {
    // highlight-next-line
    this.state.count.set((count) => count + 1);
  }
}
```

If we re-run the test, everything should pass like previously

### Decrement

#### Write the test

We can do the same with decrement:

```typescript title="src/__tests__/counter.spec.ts"
import { Core } from '../cortex/_core';

describe('counter', () => {
  it('should be incremented', () => {
    const core = new Core();

    expect(core.store.counter.count.get()).toBe(0);
    core.getService('counter').increment();
    expect(core.store.counter.count.get()).toBe(1);
  });

  it('should be decremented', () => {
    const core = new Core();

    expect(core.store.counter.count.get()).toBe(0);
    core.getService('counter').decrement();
    expect(core.store.counter.count.get()).toBe(-1);
  });
});
```

The test doesn't pass as expected

#### Write the code

```typescript title="src/cortex/services/counter.service.ts"
type State = {
  count: number;
};

export class CounterService extends Service<State> {
  static initialState: State = {
    count: 0,
  };

  increment() {
    this.state.count.set((count) => count + 1);
  }

  decrement() {
    // highlight-next-line
    this.state.count.set((count) => count - 1);
  }
}
```

The test should pass now

### A new use case

#### Modify the tests

Now we want the counter not to be decremented under 0

Our last only decrement test is not working for our use case since it tests if the counter goes under 0, we have to re-write it.
So we instantiate the counter at 5 and expect it to be at 4 after calling the decrement service

```typescript title="src/__tests__/counter.spec.ts"
  it('should be decremented', () => {
    const core = new Core();

    core.store.counter.count.set(5)
    core.getService('counter').decrement();
    expect(core.store.counter.count.get()).toBe(4);
  });
```

We can now write the second test

```typescript title="src/__tests__/counter.spec.ts"
  it('should not be decremented under 0', () => {
    const core = new Core();

    core.getService('counter').decrement();
    expect(core.store.counter.count.get()).toBe(0);
  });
```

Here the counter is at its initial state 0 and should stay at 0 if it is decremented

#### Write the code

```typescript title="src/cortex/services/counter.service.ts"
type State = {
  count: number;
};

export class CounterService extends Service<State> {
  static initialState: State = {
    count: 0,
  };

  increment() {
    this.state.count.set((count) => count + 1);
  }

  decrement() {
    // highlight-next-line
    if (this.state.count.get() !== 0) {
      this.state.count.set((count) => count - 1);
    // highlight-next-line
    }
  }
}
```

## Conclusion

We learned to use TDD to append new features
If we want any other feature, we just have to write an explicit test before writing its code
