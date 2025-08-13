import { useSnapshot } from 'valtio'
import { useCore } from './hooks'
import type { BaseService } from '../base-service'

type ExtractState<T> = T extends { state: infer S } ? S : unknown
type StripBaseKeys<T> = Omit<T, keyof BaseService<unknown, unknown, unknown> | 'state' | 'dependencies' | 'getService'>
type MethodsOnly<T> = { [K in keyof T as T[K] extends (...args: unknown[]) => unknown ? K : never]: T[K] }
type PublicServiceAPI<T> = MethodsOnly<StripBaseKeys<T>> & ExtractState<T>

export function createTypedHooks<TServices extends Record<string, unknown>>() {
  return {
    useService: <K extends keyof TServices>(serviceName: K): PublicServiceAPI<TServices[K]> => {
      const core = useCore<{ getService: <K extends keyof TServices>(serviceName: K) => TServices[K] }>()
      const service = core.getService(serviceName) as TServices[K] & { state?: unknown }

      const reactiveState = useSnapshot(service?.state || {})

      const entries = Object.entries(service as Record<string, unknown>)
      const publicMethods: Record<string, unknown> = {}
      for (const [key, value] of entries) {
        if (key === 'state' || key === 'dependencies' || key === 'getService') continue
        if (typeof value === 'function') {
          publicMethods[key] = value
        }
      }

      if (service && service.state && typeof service.state === 'object') {
        return {
          ...publicMethods,
          ...reactiveState
        } as PublicServiceAPI<TServices[K]>
      }

      return publicMethods as PublicServiceAPI<TServices[K]>
    }
  }
}
