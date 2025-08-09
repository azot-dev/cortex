import { Service } from '../utils/service';

type State = {
  count: number;
};

export class CounterService extends Service<State> {
  static initialState: State = {
    count: 0,
  };

  increment() {
    this.state.count += 1;
    console.log("increment", this.state.count);
  }

  decrement() {
    this.state.count -= 1;
    console.log("decrement", this.state.count);
  }
}
