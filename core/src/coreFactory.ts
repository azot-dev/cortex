// lib/coreFactory.ts

import { observable } from '@legendapp/state';
import { ServiceRegistry } from './base';
import { ServiceConstructor } from './types/service-constructor';
import { cloneDeep } from 'lodash';

const extensionId = 'ljmkbjlbiefamgbmmbohkdbbnpndhcep';

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

        if (typeof chrome !== 'undefined' && chrome.runtime) {
          chrome.runtime.sendMessage(extensionId, {
            type: 'INITIAL_STATE',
            data: {},
          });
        }

        if (debug) {
          if (typeof chrome !== 'undefined' && chrome.runtime) {
            chrome.runtime.sendMessage(extensionId, {
              type: 'INITIAL_STATE',
              data: store.get(),
            });
            this.store.onChange((newState) => {
              chrome.runtime.sendMessage(extensionId, {
                type: 'NEW_STATE',
                data: newState.value,
              });
            });
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
