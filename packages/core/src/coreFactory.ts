// lib/coreFactory.ts

import { Observable, observable } from "@legendapp/state";
import { ServiceRegistry } from "./base";
import { GetStore, ServiceConstructor } from "./types/service-constructor";
import { cloneDeep } from "lodash";
import { CommunicationService } from "./chrome-debugger/communication-service";

type Options = {
  debug?: boolean;
  host?: string;
  port?: number;
};

export function createCortexFactory<DependenciesType>() {
  return <
    ServiceConstructorsType extends Record<string, ServiceConstructor<any, any, DependenciesType>>,
    CoreServiceConstructorsType extends Record<string, ServiceConstructor<any, any, DependenciesType>>,
    States extends GetStore<ServiceConstructorsType>
  >(
    serviceConstructors: ServiceConstructorsType,
    coreServices?: CoreServiceConstructorsType
  ) => {
    type ServiceInstances = {
      [K in keyof ServiceConstructorsType]: InstanceType<ServiceConstructorsType[K]>;
    };

    type CoreServiceInstances = {
      [K in keyof CoreServiceConstructorsType]: InstanceType<CoreServiceConstructorsType[K]>;
    };

    return class Core {
      public store: Observable<States>;
      #serviceRegistry: ServiceRegistry<ServiceInstances & CoreServiceInstances, States, DependenciesType>;

      constructor(
        dependencies: Partial<DependenciesType> = {},
        options: Options = {
          debug: false,
          host: "localhost",
        }
      ) {
        this.#serviceRegistry = new ServiceRegistry();

        const rawStates: States = {} as States;
        for (const key in serviceConstructors) {
          if ("initialState" in serviceConstructors[key]) {
            rawStates[key as unknown as keyof States] = serviceConstructors[key].initialState;
          }
        }

        this.store = observable(cloneDeep(rawStates));
        const devtools = new CommunicationService(options.debug, options.host, options.port);
        for (const [key, ServiceConstructor] of Object.entries(serviceConstructors)) {
          devtools.decorateAllMethodsWithChromeLogger(key, ServiceConstructor);

          const instance = new ServiceConstructor(
            // @ts-ignore
            this.store,
            this.store[key as unknown as keyof Observable<States>],
            dependencies as DependenciesType,
            this.#serviceRegistry
          );
          this.#serviceRegistry.setInstance(key as keyof ServiceInstances, instance);
        }

        Object.keys({ ...serviceConstructors, ...coreServices }).forEach((serviceName) => {
          const serviceInstance = this.#serviceRegistry.get(serviceName as keyof typeof serviceConstructors & keyof typeof coreServices);
          if (serviceInstance) {
            bindAllMethods(serviceInstance);
          }
        });

        Object.keys(serviceConstructors).forEach((service) => {
          this.#serviceRegistry.get(service).init?.();
        });
        devtools.enableChromeDebugger(this, Object.keys(serviceConstructors));
      }

      getService<K extends keyof ServiceInstances>(name: K): ServiceInstances[K] {
        return this.#serviceRegistry.get(name);
      }
    };
  };
}

const bindAllMethods = (service: any) => {
  Object.getOwnPropertyNames(Object.getPrototypeOf(service)).forEach((methodName) => {
    const method = service[methodName];
    if (typeof method === "function") {
      service[methodName] = method.bind(service);
    }
  });
};
