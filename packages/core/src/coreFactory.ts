// lib/coreFactory.ts

import { observable } from "@legendapp/state";
import { ServiceRegistry } from "./base";
import { ServiceConstructor } from "./types/service-constructor";
import { cloneDeep } from "lodash";
import { CommunicationService } from "./chrome-debugger/communication-service";

type Options = {
  debug?: boolean;
  host?: string;
  port?: number;
};

export function createCortexFactory<DependenciesType>() {
  return <ServiceConstructorsType extends Record<string, ServiceConstructor<any, any, DependenciesType>>>(serviceConstructors: ServiceConstructorsType) => {
    type ServiceInstances = {
      [K in keyof ServiceConstructorsType]: InstanceType<ServiceConstructorsType[K]>;
    };

    type HasStaticInitialState<T> = T extends { initialState: infer S } ? S : never;

    type States = {
      [K in keyof ServiceConstructorsType as HasStaticInitialState<ServiceConstructorsType[K]> extends never ? never : K]: HasStaticInitialState<
        ServiceConstructorsType[K]
      >;
    };

    return class Core {
      #serviceRegistry: ServiceRegistry<ServiceInstances, States, DependenciesType>;
      public store;

      constructor(dependencies: Partial<DependenciesType> = {}, options: Options = { debug: false, host: "localhost" }) {
        this.#serviceRegistry = new ServiceRegistry();

        const rawStates: States = {} as States;
        for (const key in serviceConstructors) {
          if ("initialState" in serviceConstructors[key]) {
            // @ts-ignore
            rawStates[key] = serviceConstructors[key].initialState;
          }
        }

        this.store = observable(cloneDeep(rawStates));
        const devtools = new CommunicationService(options.debug, options.host, options.port);
        for (const [key, ServiceConstructor] of Object.entries(serviceConstructors)) {
          devtools.decorateAllMethodsWithChromeLogger(key, ServiceConstructor);

          const instance = new ServiceConstructor(
            // @ts-ignore
            this.store[key],
            dependencies as DependenciesType,
            this.#serviceRegistry
          );
          this.#serviceRegistry.setInstance(key as keyof ServiceInstances, instance);
        }

        Object.keys(serviceConstructors).forEach((serviceName) => {
          const serviceInstance = this.#serviceRegistry.get(serviceName as keyof typeof serviceConstructors);
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
