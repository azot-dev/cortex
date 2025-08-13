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

# Cortex

The full documentation is available [here](https://azot-dev.github.io/cortex/docs/intro).

## Overview

React is a library, not a framework. Cortex brings the missing architectural layer to structure your app, test business logic easily, and keep your codebase scalable, using object-oriented services and a reactive state powered by Valtio.

- **Share code** between React and React Native (or any JS framework)
- **Test** business logic directly with Jest (no UI required)
- **TDD-friendly** development
- **Clean architecture** (ports/adapters) with single-responsibility services

## Installation

```bash
npm i @azot-dev/cortex
```

React is a peerDependency. Valtio is bundled by the library.

## CLI template (recommended)

Generate a ready-to-use skeleton inside your React project:

```bash
npx @azot-dev/cortex@latest init react
```

Generated structure:

```text
cortex/
  dependencies/
    _dependencies.ts
  services/
    _services.ts
    counter.service.ts
    logger.service.ts
  setup/
    base.service.ts
    setup.ts
```

## React provider

```tsx
import { CortexProvider } from '@azot-dev/cortex'
import { createCore } from './cortex/setup/setup'

export function Root() {
  const core = createCore()
  return (
    <CortexProvider core={core}>
      <App />
    </CortexProvider>
  )
}
```

## Services and state

Services extend a base (`BaseService`) and hold a `state` object automatically made reactive via Valtio. Access other services with `this.getService('name')` and dependencies via `this.dependencies`.

```ts
// counter.service.ts
import { Service } from './cortex/setup/base.service'

type State = { count: number }

export class CounterService extends Service<State> {
  state: State = { count: 0 }

  increment() {
    this.state.count++
    this.getService('logger').log(`counter incremented: ${this.state.count}`)
  }

  decrement() {
    if (this.state.count > 0) this.state.count--
  }
}
```

Typed hook to consume a service in React:

```tsx
// from the template
import { useService } from './cortex/setup/setup'

export function CounterButton() {
  const counter = useService('counter') // exposes public methods + reactive state
  return <button onClick={counter.increment}>{counter.count}</button>
}
```

Optional initialization method executed after the core is instantiated:

```ts
export class LoggerService extends Service<{ logs: string[] }> {
  state = { logs: [] }

  init() {
    this.log('Logger initialized')
  }

  log(message: string) {
    this.state.logs.push(message)
    console.log(message)
  }
}
```

## Async hook

The library exposes a simple helper hook:

```tsx
import { useAsync } from '@azot-dev/cortex'
import { useService } from './cortex/setup/setup'

export function Shoes() {
  const api = useService('shoes')
  const { data, loading, error, refetch } = useAsync(api.load, { lazy: false })
  if (loading) return <span>Loading…</span>
  if (error) return <span>Error</span>
  return <div>{JSON.stringify(data)}</div>
}
```

## Unit tests

Test service logic directly with Jest:

```ts
import { createCore } from './cortex/setup/setup'

describe('counter', () => {
  it('increments', () => {
    const core = createCore()
    const counter = core.getService('counter')
    expect(counter.state.count).toBe(0)
    counter.increment()
    expect(counter.state.count).toBe(1)
  })
})
```


