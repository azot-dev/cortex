// lib/coreFactory.ts

import { observable } from '@legendapp/state';
import { ServiceRegistry } from './base';
import { ServiceConstructor } from './types/service-constructor';
import { cloneDeep } from 'lodash';
import { CommunicationService } from './chrome-debugger/communication-service';

export function createCortexFactory<DependenciesType>(
  {
    debug,
    host,
    port,
  }: {
    debug?: boolean;
    host?: string;
    port?: number;
  } = {
    debug: false,
    host: 'localhost',
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
    const devtools = new CommunicationService(debug, 'localhost', 9091);

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
          devtools.decorateAllMethodsWithChromeLogger(key, ServiceConstructor);
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
        devtools.enableChromeDebugger(this, Object.keys(serviceConstructors));
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
