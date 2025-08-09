import { proxy, subscribe } from 'valtio'

export abstract class BaseService<TServices = unknown, TDependencies = Record<string, unknown>, TState = unknown> {
  getService!: <K extends keyof TServices>(serviceName: K) => TServices[K]
  
  state!: TState
  
  protected dependencies: TDependencies
  
  constructor(dependencies: TDependencies) {
    this.dependencies = dependencies
  }
  
  /**
   * Called by Core to proxify the state after initialization
   * @internal Do not call manually
   */
  _proxyState(): void {
    if (this.state && typeof this.state === 'object') {
      this.state = proxy(this.state as object) as TState
    }
  }
  
  protected setState(newState: Partial<TState>): void {
    if (this.state && typeof this.state === 'object') {
      Object.assign(this.state as object, newState)
    }
  }
  
  protected getState(): TState {
    return this.state
  }
  
  init?(): void | Promise<void>
  
  /**
   * Subscribe to changes of this service's state
   * @param callback Function called on changes with the state as parameter
   * @returns Unsubscribe function
   */
  subscribe(callback: (state: TState) => void): () => void {
    if (!this.state) {
      console.warn(`Service has no state to subscribe to`)
      return () => {}
    }
    
    return subscribe(this.state as object, () => {
      callback(this.state)
    })
  }
}
