# XCore

This package is not ready to use yet, some things are still missing, like a correct documentation, some hooks, don't hesitate to create issues if you have any problem
PR welcome :)
## Purpose

React is a library not a framework, it has been created to reflect the changes of some variables (the states) to the UI, nothing else.
x-core comes as the missing brick of React, and will give all the keys to create the perfect architecture of your app, keeping your code readable and your app scalable.

With this you could:

- share your code between React and React Native (and any other JS framework)
- test your logic directly with Jest (no more react-testing-library to test your data over the UI)
- code in test driven development (TDD)
- create a clean architecture with the port/adapter pattern
- keep each part of your logic well separated thanks to services

All of that using oriented object programming!

### Getting started

#### Installation
```sh
yarn add @azot-dev/x-core @legendapp/state
```

or 

```sh
npm i @azot-dev/x-core @legendapp/state
```


### Usage

#### Basic Example

```typescript
const myStore = {
  counter: 0,
};

class CounterService extends Service {
  increment() {
    this.store.counter.set(counter => counter + 1);
  }
  
  decrement() {
    this.store.counter.set(counter => counter === 0 ? 0 : counter - 1);
  }

  setValue(value: number) {
    this.store.counter.set(value)
  }
}

const services = {
  counter: CounterService,
};

const Core = createCoreFactory<{}>()(myStore, services);

// in App.tsx

const App = () => {
  const counter = useAppSelector((state) => state.counter);
  const { increment, decrement } = useAppService('counter');
  
  return (
    <button onClick={() => increment()}> - </button>
    <div>{counter}</div>
    <button onClick={() => decrement()}> + </button>
  );
};

const AppWrapper = () => {
  return (
    <XCoreProvider coreInstance={new Core()}>
      <App />
    </XCoreProvider>
  );
};

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

#### Setup

##### Create your store
```typescript

export type Store = {
  user: {
    firstName: string;
    lastName: string;
  },
  settings: {
    theme: 'dark' | 'light',
  },
};

export const store: Store = {
  user: {
    firstName: 'John',
    lastName: 'Doe',
  },
  settings: {
    theme: 'dark',
  },
};

```

##### Create the dependencies interface
```typescript
export interface Dependencies {}
```
dependencies is a more advanced notion in clean architecture, we don't need it for a basic example

##### Create the Service class
```typescript
export abstract class Service extends BaseService<
  typeof services,
  Observable<Store>,
  Dependencies
> {
  constructor(
    store: Observable<Store>,
    dependencies: Partial<Dependencies>
  ) {
    super(store, dependencies);
  }
}
```
That is the most important part of the setup for making sure you will have the strongest typing in the services you will create later

##### Declare the services
```typescript
export abstract class Service extends BaseService<
  typeof services,
  Observable<Store>,
  Dependencies
> {
  constructor(
    store: Observable<Store>,
    dependencies: Partial<Dependencies>
  ) {
    super(store, dependencies);
  }
}
```

##### Create the core
```typescript
export abstract class Service extends BaseService<
  typeof services,
  Observable<Store>,
  Dependencies
> {
  constructor(
    store: Observable<Store>,
    dependencies: Partial<Dependencies>
  ) {
    super(store, dependencies);
  }
}
```


#### Call a service from another service
```typescript
const myStore = {
  user: {
    firstName: 'John',
    lastName: 'Doe',
  },
  settings: {
      hasChangedName: false
  }
};

class SettingsService extends Service {
  notifyHasChangedName() {
    this.store.settings.hasChangedName.set(true);
  }
}

class UserService extends Service {
  changeFirstName(firstName: string) {
    this.store.user.firstName.set(firstName);
    this.getService("settings").notifyHasChangedName();
  }
}

const services = {
  user: UserService,
  settings: SettingsService,
};

const CoreClass = createCoreFactory<{}>()(myStore, services);

const core = new CoreClass();

core.getService('user').changeLastname('Snow');
const user = core.store.user.get()

console.log(user)
// { fistName: "John", lastName: "Snow"}
console.log(core.store.settings.hasChangedName.get())
// true
```

### File structure
### The store
### The services
### The dependencies
### Write tests
### Usage with React

## Examples


### Todo list
### authentication form

## Road map

- finish the documentations
- create the useAppSelector hook
- create the provider
- create the useAsyncUseCase const {isLoading, isError, isSuccess} = useAsyncUseCase((services) => services.user.login)
- create a docusaurus website with complete examples



## License
MIT
