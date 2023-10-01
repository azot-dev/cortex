import React, { createContext, useContext, ReactNode } from 'react';
import { useSelector } from '@legendapp/state/react';
import { Observable } from '@legendapp/state';

interface CoreInterface {
  store: any;
  getService: any;
}

const AppStateContext = createContext<CoreInterface | null>(null);

interface ProviderProps {
  children: ReactNode;
  coreInstance: CoreInterface;
}

type DeepOmitFunctions<T> = {
  [K in keyof T as T[K] extends (...args: any[]) => any
    ? never
    : K]: T[K] extends object ? DeepOmitFunctions<T[K]> : T[K];
};

export const XCoreProvider: React.FC<ProviderProps> = ({
  children,
  coreInstance,
}) => (
  <AppStateContext.Provider value={coreInstance}>
    {children}
  </AppStateContext.Provider>
);

function useAppContext<T>(): T {
  const context = useContext<T | null>(AppStateContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

export const createAppSelector =
  <T extends CoreInterface>() =>
  (selectorFunc: (state: DeepOmitFunctions<T['store']>) => any) => {
    const instance = useAppContext<T>();
    return useSelector(() => selectorFunc(instance.store));
  };

export function createAppService<T extends CoreInterface>(): T['getService'] {
  const core = useAppContext<T>();
  return core.getService;
}
