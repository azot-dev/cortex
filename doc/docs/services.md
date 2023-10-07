---
sidebar_position: 4
---

# Services

A service can access to:

- any other service
- the store
- the dependencies

```ts
export class RandomService extends Service {
  async anyMethod() {
    this.store.something.get()
    this.store.something.set("something)

    this.getService("otherService").doSomethingElse() // <= doSomethingElse is a method of otherService
    
    await this.dependencies.userApi.getMe()
  }
}
```

## init()

You can write an init method that will be executed right after the core is instantiated
It is the perfect place to listen to some parts of the store that have been changed

```ts
export class RandomService extends Service {
  init() {
    // this method will be executed right after the core is instantiated
    this.store.user.onChange(this.listenerMethod)
  }

  listenerMethod() {
    // do something
  }
}
```
