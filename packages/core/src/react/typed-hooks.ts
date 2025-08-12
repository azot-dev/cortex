import { useSnapshot } from 'valtio'
import { useCore } from './hooks'

export function createTypedHooks<T extends Record<string, unknown>>() {
  return {
    useService: <K extends keyof T>(serviceName: K): T[K] => {
      const core = useCore<{ getService: <K extends keyof T>(serviceName: K) => T[K] }>()
      const service = core.getService(serviceName)
      
      const serviceWithState = service as { state: unknown }
      const reactiveState = useSnapshot(serviceWithState?.state || {})
      
      if (service && serviceWithState.state && typeof serviceWithState.state === 'object') {
        return {
          ...service,
          ...reactiveState
        } as T[K]
      }
      
      return service
    }
  }
}
