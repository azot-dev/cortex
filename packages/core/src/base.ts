import { Observable } from "@legendapp/state";
import { ConstructedServiceTypes, ServiceConstructor } from "./types/service-constructor";

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
    protected state: Observable<State>,
    protected dependencies: DependenciesType,
    private serviceRegistry: ServiceRegistry<ServiceConstructorsType, InferStoreType<ServiceConstructorsType>, DependenciesType>
  ) {
    if ("initialState" in this && !("initialState" in this.constructor)) {
      throw new Error(`Service ${this.constructor.name}: initialState must be declared static (static initialState = { ... })`);
    }
  }

  init() {}

  protected getService<K extends keyof ServiceConstructorsType>(
    name: K
  ): ConstructedServiceTypes<ServiceConstructorsType, InferStoreType<ServiceConstructorsType>, DependenciesType>[K] {
    return this.serviceRegistry.get(name);
  }

  public getState(): State {
    return this.state.peek();
  }

  public setState(state: State | ((currentState: State) => State)) {
    // (this.state as { set: ((state: State | ((currentState: State) => State)) => void) }).set(state);
    // @ts-ignore
    this.state.set(state);
  }
}
