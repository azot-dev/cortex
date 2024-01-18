import { Service } from '../../utils/service';
import { v4 as uuid } from 'uuid';

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
    this.state[id].isEditing.set(false);
  }

  toggleDone(id: string) {
    this.state[id].isDone.set((isDone) => !isDone);
  }

  edit(id: string) {
    this.state[id].isEditing.set(true);
  }

  get(): Todo[] {
    const state = this.state.get();
    return Object.keys(state).map((id) => ({ id, ...state[id] }));
  }
}
