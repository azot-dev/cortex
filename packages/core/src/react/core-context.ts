import { createContext } from 'react'
import type { Core } from '../core'

export const CoreContext = createContext<Core<any, any> | null>(null)
