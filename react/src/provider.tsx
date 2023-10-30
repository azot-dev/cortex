import React, { createContext, useContext, ReactNode, Context } from 'react';
import { useSelector } from '@legendapp/state/react';

interface CoreInterface {
  store: any;
  getService: any;
}

const AppStateContext = createContext<CoreInterface | null>(null);

interface ProviderProps {
  children: ReactNode;
  coreInstance: CoreInterface;
}

type DeepOmitFunctionsExceptGet<T> = {
  [K in keyof T as T[K] extends (...args: any[]) => any
    ? K extends 'get'
      ? K
      : never
    : K]: T[K] extends object ? DeepOmitFunctionsExceptGet<T[K]> : T[K];
};

export const CortexProvider: React.FC<ProviderProps> = ({
  children,
  coreInstance,
}) => (
  <AppStateContext.Provider value={coreInstance}>
    {children}
  </AppStateContext.Provider>
);

export function useAppContext<T>(): T {
  const context = useContext<T | null>(AppStateContext as Context<T | null>);
  if (!context) {
    throw new Error('useAppContext must be used within a CortexProvider');
  }
  return context;
}

export function createSelectorHook<Store>() {
  return function (
    selectorFunc: (state: DeepOmitFunctionsExceptGet<Store>) => any
  ) {
    const instance = useAppContext<CoreInterface>();
    return useSelector(() => selectorFunc(instance.store));
  };
}

export function createServiceHook<
  Services extends Record<any, abstract new (...args: any) => any>
>() {
  return function <T extends keyof Services>(
    service: T
  ): InstanceType<Services[T]> {
    const core = useAppContext<CoreInterface>();
    return core.getService(service) as InstanceType<Services[T]>;
  };
}