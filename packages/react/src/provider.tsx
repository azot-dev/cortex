import React, { createContext, useContext, ReactNode, Context, useState, useEffect } from "react";
import { useSelector as useLegendSelector } from "@legendapp/state/react";
import { Observable } from "@legendapp/state";

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
  function useService<T extends keyof Services>(service: T): InstanceType<Services[T]> {
    const core = useAppContext<CoreInterface>();
    return core.getService(service as string) as InstanceType<Services[T]>;
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
  function useLazyMethod<Method extends (...args: any[]) => Promise<any> | any>(serviceMethod: Method) {
    const [data, setData] = useState<ExtractPromiseType<ReturnType<Method>> | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean | undefined>(undefined);
    const [isSuccess, setIsSuccess] = useState<boolean | undefined>(undefined);
    const [isCalled, setIsCalled] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const call = async () => {
      setIsError(undefined);
      setIsSuccess(undefined);
      setError(null);
      setData(undefined);
      setIsLoading(true);
      try {
        const returnedData = await serviceMethod();
        setData(returnedData);
        setIsSuccess(true);
        setIsError(false);
      } catch (e: unknown) {
        setError(e as Error);
        setIsError(true);
        setIsSuccess(false);
      } finally {
        setIsCalled(true);
        setIsLoading(false);
      }
    };

    return {
      isLoading,
      isError,
      isSuccess,
      isCalled,
      error,
      call,
      data,
    };
  }

  /** 
   * Hook to get the states of an async method of a service,
   * it is automatically triggered when the component mounts
   *
   * @example const userService = useService('articles')
   * const { data, call, error, isCalled, isError, isLoading, isSuccess } = useMethod(() => articlesService.getArticles());

   */
  function useMethod<Method extends (...args: any[]) => Promise<any>>(serviceMethod: Method) {
    const lazyMethod = useLazyMethod(serviceMethod);

    useEffect(() => {
      lazyMethod.call();
    }, []);

    return lazyMethod;
  }

  return { useAppSelector, useService, useStore, useMethod, useLazyMethod };
}
