# XCore

The package is not ready to use yet, some things are still missing, like a correct documentation.
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

#### Call a service from another one
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
