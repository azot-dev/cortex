---
sidebar_position: 4
---

# Services

A service can access to:

## The store

You can access the store by reading and writing on it

```ts
export class CounterService extends Service {
  async decrement() {
    const value = this.store.counter.value.get()
    if (value === 0) {
      return
    }
    this.store.counter.value.set(value - 1)
  }
}
```


## The other services

For exemple we have a todoList form, it should append the form values to a todoList,
then the form resets.

```ts
// todoForm service
export class TodoFormService extends Service {
  submit() {
    const todoListService = this.services.get('todoList') 

    todoListService.append(this.store.todoListForm.get())
    this.store.todoListForm.set(null) 
  }
}

// todoList service
export class TodoListService extends Service {
  append(todo: Todo) {
    this.store.todo.push(todo)
  }
}
```

This way each service can have a single responsibility

## The dependencies

If your app is in clean architecture and uses the port-adapter pattern, you can access any of the dependencies in any service method

```ts
export class CounterService extends Service {
  async loadShoes() {
    const shoes = await this.dependencies.shoesApi.get() // a call api encapsulated in a dependency
    this.store.shoes.set(shoes)
  }
}
```


## init()

You can write an init method that will be executed right after the core is instantiated
It is the perfect place to listen to some parts of the store that have been changed

```ts
export class MessageService extends Service {
  init() {
    this.dependencies.notifications.onReceive(this.onReceive)
  }

  onReceive(notificationReceived: string) {
    this.store.messages.push(notificationReceived)
  }
}
```
