// lib/coreFactory.ts

import { observable } from '@legendapp/state';
import { ServiceRegistry } from './base';
import { ServiceConstructor } from './types/service-constructor';
import { cloneDeep } from 'lodash';
import {
  checkChromeAvailability,
  decorateAllMethodsWithChromeLogger,
  enableChromeDebugger,
} from './debuggerLib';

export function createCortexFactory<DependenciesType>(
  {
    debug,
    persistence,
  }: {
    debug?: boolean;
    persistence?: boolean;
  } = {
    debug: false,
    persistence: false,
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
    const canDebug = checkChromeAvailability();
    console.log({ canDebug });

    if (debug && !canDebug) {
      console.warn(
        'You have to install the Cortex Devtool Chrome extension in order to debug'
      );
    }

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

        Object.keys(serviceConstructors).forEach((service) => {
          this.#serviceRegistry.get(service).init?.();
        });

        if (debug) {
          try {
            enableChromeDebugger(this);
          } catch (e) {
            console.error('ta mère en slip de guerre');
          }
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
