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
    if (this.state.count.get() !== 0) {
      this.state.count.set((count) => count - 1);
    }
  }
}
