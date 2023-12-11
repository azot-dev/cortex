---
sidebar_position: 4
---

# Services

A service can access to:

## State

You can access the local state by reading and writing on it

In this example the counter is decremented only if it is not 0

```ts
type State = { count: number };

export class CounterService extends Service<State> {
  static initialState: State = { count: 0 };

  async decrement() {
    const value = this.state.count.get()
    if (value === 0) {
      return
    }
    this.state.count.set(value - 1)
  }
}
```

## Access to the other services

For exemple we have a todoList form, it should append the form values to a todoList,
then the form resets.

The `submit` method of  `TodoFormService` calls the method `append` of `TodoListService`

```ts
// todoForm service

type Form = { name: string };

type TodoFormState = Form;
export class TodoFormService extends Service<TodoFormState> {
  static initialState: TodoFormState = { name: '' };

  submit() {
    const todoListService = this.services.get('todoList');

    todoListService.append(this.state.get());
    this.state.name.set('') ;
  }
}

// todoList service
type TodoListState = Form[];
export class TodoListService extends Service {
  static initialState: TodoListService = [];

  append(todo: Todo) {
    this.state.push(todo)
  }
}
```

This way each service can have a single responsibility

## The dependencies

If your app is in clean architecture and uses the port-adapter pattern, you can access any of the dependencies in any service method

```ts
type State = Shoes[];

export class CounterService extends Service<State> {
  static initialState: State = [];

  async loadShoes() {
    const shoes = await this.dependencies.shoesApi.get() // an api call encapsulated in a dependency
    this.state.set(shoes)
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
