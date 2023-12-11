---
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';



# Setup

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