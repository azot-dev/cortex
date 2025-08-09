import { createContext } from 'react'
import type { Core, ServiceRegistry } from '../core/core'

export const CoreContext = createContext<Core<any> | null>(null)
