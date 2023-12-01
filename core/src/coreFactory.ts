// lib/coreFactory.ts

import { observable } from '@legendapp/state';
import { ServiceRegistry } from './base';
import { ServiceConstructor } from './types/service-constructor';
import { cloneDeep } from 'lodash';
import {
  decorateAllMethodsWithChromeLogger,
  enableChromeDebugger,
} from './debuggerLib';
import { DevtoolsGateway } from './chrome-debugger/devtools.gateway';

export function createCortexFactory<DependenciesType>(
  {
    debug,
  }: {
    debug?: boolean;
  } = {
    debug: false,
  }
) {
  return <
    StoreType extends Record<string, any>,
    ServiceConstructorsType extends Record<
      string,
      ServiceConstructor<any, StoreType, DependenciesType>
    >
  >(
    rawStore: StoreType,
    serviceConstructors: ServiceConstructorsType
  ) => {
    type ServiceInstances = {
      [K in keyof ServiceConstructorsType]: InstanceType<
        ServiceConstructorsType[K]
      >;
    };
    const store = observable(cloneDeep(rawStore));
    let devtools: DevtoolsGateway;

    return class Core {
      #serviceRegistry: ServiceRegistry<
        ServiceInstances,
        StoreType,
        DependenciesType
      >;
      public store: typeof store;

      constructor(dependencies: Partial<DependenciesType> = {}) {
        this.#serviceRegistry = new ServiceRegistry();
        this.store = store;

        for (const [key, ServiceConstructor] of Object.entries(
          serviceConstructors
        )) {
          if (debug) {
            decorateAllMethodsWithChromeLogger(key, ServiceConstructor);
          }
          const instance = new ServiceConstructor(
            this.store,
            dependencies as DependenciesType,
            this.#serviceRegistry
          );
          this.#serviceRegistry.setInstance(
            key as keyof ServiceInstances,
            instance
          );
        }

        Object.keys(serviceConstructors).forEach((serviceName) => {
          const serviceInstance = this.#serviceRegistry.get(
            serviceName as keyof typeof serviceConstructors
          );
          if (serviceInstance) {
            bindAllMethods(serviceInstance);
          }
        });

        Object.keys(serviceConstructors).forEach((service) => {
          this.#serviceRegistry.get(service).init?.();
        });

        if (debug) {
          enableChromeDebugger(this, Object.keys(serviceConstructors));
        }
      }

      getService<K extends keyof ServiceInstances>(
        name: K
      ): ServiceInstances[K] {
        return this.#serviceRegistry.get(name);
      }
    };
  };
}

const bindAllMethods = (service: any) => {
  Object.getOwnPropertyNames(Object.getPrototypeOf(service)).forEach(
    (methodName) => {
      const method = service[methodName];
      if (typeof method === 'function') {
        service[methodName] = method.bind(service);
      }
    }
  );
};
