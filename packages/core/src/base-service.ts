import { Observable } from "@legendapp/state";
import { ConstructedServiceTypes, GetStore, InferStoreType, ServiceConstructor } from "./types/service-constructor";
import { ServiceRegistry } from "./service-registry";
import { proxy } from "valtio";

export abstract class BaseService<State, ServiceConstructorsType extends Record<string, ServiceConstructor<any, any, DependenciesType>>, DependenciesType> {
  constructor(
    _store: GetStore<ServiceConstructorsType>,
    protected state: State,
    protected dependencies: DependenciesType,
    private serviceRegistry: ServiceRegistry<ServiceConstructorsType, InferStoreType<ServiceConstructorsType>, DependenciesType>
  ) {
    if ("initialState" in this && !("initialState" in this.constructor)) {
      throw new Error(`Service ${this.constructor.name}: initialState must be declared static (static initialState = { ... })`);
    }
  }

  init() {}

  public getState(): State {
    return this.state;
  }

  public setState(state: State | ((currentState: State) => State)) {
    if (typeof state === "function") {
      // @ts-ignore
      this.state = proxy(state(this.state));
      return;
    }
    // @ts-ignore
    this.state = proxy(state);
  }

  protected getService<K extends keyof ServiceConstructorsType>(
    name: K
  ): ConstructedServiceTypes<ServiceConstructorsType, InferStoreType<ServiceConstructorsType>, DependenciesType>[K] {
    return this.serviceRegistry.get(name);
  }
}
