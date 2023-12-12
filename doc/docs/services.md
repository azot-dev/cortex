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
type Form = { name: string };

type TodoFormState = Form;
export class TodoFormService extends Service<TodoFormState> {
  static initialState: TodoFormState = { name: '' };

  submit() {
    // highlight-next-line
    const todoListService = this.services.get('todoList');
    // highlight-next-line
    todoListService.append(this.state.get());

    this.state.name.set('');
  }
}
```

This way each service can have a single responsibility

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

## The dependencies

If your app is in clean architecture and uses the port-adapter pattern, you can access any of the dependencies in any service method

```ts
interface ShoesApiGateway {
  get(): Promise<Shoe[]>
}

type Dependencies = {
  shoesApi: ShoesApiGateway,
}

export const Core = createCortexFactory<Dependencies>()(services);
```

```ts
type State = Shoe[];

export class CounterService extends Service<State> {
  static initialState: State = [];

  async loadShoes() {
    // highlight-next-line
    const shoes = await this.dependencies.shoesApi.get()
    this.state.set(shoes)
  }
}
```

The dependencies can then be injected in the core

```ts

class RealShoesApiAdapter implements ShoesApiGateway {
  async get() {
    return axios.get<Shoe[]>('https://my-api/shoes/get')
  }
}

const core = new Core({ shoesApi: RealShoesApiAdapter })
```