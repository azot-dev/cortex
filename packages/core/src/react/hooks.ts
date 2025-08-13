import { useContext } from 'react'
import { CoreContext } from './core-context'

export function useCore<T>(): T {
  const core = useContext(CoreContext)
  if (!core) {
    throw new Error('useCore must be used within a CoreProvider')
  }
  return core as T
}

export function useService<T extends Record<string, any>>(serviceName: keyof T): T[keyof T] {
  const core = useCore<{ getService: <K extends keyof T>(serviceName: K) => T[K] }>()
  return core.getService(serviceName)
}
