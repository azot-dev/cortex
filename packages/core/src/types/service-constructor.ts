// lib/types/service-constructor.ts

import { Observable } from '@legendapp/state';
import { ServiceRegistry } from '../base';

export type ConstructedServiceTypes<
  ServiceConstructorsType extends Record<
    string,
    ServiceConstructor<any, Observable<StateType>, DependenciesType>
  >,
  StateType,
  DependenciesType
> = {
  [K in keyof ServiceConstructorsType]: InstanceType<
    ServiceConstructorsType[K]
  >;
};

export type ServiceConstructor<ServiceType, StateType, DependenciesType> = {
  initialState?: StateType;
  new (
      store: Observable,
    state: Observable<StateType>,
    dependencies: DependenciesType,
    serviceRegistry: ServiceRegistry<
      any,
      Observable<StateType>,
      DependenciesType
    >
  ): ServiceType;
};
