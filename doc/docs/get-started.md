---
sidebar_position: 2
---

# Get Started

Let's discover **Docusaurus in less than 5 minutes**.

## Installation

```bash
yarn add @azot-dev/x-core @legendapp/state
```
or

```bash
npm i @azot-dev/x-core @legendapp/state
```

## File tree structure example

You can use any file tree structure you want, however I give one to get started

```sh
├── core
│ ├── dependencies
│ ├── services
│ │   ├── _services.ts
│ │   └── user.service.ts
│ ├── store
│ │   ├── _store.ts
│ │   └── user.store.ts
│ ├── utils
│ │  ├── service.ts
│ │  ├── hooks.ts
│ │  └── types.ts
│ ├── _core.ts
└── react
   └── App.tsx

```

I use the underscore _ in some file names to keep them on top of their folder

## Setup

### The Store

```typescript
// core/store/user.store.ts

type UserStore = {
  firstName: string | null
  lastName: string | null
}

export const userStore: UserStore = {
  firstName: null,
  lastName: null,
}

```  

```typescript
// core/store/_store.ts

export const store = {
  user: UserStore,
};

```  

### The Services

```typescript
// core/services/user-service.ts

import { Service } from '../utils/service';

export class UserService extends Service {
  changeName(firstName: string, lastName: string) {
    this.store.user.firstName.set(firstName);
    this.store.user.lastName.set(firstName);
  }
}

```  

```typescript
// core/_services.ts

import { UserService } from './user.service';

export const services = {
  user: UserService,
};

```

### Types

```typescript
// core/utils/types.ts

import { services } from '../services/_services';
import { store } from '../store/_store';

export type StoreType = typeof store;

export type Dependencies = {}

export type Services = typeof services;

```

### The Service class

As you can see, the Service class does not exist yet, it is the most important brick of the app in order to get strong typing and get it to work
It is the only "magic" piece of code to copy paste, Unfortunately I could not create a factory for this because of circular dependencies, so if anyone can figure out how to move that piece of code in the library, PR welcome :)

```typescript
// core/utils/service.ts

import { Observable } from '@legendapp/state';
import { BaseService } from '@azot-dev/x-core';
import { DependenciesType, Services, StoreType } from './types';

export abstract class Service extends BaseService<
  Services,
  Observable<StoreType>,
  Dependencies
> {
  constructor(
    store: Observable<StoreType>,
    dependencies: Partial<Dependencies>
  ) {
    super(store, dependencies);
  }
}
```  

### The core

```typescript
// core/_core.ts

import { createCoreFactory } from '../lib/coreFactory';
import { services } from './services/_services';
import { store } from './store/_store';
import { DependenciesType } from './utils/types';

export const CoreClass = createCoreFactory<DependenciesType>()(store, services);
```

### The hooks

```typescript
// core/utils/hooks.ts

import {
  createAppSelector,
  createAppService,
} from '@azot-dev/x-core';
import { Core } from '../_core';

const useAppSelector = createAppSelector<InstanceType<typeof Core>>();
const useAppService = createAppService<InstanceType<typeof Core>>();

```

### React

```typescript
// react/App.tsx

import React from 'react';
import {
  XCoreProvider,
} from '@azot-dev/x-core';
import { CoreClass } from '.';

const App = () => {
  const userService = useMyAppService('user');
  const user = useMyAppSelector((state) => state.user);
  return (
    <div>
      <div>fist name: {user.firstName}</div>
      <div>last name: {user.lastName}</div>
      <button onClick={() => userService.changeName('John', 'Doe')}>change name</button>
    </div>
  );
};

const AppWrapper = () => {
  return (
    <XCoreProvider coreInstance={new Core()}>
      <App />
    </XCoreProvider>
  );
};
```
