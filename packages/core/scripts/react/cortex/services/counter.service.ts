import { Service } from '../utils/service';

type State = {
  count: number;
};

export class CounterService extends Service<State> {
  static initialState: State = {
    count: 0,
  };

  increment() {
    this.state.count.set((count) => count + 1);
  }

  decrement() {
    this.state.count.set((count) => count - 1);
  }
}
