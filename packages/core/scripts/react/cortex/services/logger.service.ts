import { Service } from "../setup/base.service"

export type State = {
  logs: string[]
}

export class LoggerService extends Service<State> {
  state: State = { logs: [] }
  
  init() {
    this.log('Logger service initialized')
  }

  log(message: string) {
    console.log('message', message)
  }
} 