---
sidebar_position: 3
---

# Basic example

The classic example of a counter

:::tip What You'll Learn

- How to create a simple service and bind it to your React app

:::

:::info Prerequisites

- Familiarity with [Typescript](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- Familiarity with [Typescript class syntax](https://www.typescriptlang.org/docs/handbook/classes.html)

:::

## The service

### Create the new service

First we create the file `counter.service.ts`

The created service must extend `Service` which has been auto-generated in the setup step

```ts
export class CounterService extends Service {

}
```

### Service state

Each service has a local state, it is referenced as initialState which must be static

Pass the `State` type to the extended Service as `Service<State>`

```ts
// highlight-next-line
type State = { count: number };

export class CounterService extends Service<State> {
// highlight-next-line
  static initialState: State = { count: 0 };
}
```

### Append a method

Each method has access to the local state as an observable

To access a local state use its method `get`

To modify a local state use its method `set`

```ts
type State = { count: number };

export class CounterService extends Service<State> {
  static initialState: State = { count: 0 };

// highlight-start
  increment() {
    this.state.count.set((count) => count + 1);
  }
 // highlight-end
}
```

### Register the service

In the file `_services`

```ts
// highlight-next-line
import { CounterService } from './counter.service';

export const services = {
// highlight-next-line
  counter: CounterService,
};
```

### Wrap the App with the CortexProvider

```tsx
 {/* highlight-next-line */}
 <CortexProvider coreInstance={new Core()}>
    <App />
{/* highlight-next-line */}
 </CortexProvider> 
```

### Use the methods in the app

Use the hook `useService` with the name of the service, here `counter`

You can access any method by destructuring this hook return value, and use it in the JSX

```tsx
const InnerApp: FC = () => {
{/* highlight-next-line */}
  const { increment } = useService('counter');

  return (
    <div>
    {/* highlight-next-line */}
        <button onClick={increment}>increment counter value</button> 
    </div>
  );
};
```

### Access the state in the app

You can access to any value thanks to the useAppSelector, anytime the value `store.counter.count` changes, the value will be re-rendered in the JSX

```tsx
const InnerApp: FC = () => {
  const { increment } = useService('counter');
  {/* highlight-next-line */}
  const count = useAppSelector((store) => store.counter.count.get());  

  return (
    <div>
        <button onClick={increment}>+</button>
{/* highlight-next-line */}
        <span>{count}</span> 
    </div>
  );
};
```

### Test the behavior

Since all the logic is completely decoupled from React, we can test the behavior of our app with Jest

```typescript
describe('counter', () => {
  it('should be incremented', () => {
    const core = new Core()

    expect(core.store.counter.get()).toBe(0)

    core.getService("counter").increment()
    expect(core.store.counter.get()).toBe(1)
  })
}) 
```
