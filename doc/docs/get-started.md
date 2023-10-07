---
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';



# Get started

## Automatic installation

In the folder you want to instantiate cortex (inside your React project)

```bash
    npx @azot-dev/cortex init react
```

## Manual Installation

<Tabs>
  <TabItem value="yarn" label="yarn" default>

    yarn add @azot-dev/cortex @azot-dev/react-cortex @legendapp/state

  </TabItem>
  <TabItem value="npm" label="npm" >

    npm i @azot-dev/cortex @azot-dev/react-cortex @legendapp/state

  </TabItem>
</Tabs>

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
import { BaseService } from '@azot-dev/cortex';
import { DependenciesType, Services, StoreType } from './types';

export abstract class Service extends BaseService<
  Services,
  Observable<StoreType>,
  DependenciesType
> {
  constructor(
    store: Observable<StoreType>,
    dependencies: Partial<DependenciesType>,
    serviceRegistry: any
  ) {
    super(store, dependencies, serviceRegistry);
  }
}
```  

### The core

```typescript
// core/_core.ts

import { createCoreFactory } from '@azot-dev/cortex';
import { services } from './services/_services';
import { store } from './store/_store';
import { Dependencies } from './utils/types';

export const Core = createCoreFactory<DependenciesType>()(store, services);
```

### The hooks

```typescript
// core/utils/hooks.ts

import {
  createSelectorHook,
  createServiceHook,
} from '@azot-dev/cortex';
import { Core } from '../_core';
import { Store, Services } from './utils/types';

export const useAppSelector = createSelectorHook<Store>();
export const useAppService = createServiceHook<Services>();

```

### React

```tsx
// react/App.tsx

import React from 'react';
import {
  XCoreProvider,
} from '@azot-dev/react-cortex';
import { Core } from '.';

const App = () => {
  const userService = useAppService('user');
  const user = useAppSelector((state) => state.user);
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
