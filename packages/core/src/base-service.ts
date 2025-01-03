import { Observable } from "@legendapp/state";
import { ConstructedServiceTypes, GetStore, InferStoreType, ServiceConstructor } from "./types/service-constructor";
import { ServiceRegistry } from "./service-registry";

export abstract class BaseService<State, ServiceConstructorsType extends Record<string, ServiceConstructor<any, any, DependenciesType>>, DependenciesType> {
  constructor(
    _store: Observable<GetStore<ServiceConstructorsType>>,
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
}
