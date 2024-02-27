# Cortex

## Overview

React is a library not a framework, it has been created to reflect the changes of some variables (the states) to the UI, nothing else.
Cortex comes as the missing brick of React, and will give all the keys to create the perfect architecture of your app, keeping your code readable and your app scalable.

With this you could:

- share your code between React and React Native (and any other JS framework)
- test your logic directly with Jest (no more react-testing-library to test your data over the UI)
- code in test driven development (TDD)
- create a clean architecture with the port/adapter pattern
- keep each part of your logic well separated thanks to services

All of that using oriented object programming!

## Setup

### Installation

```bash
npm i @azot-dev/cortex @azot-dev/react-cortex @legendapp/state
```

### Automatic installation of the template

In the folder you want to instantiate cortex (inside your React project)
It will install a basic template of the Cortex structure, you can then modify it as you wish

```bash
npx @azot-dev/cortex@latest init react
```

The structure installed with the above command line

```sh
├── cortex
│ ├── dependencies
│ │   ├── _dependencies.ts
│ ├── services
│ │   ├── _services.ts
│ │   └── counter.service.ts
│ ├── utils
│ │  ├── service.ts
│ │  ├── hooks.ts
│ │  └── types.ts
│ ├── _core.ts
```

Then wrap your root component with the Cortex provider:

```tsx
const App = () => {
  return (
    <CortexProvider coreInstance={new Core()}>
      <App />
    </CortexProvider>
  );
};
```

## Services

A service can access to:

### State

You can access the local state by reading and writing on it

In this example the counter is decremented only if it is not 0

```ts
type State = { count: number };

export class CounterService extends Service<State> {
  static initialState: State = { count: 0 };

  async decrement() {
    const value = this.state.count.get()
    if (value === 0) {
      return
    }
    this.state.count.set(value - 1)
  }
}
```

### Access to the other services

For example we have a todoList form, it should append the form values to a todoList,
then the form resets.

The `submit` method of  `TodoFormService` calls the method `append` of `TodoListService`

```ts
type Form = { name: string };

type TodoFormState = Form;
export class TodoFormService extends Service<TodoFormState> {
  static initialState: TodoFormState = { name: '' };

  submit() {
    // highlight-next-line
    const todoListService = this.services.get('todoList');
    // highlight-next-line
    todoListService.append(this.state.get());

    this.state.name.set('');
  }
}
```

This way each service can have a single responsibility

### init()

You can write an init method that will be executed right after the core is instantiated
It is the perfect place to listen to some parts of the store that have been changed

```ts
export class MessageService extends Service {
  init() {
    this.dependencies.notifications.onReceive(this.onReceive)
  }

  onReceive(notificationReceived: string) {
    this.store.messages.push(notificationReceived)
  }
}
```

## Store

The store is based on [legend app state](https://legendapp.com/open-source/state/)

The most you have to know is that every node of your store can be modified using `set()` and accessed using `get()`.

Each service has a local state accessible from itself

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

The global store is accessible using the instantiated Cortex object

```ts
const core = new Core()

const count = core.counter.count.get()
```

## Testing

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

## Hooks

### useAppSelector

Access to the store and return the processed value you want

```tsx
  const counter = useAppSelector((store) => store.counter.get()) 
```

### useStore

Access to the store

```tsx
  const store = useStore();
  const counter = store.counter.get()
```

### useService

Access to services

```tsx
  const counterService = useService('counter')

  return (
    <button onClick={() => counterService.increment()}>increment</button>
  )
```

### useMethod

Useful for async services, it returns the state of the promise
and executes automatically when the component where it is encapsulated first renders

It is similar to the `react-query` and `apollo-graphql` hooks behavior
but since the complete async logic will be encapsulated in one service method, no need to listen in a useEffect or a useMemo a query to finish, the useMethod just wraps a complete use case and generates the data useful for the UI (in most of the cases no need to store a isLoading boolean in the store)

```tsx
export const ShoesComponent = () => {
const shoesService = useService('shoes')
const {
  isLoading,
  isError,
  isSuccess,
  isCalled,
  error,
  call,
  data,
} = useMethod(shoesService.load)

if (!isCalled || !isLoading) {
  return <Loader>
}

if (isError) {
  return <span>An error occured</span>
}

return <Shoes data={data}>
}
```

### useLazyMethod

Same behavior as useMethod excepts it is not called when the component first renders

```tsx
export const LoginComponent = () => {
const shoesService = useService('auth')
const {
  isLoading,
  isError,
  isSuccess,
  isCalled,
  error,
  call: login,
  data,
} = useLazyMethod(authService.login)

if (!isCalled || !isLoading) {
  return <Loader>
}

return <button onClick={login}>login</button>
}
```

