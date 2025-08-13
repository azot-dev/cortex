import { ReactNode } from 'react'
import { CoreContext } from './core-context'
import type { Core, ServiceRegistry } from '../core'

interface CoreProviderProps<T extends ServiceRegistry<any>, TDependencies = Record<string, unknown>> {
  core: Core<T, TDependencies>
  children: ReactNode
}

export function CortexProvider<T extends ServiceRegistry<any>, TDependencies = Record<string, unknown>>({ 
  core, 
  children 
}: CoreProviderProps<T, TDependencies>) {
  return (
    <CoreContext.Provider value={core}>
      {children}
    </CoreContext.Provider>
  )
}
