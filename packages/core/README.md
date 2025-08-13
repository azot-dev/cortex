<p align="center">
  <a href="https://azot-dev.github.io/cortex/docs/intro" target="blank"><img src="https://raw.githubusercontent.com/azot-dev/cortex/main/logo/logo_128.png" width="120" alt="Cortex Logo" /></a>
</p>

<p align="center">A React framework for building efficient and scalable applications</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@azot-dev/cortex">
    <img src="https://img.shields.io/npm/v/@azot-dev/cortex" alt="npm version">
  </a>
  <a href="https://github.com/azot-dev/cortex/actions">
    <img src="https://img.shields.io/github/actions/workflow/status/azot-dev/cortex/release.yml" alt="build state" >
  </a>
  <a href="https://www.npmjs.com/package/@azot-dev/cortex">
    <img src="https://img.shields.io/npm/dm/@azot-dev/cortex" alt="monthly downloads">
  </a>
</p>

# Cortex (core package)

This package exposes the v2 API: `Core`, `BaseService`, `CortexProvider`, `createTypedHooks`, `useAsync`.

## Installation

```bash
npm i @azot-dev/cortex
```

## Main API

```ts
import { Core, BaseService, createTypedHooks, CortexProvider, useAsync } from '@azot-dev/cortex'
```

### Core

```ts
type Registry = {
  [key: string]: new (deps: Deps) => unknown
}

const core = new Core<Registry, Deps>(deps, services)
core.getService('counter')
```

### BaseService

```ts
class MyService extends BaseService<Services, Deps, { value: number }> {
  state = { value: 0 }
  init() {}
  doSomething() { this.state.value++ }
}
```

### Typed hooks

```ts
const { useService } = createTypedHooks<Services>()
```

`useService('counter')` returns the service public methods + its reactive state (keys of `state`).

### React provider

```tsx
import { CortexProvider } from '@azot-dev/cortex'

export function Root({ core }: { core: any }) {
  return (
    <CortexProvider core={core}>
      <App />
    </CortexProvider>
  )
}
```

### Async hook

```tsx
import { useAsync } from '@azot-dev/cortex'

const { data, loading, error, refetch, reset } = useAsync(apiCall, { lazy: true })
```

## CLI template

The package includes a bootstrap CLI:

```bash
npx @azot-dev/cortex@latest init react
```

Generated structure under `cortex/`: `dependencies/`, `services/`, `setup/` with `createCore` and typed `useService`.