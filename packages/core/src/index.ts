export { Core, type ServiceRegistry } from './core'
export { BaseService } from './base-service'

export type CreateServices<T extends import('./core').ServiceRegistry<any>> = {
  [K in keyof T]: InstanceType<T[K]>
}

export { useCore, useService } from './react/hooks'
export { createTypedHooks } from './react/typed-hooks'
export { CoreProvider } from './react/provider'
export { CoreContext } from './react/core-context'
export { 
  useAsync, 
  type AsyncState, 
  type UseAsyncOptions 
} from './react/async-hooks'
