import { Observable } from "@legendapp/state";
import { ConstructedServiceTypes, GetStore, ServiceConstructor } from "./types/service-constructor";

export class ServiceRegistry<
  ServiceConstructorsType extends Record<string, ServiceConstructor<any, Observable<StoreType>, DependenciesType>>,
  StoreType,
  DependenciesType
> {
  private instances: Partial<ConstructedServiceTypes<ServiceConstructorsType, StoreType, DependenciesType>> = {};

  setInstance<K extends keyof ConstructedServiceTypes<ServiceConstructorsType, StoreType, DependenciesType>>(
    name: K,
    instance: ConstructedServiceTypes<ServiceConstructorsType, StoreType, DependenciesType>[K]
  ) {
    this.instances[name] = instance;
  }

  getNames(): (keyof ConstructedServiceTypes<ServiceConstructorsType, StoreType, DependenciesType>)[] {
    return Object.keys(this.instances);
  }

  get<K extends keyof ConstructedServiceTypes<ServiceConstructorsType, StoreType, DependenciesType>>(
    name: K
  ): ConstructedServiceTypes<ServiceConstructorsType, StoreType, DependenciesType>[K] {
    if (!this.instances[name]) {
      throw new Error(`Service ${String(name)} has not been registered.`);
    }
    return this.instances[name] as ConstructedServiceTypes<ServiceConstructorsType, StoreType, DependenciesType>[K];
  }
}

type InferStoreType<ServiceConstructorsType> = {
  [K in keyof ServiceConstructorsType]: ServiceConstructorsType[K] extends ServiceConstructor<any, infer I, any> ? I : never;
};

export class BaseService<State, ServiceConstructorsType extends Record<string, ServiceConstructor<any, any, DependenciesType>>, DependenciesType> {
  constructor(
    protected store: Observable<GetStore<ServiceConstructorsType>>,
    protected state: Observable<State>,
    protected dependencies: DependenciesType,
    private serviceRegistry: ServiceRegistry<ServiceConstructorsType, InferStoreType<ServiceConstructorsType>, DependenciesType>
  ) {
    if ("initialState" in this && !("initialState" in this.constructor)) {
      throw new Error(`Service ${this.constructor.name}: initialState must be declared static (static initialState = { ... })`);
    }
  }

  init() {}

  public getState(): State {
    return this.state.peek();
  }

  public setState(state: State | ((currentState: State) => State)) {
    // @ts-ignore
    this.state.set(state);
  }

  protected getService<K extends keyof ServiceConstructorsType>(
    name: K
  ): ConstructedServiceTypes<ServiceConstructorsType, InferStoreType<ServiceConstructorsType>, DependenciesType>[K] {
    return this.serviceRegistry.get(name);
  }

  protected decorateAllMethods<
    ServiceKey extends ReturnType<typeof this.serviceRegistry.getNames>[number],
    MethodName extends keyof ReturnType<typeof this.serviceRegistry.get>[ServiceKey]
  >(callbackStart: (serviceKey: ServiceKey, methodName: MethodName) => void, callbackEnd?: (serviceKey: ServiceKey, methodName: MethodName) => void) {
    const serviceKeys = this.serviceRegistry.getNames();

    serviceKeys.forEach((serviceKey) => {
      const service = this.serviceRegistry.get(serviceKey);

      Object.getOwnPropertyNames(Object.getPrototypeOf(service))
        .filter((prop) => typeof service[prop] === "function" && prop !== "constructor")
        .forEach((methodName) => {
          const originalMethod = service[methodName];
          service[methodName] = function (...args: any) {
            // @ts-ignore
            callbackStart(serviceKey, methodName);
            const result = originalMethod.apply(this, args);
            // @ts-ignore
            callbackEnd?.(serviceKey, methodName);
            return result;
          };
        });
    });
  }
}
