---
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Setup

:::tip What You'll Learn

- How to setup a Cortex project in few minutes

:::

## Packages installation

<Tabs>
  <TabItem value="yarn" label="yarn" default>

    yarn add @azot-dev/cortex @azot-dev/react-cortex @legendapp/state

  </TabItem>
  <TabItem value="npm" label="npm" >

    npm i @azot-dev/cortex @azot-dev/react-cortex @legendapp/state

  </TabItem>
</Tabs>

## Automatic installation of the template

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

## Manual installation

If you don't want to use the basic template and want to start the project from scratch, there are few files you will need to create

### Service registry

A simple object where all the services will be registered

```ts
import { CounterService } from './counter.service';
import { LoginService } from './login.service';

export const services = {
  counter: CounterService,
  login: LoginService,
};
```

### Cortex factory

```ts
export const Core = createCortexFactory()(services);
```

You can inject your dependencies in the services if you use clean architecture

```ts
export const Core = createCortexFactory<Dependencies>()(services);
```

### Service class

Each service has to extend from this typed class, it provides a very strong types for the services

```ts
export abstract class Service<T = any> extends BaseService<
  T,
  typeof services,
  Dependencies
> {
  constructor(...args: [any, any, any]) {
    super(...args);
  }
}
```

### Typed hooks

```ts
import { createCortexHooks } from '@azot-dev/react-cortex';

export const {
  useAppSelector,
  useLazyMethod,
  useMethod,
  useService,
  useStore,
} = createCortexHooks<typeof services>();
```