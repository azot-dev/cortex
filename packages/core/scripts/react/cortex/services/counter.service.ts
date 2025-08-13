import { Service } from '../setup/base.service'

export type State = {
  count: number
}

export class CounterService extends Service<State> {
  state: State = { count: 0 }

  increment() {
    this.state.count++
    this.getService('logger').log(`counter incremented by ${this.state.count}`)
  }

  decrement() {
    this.state.count--
    this.getService('logger').log(`counter decremented by ${this.state.count}`)
  }
}