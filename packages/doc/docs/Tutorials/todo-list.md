---
sidebar_position: 2
---

# Todo list

Let's continue with a simple example but a bit more complicated with more business logic, still with tests: the classic todo list

:::tip What You'll Learn

- How to modify the code without modifying the tests
- Write a logic without needing to open the browser

:::

:::info Prerequisites

- Setup [Jest](https://kulshekhar.github.io/ts-jest/docs/getting-started/installation/) with Typescript on your project

:::

<iframe 
    src="https://x4q8l4-5173.csb.app/"
    style={{ width: "100%", height: "500px", border: "0", borderRadius: "4px", overflow: "hidden" }}
    title="frosty-surf-4kp6v2"
    allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

[![Edit todo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/devbox/github/azot-dev/cortex/tree/main/examples/todo?embed=1)

## Setup

First we have to think about our first feature, the simplest: list the todos.
A todo is made of a text.

Let's create the `TodoService` and bind it to the services.

```typescript title="src/cortex/services/todo/todo.service.ts"
import { Service } from '../../utils/service';

type Todo = { title: string }[];

type State = Todo[];

export class TodoService extends Service<State> {
  static initialState: State = [];
}
```

```typescript title="src/cortex/services/_services.ts"
import { TodoService } from './todo/todo.service';

export const services = {
  todo: TodoService,
};
```

A todo is an array of objects containing only strings.
We can write the `get` method to encapsulate the data, so if it changes then, we don't need to modify the tests.

```typescript title="src/cortex/services/todo/todo.service.ts"
import { Service } from '../../utils/service';

type Todo = { title: string };

type State = Todo[]

export class TodoService extends Service<State> {
  static initialState: State = [];

  get(): Todo[] {
    return this.state.get();
  }
}
```

## Setup the test file

We can now create a test file and set it up so the core and the service will be re-instantiated before each test

```typescript title="src/cortex/services/todo/todo.service.spec.ts"
import { Core } from '../../_core';
import { TodoService } from './todo.service';

describe('todo service', () => {
  let core: InstanceType<typeof Core>;
  let service: InstanceType<typeof TodoService>;

  beforeEach(() => {
    core = new Core();
    service = core.getService('todo');
  });
});
```

## The `add` method

Since we am using Typescript, the test will display that the method doesn't exist even before launching the test.
That is why I prefer to write the empty methods before to write the tests.

```typescript title="src/cortex/services/todo/todo.service.ts"
type Todo = { title: string };

type State = Todo[]

export class TodoService extends Service<State> {
  static initialState: State = [];

  get(): Todo[] {
    return this.state.get();
  }

  // highlight-next-line
  add() {}
}
```

Let's write the test now

```typescript title="src/cortex/services/todo/todo.service.spec.ts"
import { Core } from '../../_core';
import { TodoService } from './todo.service';

describe('todo service', () => {
  let core: InstanceType<typeof Core>;
  let service: InstanceType<typeof TodoService>;

  beforeEach(() => {
    core = new Core();
    service = core.getService('todo');
  });

  describe('add', () => {
    // highlight-start
    it('adds a todo to the todoList', () => {
      service.add('eat');

      expect(service.get().length).toBe(1);
      expect(service.get()[0].title).toBe('eat');
    });
  // highlight-end
  }); 
});
```

we call the service method `add` with `service.add('eat')` first, and expect that the the todo array contains one element and that its title is the same we added: 'eat'

The test fails for the moment because the method `add` is empty, so let's code it:

```typescript title="src/cortex/services/todo/todo.service.ts"
export class TodoService extends Service<State> {
  ...
  add(title: string) {
    this.state.set((state) => [...state, { title }]);
  }
}
```

## The `remove` method

Let's do the same as the `add` method, we write the empty method, code the test and then go back to write the method

This time, we figure out that we will need something to identify a todo in order to remove it, we can use uuid to provide unique ids to our toddos

```typescript title="src/cortex/services/todo/todo.service.ts"
// highlight-next-line
import { v4 as uuid } from 'uuid';

// highlight-next-line
type Todo = { title: string, id: string };

type State = Todo[]

export class TodoService extends Service<State> {
  static initialState: State = [];

  get(): Todo[] {
    return this.state.get();
  }

  add(title: string) {
    // highlight-next-line
    this.state.set((state) => [...state, { title, id: uuid }]);
  }

  // highlight-next-line
  remove(id: string) {}
}
```

We add 2 todos: `eat` and `go to ski`, after removing the todo `eat`, it should only remain the todo `go to ski`

```typescript title="src/cortex/services/todo/todo.service.spec.ts"
  ...

  describe('remove', () => {
    it('removes a todo to the todoList', () => {
      service.add('eat');
      service.add('go to ski');
      const idToRemove = service.get().find((todo) => todo.title === 'eat')!.id;

      service.remove(idToRemove);
      expect(service.get().length).toBe(1);
      expect(service.get()[0].title).toBe('go to ski');
    });
  });

  ...
```

Time to write the method `remove`

```typescript title="src/cortex/services/todo/todo.service.ts"
export class TodoService extends Service<State> {
  ...
  remove(id: string) {
    this.state.set((state) => state.filter((todo) => todo.id !== id));
  }
}
```

We can do the same for the methods `modify` and `toggleDone`, so the user can modify a task name and check or uncheck a task as done

## Bind to the UI

Now we have a proper place to write our logic and it is already tested, we just need to bind this logic to the UI.

Since we already have a getter in the service, we just have to pass it to useAppSelector:

```tsx
export const TodoWrapper = () => {
  const { get } = useService('todo');
  const todos = useAppSelector(get);

  return (
    <div className="TodoWrapper">
      <h1>Get Things Done !</h1>
      <TodoForm />
      {todos.map((todo) => (todo.isEditing ? <EditTodoForm todo={todo} /> : <Todo key={todo.id} todo={todo} />))}
    </div>
  );
};
```

Here we destructure the service `todo` to obtain the method `get` that we pass to the useAppSelector, so each time, the todo changes, it updates the UI

We do the same for each method of the todo

## Refactoring

We can then figure out that using an array is far to be the best option for the todo, there is a unique id identifying each todo, maybe it could be better to use an object instead of an array. It will simplify the code and increase performances.

Since the tests are about the todo behavior and not the implementation, we should not have to change the tests :)

```typescript title="src/cortex/services/todo/todo.service.ts"
export type Todo = { title: string; id: string; isEditing: boolean; isDone: boolean };

type State = Todo[];

export class TodoService extends Service<State> {
  static initialState: State = [];

  add(title: string) {
    this.state.set((state) => [...state, { title, id: uuid(), isEditing: false, isDone: false }]);
  }

  remove(id: string) {
    this.state.set((state) => state.filter((todo) => todo.id !== id));
  }

  modify(id: string, title: string) {
    const todoIndex = this.state.peek().findIndex((todo) => todo.id === id);
    this.state[todoIndex].set((state) => ({ ...state, title }));
  }

  toggleDone(id: string) {
    const todoIndex = this.state.peek().findIndex((todo) => todo.id === id);
    this.state[todoIndex].set((state) => ({ ...state, isDone: !state.isDone }));
  }

  edit(id: string) {
    const todoIndex = this.state.peek().findIndex((todo) => todo.id === id);
    this.state[todoIndex].set((state) => ({ ...state, isEditing: true }));
  }

  get(): Todo[] {
    return this.state.get();
  }
}
```

becomes

```typescript title="src/cortex/services/todo/todo.service.ts"
export type Todo = { title: string; isEditing: boolean; isDone: boolean; id: string };

type State = Record<string, Omit<Todo, 'id'>>;

export class TodoService extends Service<State> {
  static initialState: State = {};

  add(title: string) {
    this.state[uuid()].set({ title, isEditing: false, isDone: false });
  }

  remove(id: string) {
    this.state[id].delete();
  }

  modify(id: string, title: string) {
    this.state[id].title.set(title);
  }

  toggleDone(id: string) {
    this.state[id].isDone.set((isDone) => !isDone);
  }

  edit(id: string) {
    this.state[id].isEditing.set(true);
  }

  get(): Todo[] {
    const state = this.state.get(true);
    return Object.keys(state).map((id) => ({ id, ...state[id] }));
  }
}
```
