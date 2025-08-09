import { useState, useEffect, useCallback } from 'react'

// Types pour les états asynchrones
export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

// Options pour useAsync
export interface UseAsyncOptions {
  lazy?: boolean
  deps?: unknown[]
  onSuccess?: (data: unknown) => void
  onError?: (error: Error) => void
}

// Hook useAsync simple
export function useAsync<T>(
  promiseFn: () => Promise<T>,
  options: UseAsyncOptions = {}
): AsyncState<T> & {
  refetch: () => Promise<void>
  reset: () => void
} {
  const { lazy = false, deps = [], onSuccess, onError } = options
  
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null
  })
  
  const executePromise = useCallback(async () => {
    console.log('executePromise')
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const result = await promiseFn()
      console.log('result', result)
      
      setState({
        data: result,
        loading: false,
        error: null
      })
      console.log('setState success', state)
      
      onSuccess?.(result)
      
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error))
      
      setState({
        data: null,
        loading: false,
        error: errorObj
      })
      console.log('setState error', state)
      
      onError?.(errorObj)
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  const refetch = useCallback(async () => {
    await executePromise()
  }, [executePromise])
  
  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null
    })
  }, [])
  
  useEffect(() => {
    if (!lazy) {
      executePromise()
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lazy, ...deps])
  
  return {
    ...state,
    refetch,
    reset
  }
}
