import React, { createContext, useContext, ReactNode, Context, useState, useEffect, useCallback } from "react";
import { useSelector as useLegendSelector } from "@legendapp/state/react";
import { observable, Observable } from "@legendapp/state";

interface CoreInterface {
  store: any;
  getService: any;
}

const AppStateContext = createContext<CoreInterface | null>(null);

interface ProviderProps {
  children: ReactNode;
  coreInstance: CoreInterface;
}

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

  type NonVoid<T> = T extends void ? never : T;

  type ExtractPromiseType<T> = T extends Promise<infer R> ? NonVoid<R> : never;

  type MethodNames<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
  }[keyof T];

  type ServiceMethods<T> = {
    [K in keyof T]: T[K] extends new (...args: any) => infer R ? `${K & string}.${Exclude<MethodNames<R & {}>, ExcludedMethods> & string}` : never;
  }[keyof T];

  type GetMethodReturnType<S, M extends string> = M extends `${infer ServiceName}.${infer MethodName}`
    ? ServiceName extends keyof S
      ? S[ServiceName] extends abstract new (...args: any) => any
        ? MethodName extends keyof InstanceType<S[ServiceName]>
          ? InstanceType<S[ServiceName]>[MethodName] extends (...args: any[]) => infer R
            ? R
            : never
          : never
        : never
      : never
    : never;

  type GetMethodParameters<S, M extends string> = M extends `${infer ServiceName}.${infer MethodName}`
    ? ServiceName extends keyof S
      ? S[ServiceName] extends abstract new (...args: any) => any
        ? MethodName extends keyof InstanceType<S[ServiceName]>
          ? InstanceType<S[ServiceName]>[MethodName] extends (...args: infer P) => any
            ? P
            : never
          : never
        : never
      : never
    : never;

  function getMethodFromString(serviceMethod: string, core: CoreInterface) {
    const [serviceName, methodName] = serviceMethod.split(".");
    const service = core.getService(serviceName) as InstanceType<Services[typeof serviceName]>;
    const method = service[methodName];
    if (typeof method !== "function") {
      throw new Error(`Method ${methodName} not found on service ${serviceName}`);
    }
    return method;
  }

  /**
   * Hook to get the states of an async method of a service,
   * it has to be triggered by calling call()
   * 
   * @example const { data, call, error, isCalled, isError, isLoading, isSuccess } = useLazyMethod('user.getUser');
   *
   * @example const userService = useService('user')
   * const { data, call, error, isCalled, isError, isLoading, isSuccess } = useLazyMethod(userService.getUser);

   */

  function useLazyMethod<Method extends (...args: any[]) => Promise<any>>(
    serviceMethod: Method
  ): {
    isLoading: boolean;
    isError: boolean | undefined;
    isSuccess: boolean | undefined;
    isCalled: boolean;
    error: Error | null;
    call: (...args: Parameters<Method>) => Promise<ExtractPromiseType<ReturnType<Method>> | undefined>;
    data: ExtractPromiseType<ReturnType<Method>> | undefined;
  };

  function useLazyMethod<StringMethod extends ServiceMethods<Services>>(
    serviceMethod: StringMethod
  ): {
    isLoading: boolean;
    isError: boolean | undefined;
    isSuccess: boolean | undefined;
    isCalled: boolean;
    error: Error | null;
    call: (...args: GetMethodParameters<Services, StringMethod>) => Promise<ExtractPromiseType<GetMethodReturnType<Services, StringMethod>> | undefined>;
    data: ExtractPromiseType<GetMethodReturnType<Services, StringMethod>> | undefined;
  };

  function useLazyMethod<Method extends (...args: any[]) => Promise<any>, StringMethod extends ServiceMethods<Services>>(serviceMethod: Method | StringMethod) {
    const core = useAppContext<CoreInterface>();
    const [data, setData] = useState<any>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean | undefined>(undefined);
    const [isSuccess, setIsSuccess] = useState<boolean | undefined>(undefined);
    const [isCalled, setIsCalled] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const call = useCallback(
      async (...args: any[]): Promise<any | undefined> => {
        setIsError(undefined);
        setIsSuccess(undefined);
        setError(null);
        setData(undefined);
        setIsLoading(true);

        try {
          const actualMethod: (...args: any[]) => Promise<any> = typeof serviceMethod === "string" ? getMethodFromString(serviceMethod, core) : serviceMethod;

          const returnedData = await actualMethod(...args);
          setData(returnedData);
          setIsSuccess(true);
          setIsError(false);
          return returnedData;
        } catch (e: unknown) {
          setError(e as Error);
          setIsError(true);
          setIsSuccess(false);
        } finally {
          setIsCalled(true);
          setIsLoading(false);
        }
      },
      [serviceMethod, core]
    );

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
   * const { data, call, error, isCalled, isError, isLoading, isSuccess } = useMethod('articles.getArticles');
   *
   * @example const userService = useService('articles')
   * const { data, call, error, isCalled, isError, isLoading, isSuccess } = useMethod(articlesService.getArticles);
   */

  function useMethod<Method extends (...args: any[]) => Promise<any>>(
    serviceMethod: Method,
    ...initialArgs: Parameters<Method>
  ): {
    isLoading: boolean;
    isError: boolean | undefined;
    isSuccess: boolean | undefined;
    isCalled: boolean;
    error: Error | null;
    call: (...args: Parameters<Method>) => Promise<ExtractPromiseType<ReturnType<Method>> | undefined>;
    data: ExtractPromiseType<ReturnType<Method>> | undefined;
  };

  function useMethod<StringMethod extends ServiceMethods<Services>>(
    serviceMethod: StringMethod,
    ...initialArgs: GetMethodParameters<Services, StringMethod>
  ): {
    isLoading: boolean;
    isError: boolean | undefined;
    isSuccess: boolean | undefined;
    isCalled: boolean;
    error: Error | null;
    call: (...args: GetMethodParameters<Services, StringMethod>) => Promise<ExtractPromiseType<GetMethodReturnType<Services, StringMethod>> | undefined>;
    data: ExtractPromiseType<GetMethodReturnType<Services, StringMethod>> | undefined;
  };

  function useMethod<Method extends (...args: any[]) => Promise<any>, StringMethod extends ServiceMethods<Services>>(
    serviceMethod: Method | StringMethod,
    ...initialArgs: StringMethod extends `${infer ServiceName}.${infer MethodName}` ? GetMethodParameters<Services, StringMethod> : Parameters<Method>
  ) {
    const core = useAppContext<CoreInterface>();
    const [data, setData] = useState<any>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean | undefined>(undefined);
    const [isSuccess, setIsSuccess] = useState<boolean | undefined>(undefined);
    const [isCalled, setIsCalled] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
      if (!isCalled) {
        call(...initialArgs).then();
      }
    }, [...initialArgs]);

    const call = useCallback(
      async (...args: any[]): Promise<any | undefined> => {
        setIsError(undefined);
        setIsSuccess(undefined);
        setError(null);
        setData(undefined);
        setIsLoading(true);

        try {
          const actualMethod: (...args: any[]) => Promise<any> = typeof serviceMethod === "string" ? getMethodFromString(serviceMethod, core) : serviceMethod;

          const returnedData = await actualMethod(...args);
          setData(returnedData);
          setIsSuccess(true);
          setIsError(false);
          return returnedData;
        } catch (e: unknown) {
          setError(e as Error);
          setIsError(true);
          setIsSuccess(false);
        } finally {
          setIsCalled(true);
          setIsLoading(false);
        }
      },
      [serviceMethod, core]
    );

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
   * Hook to get and set a state based on a store observable,
   * it is automatically triggered when the component mounts
   *
   * @example
   * const store = useStore()
   * const [username, setUsername] = useAppState(store.user.name)
   *
   * @example const [username, setUsername] = useAppState(state => state.user.name)
   */
  function useAppState<T>(selectorFunc: (state: Observable<Store>) => Observable<T>): [T, Observable<T>["set"]] {
    const instance = useAppContext<CoreInterface>();
    const observable = selectorFunc(instance.store);
    const observedObservable = useLegendSelector<T>(observable);
    return [observedObservable, observable.set];
  }

  return { useAppSelector, useService, useStore, useMethod, useLazyMethod, useAppState };
}
