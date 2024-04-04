// lib/types/service-constructor.ts

import { Observable } from "@legendapp/state";
import { ServiceRegistry } from "../base";

export type ConstructedServiceTypes<
  ServiceConstructorsType extends Record<string, ServiceConstructor<any, Observable<StateType>, DependenciesType>>,
  StateType,
  DependenciesType
> = {
  [K in keyof ServiceConstructorsType]: InstanceType<ServiceConstructorsType[K]>;
};

export type GetStore<Services extends Record<string, ServiceConstructor<any, any, any>>> = {
  [K in keyof Services]: Services[K]["initialState"];
};

export type ServiceConstructor<ServiceType, StateType, DependenciesType> = {
  initialState?: StateType;
  new (
    store: Observable<GetStore<any>>,
    state: Observable<StateType>,
    dependencies: DependenciesType,
    serviceRegistry: ServiceRegistry<any, Observable<StateType>, DependenciesType>
  ): ServiceType;
};

export type InferStoreType<ServiceConstructorsType> = {
  [K in keyof ServiceConstructorsType]: ServiceConstructorsType[K] extends ServiceConstructor<any, infer I, any> ? I : never;
};
