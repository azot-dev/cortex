import React, { createContext, useContext, ReactNode, Context, useState, useEffect } from "react";
import { useSelector as useLegendSelector } from "@legendapp/state/react";
import {observable, Observable} from "@legendapp/state";

interface CoreInterface {
  store: any;
  getService: any;
}

const AppStateContext = createContext<CoreInterface | null>(null);

interface ProviderProps {
  children: ReactNode;
  coreInstance: CoreInterface;
}

type ExtractPromiseType<T> = T extends Promise<infer R> ? R : never;

export const CortexProvider: React.FC<ProviderProps> = ({ children, coreInstance }) => (
  <AppStateContext.Provider value={coreInstance}>{children}</AppStateContext.Provider>
);

export function useAppContext<T>(): T {
  const context = useContext<T | null>(AppStateContext as Context<T | null>);
  if (!context) {
    throw new Error("useAppContext must be used within a CortexProvider");
  }
  return context;
}

export function createCortexHooks<Services extends Record<string, abstract new (...args: any[]) => any>>() {
  type HasStaticInitialState<T> = T extends { initialState: infer S } ? S : never;

  type Store = {
    [K in keyof Services as HasStaticInitialState<Services[K]> extends never ? never : K]: HasStaticInitialState<Services[K]>;
  };

  /**
   * Hook to select and return a part of the application state
   *
   * @example const username = useAppSelector(state => state.user.name.get())
   */
  function useAppSelector<ReturnType>(selectorFunc: (state: Observable<Store>) => ReturnType): ReturnType {
    const instance = useAppContext<CoreInterface>();
    return useLegendSelector(() => selectorFunc(instance.store));
  }

  /**
   * Hook to get a service
   *
   * @example const userService = useService('user')
   * const changeName = userService.changeName
   */
  type ExcludedMethods = "init" | "getState" | "setState";

  function useService<T extends keyof Services>(service: T): Omit<InstanceType<Services[T]>, ExcludedMethods> {
    const core = useAppContext<CoreInterface>();
    const instance = core.getService(service as string) as InstanceType<Services[T]>;

    const filteredInstance: Partial<InstanceType<Services[T]>> = {};

    for (const key in instance) {
      if (instance.hasOwnProperty(key) && !["init", "getState", "setState"].includes(key as ExcludedMethods)) {
        filteredInstance[key as keyof InstanceType<Services[T]>] = instance[key as keyof InstanceType<Services[T]>];
      }
    }

    return filteredInstance as Omit<InstanceType<Services[T]>, ExcludedMethods>;
  }

  /**
   * Hook to access to the store
   *
   * @example const store = useStore()
   * const username = store.user.name.get()
   */
  function useStore(): Observable<Store> {
    const { store } = useAppContext<CoreInterface>();
    return store;
  }

  /**
   * Hook to get the states of an async method of a service,
   * it has to be triggered by calling call()
   *
   * @example const userService = useService('user')
   * const { data, call, error, isCalled, isError, isLoading, isSuccess } = useLazyMethod(() => userService.getUser());

   */

  type ServiceMethodReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

  function useLazyMethod<T extends (...args: any[]) => any>(serviceMethod: T) {
    const [data, setData] = useState<ReturnType<T> | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [isCalled, setIsCalled] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const call = async (...args: Parameters<T>): Promise<ReturnType<T>> => {
      setIsLoading(true);
      setIsCalled(false);
      setIsError(false);
      setIsSuccess(false);
      setError(null);

      try {
        const result = await serviceMethod(...args);
        setData(result);
        setIsSuccess(true);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
        setIsError(true);
        throw err;
      } finally {
        setIsCalled(true);
        setIsLoading(false);
      }
    };

    return { data, call, error, isCalled, isError, isLoading, isSuccess };
  }

  /** 
   * Hook to get the states of an async method of a service,
   * it is automatically triggered when the component mounts
   *
   * @example const userService = useService('articles')
   * const { data, call, error, isCalled, isError, isLoading, isSuccess } = useMethod(() => articlesService.getArticles());

   */function useMethod(serviceMethod: () => Promise<any>) {
    const lazyMethod = useLazyMethod(serviceMethod);

    useEffect(() => {
      lazyMethod.call();
    }, [lazyMethod.call]);

    return lazyMethod;
  }

  /**
   * Hook to get and set a state based on a store observable,
   * it is automatically triggered when the component mounts
   *
   * @example
   * const store = useStore()
   * const [username, setUsername] = useAppState(store.user.name)
   *
   * @example const [username, setUsername] = useAppState(state => state.user.name)
   */
  function useAppState<T>(selectorFunc: ((state: Observable<Store>) => Observable<T>)): [T, Observable<T>['set']] {
    const instance = useAppContext<CoreInterface>();
    const observable = selectorFunc(instance.store)
    const observedObservable = useLegendSelector<T>(observable)
    return [observedObservable, observable.set]
  }

  function useAppSele<ReturnType>(selectorFunc: (state: Observable<Store>) => ReturnType): ReturnType {
    const instance = useAppContext<CoreInterface>();
    return useLegendSelector(() => selectorFunc(instance.store));
  }

  return { useAppSelector, useService, useStore, useMethod, useLazyMethod, useAppState };
}
