import { proxy, subscribe } from 'valtio'
import { deepClone } from 'valtio/utils'

export abstract class BaseService<TServices = unknown, TDependencies = Record<string, unknown>, TState extends object = object> {
  getService!: <K extends keyof TServices>(serviceName: K) => TServices[K]
  
  state!: TState
  private initialState!: TState
  
  protected dependencies: TDependencies
  
  constructor(dependencies: TDependencies) {
    this.dependencies = dependencies
  }
  
  /**
   * Called by Core to proxify the state after initialization
   * @internal Do not call manually
   */
  _proxyState(): void {
    if (this.state) {
      this.initialState = this.getState()
      this.state = proxy(this.getState()) as TState
    }
  }
  
  protected setState(newState: Partial<TState>): void {
    if (this.state) {
      Object.assign(this.state, newState)
    }
  }
  
  protected getState(): TState {
    return deepClone(this.state)
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
    
    return subscribe(this.state, () => {
      callback(this.state)
    })
  }

  reset(): void {
    if (!this.state || typeof this.state !== 'object') {
      return
    }
    
    const resetObj: TState = deepClone(this.initialState)
    Object.keys(resetObj as object).forEach((key) => {
      ;(this.state as Record<string, unknown>)[key] = (resetObj as Record<string, unknown>)[key]
    })
  }
}
