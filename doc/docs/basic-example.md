---
sidebar_position: 3
---

# Basic example

The classic example of a counter

## The service

### File

First we create the file `counter.service.ts`

### Create and bind the service

The created service must extend `Service` which has been auto-generated in the setup step

```ts
import { Service } from '../utils/service';

export class CounterService extends Service {

}
```

### Service state

Each service has a local state, it is referenced as initialState which must be static
Pass the `State` type to the extended Service as `Service<State>`

```ts
type State = { count: number }; // highlight-line

export class CounterService extends Service<State> {
  static initialState: State = { count: 0 }; // highlight-line
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

  increment() { // highlight-line
    this.state.count.set((count) => count + 1); // highlight-line
  } // highlight-line
}
```

### Register the service

In the file `_services`

```ts
import { CounterService } from './counter.service'; // highlight-line

export const services = {
  counter: CounterService, // highlight-line
};
```

### Wrap the App with the CortexProvider

```tsx
 <CortexProvider coreInstance={new Core()}> {/* highlight-line */}
    <App />
 </CortexProvider> {/* highlight-line */}
```

### Use the methods in the app

Use the hook `useService` with the name of the service, here `counter`
You can access any method by destructuring this hook return value, and use it in the JSX

```tsx
const InnerApp: FC = () => {
  const { increment } = useService('counter'); {/* highlight-line */}

  return (
    <div>
        <button onClick={increment}>increment counter value</button> {/* highlight-line */}
    </div>
  );
};
```

### Access the state in the app

You can access to any value thanks to the useAppSelector, anytime the value `store.counter.count` changes, the value will be re-rendered in the JSX

```tsx
const InnerApp: FC = () => {
  const { increment } = useService('counter');
  const count = useAppSelector((store) => store.counter.count.get());  {/* highlight-line */}

  return (
    <div>
        <button onClick={increment}>+</button>

        <span>{count}</span> {/* highlight-line */}
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

    core.services.counter.increment()
    expect(core.store.counter.get()).toBe(1)
  })
}) 
```
