# XCore

Some things are still missing, like a correct documentation, don't hesitate to create issues if you have any problem
PR welcome :)
## Purpose

React is a library not a framework, it has been created to reflect the changes of some variables (the states) to the UI, nothing else.
x-core comes as the missing brick of React, and will give all the keys to create the perfect architecture of your app, keeping your code readable and your app scalable.


With this you could:
- share your code between React and React Native (and any other JS framework)
- test your logic directly with Jest (no more react-testing-library to test your data over your UI)
- code in test driven development (TDD)
- create a clean architecture with the port/adapter pattern
- keep each part of your logic well separated thanks to services

All of that using oriented object programming!
It is the perfect lib for creating a strong scalable app

## Road map

- create the documentations with examples

## Usage

### Getting started

#### Installation
```sh
yarn add @azot-dev/x-core @legendapp/state
```

or 

```sh
npm i @azot-dev/x-core @legendapp/state
```

#### Setup

##### Create your store
```typescript

export type StoreType = {
  user: {
    firstName: string;
    lastName: string;
  },
  settings: {
    theme: 'dark' | 'light',
  },
};

export const store = {
  user: {
    firstName: 'John',
    lastName: 'Doe',
  },
  settings: {
    theme: 'dark',
  },
};

```

##### Create your dependencies interface
```typescript
export interface DependenciesType {}
```
dependencies is a more advanced notion in clean architecture, we don't need it for a basic example

##### Create your Service class
```typescript
export abstract class Service extends BaseService<
  typeof services,
  Observable<StoreType>,
  DependenciesType
> {
  constructor(
    store: Observable<StoreType>,
    dependencies: Partial<DependenciesType>
  ) {
    super(store, dependencies);
  }
}
```
That is the most important part of the setup for making sure you will have the strongest typing in the services you will create later

### Usage

#### Basic Example
```typescript
const myStore = {
  user: {
    firstName: 'John',
    lastName: 'Doe',
  },
};

class UserService extends Service {
  changeFirstName(firstName: string) {
    this.store.user.firstName.set(firstName);
  }
  
  changeLastName(lastName: string) {
    this.store.user.lastName.set(lastName);
  }
}

const services = {
  user: UserService,
};

const CoreClass = createCoreFactory<{}>()(myStore, services);

const core = new CoreClass();

core.getService('user').changeLastname('Snow');
const user = core.store.user.get()

console.log(user)
// { fistName: "John", lastName: "Snow"}
```
Every change will be reflected on React

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

## License
MIT
