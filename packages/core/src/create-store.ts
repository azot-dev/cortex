import { observable } from "@legendapp/state";
import { ServiceConstructor } from "./types/service-constructor";
import { cloneDeep } from "lodash";

export const createStore = <ServiceConstructorsType extends Record<string, ServiceConstructor<any, any, any>>>(
  serviceConstructors: ServiceConstructorsType
) => {
  type HasStaticInitialState<T> = T extends { initialState: infer S } ? S : never;

  type States = {
    [K in keyof ServiceConstructorsType as HasStaticInitialState<ServiceConstructorsType[K]> extends never ? never : K]: HasStaticInitialState<
      ServiceConstructorsType[K]
    >;
  };

  const rawStates: States = {} as States;
  for (const key in serviceConstructors) {
    if ("initialState" in serviceConstructors[key]) {
      // @ts-ignore
      rawStates[key] = serviceConstructors[key].initialState;
    }
  }

  return observable(cloneDeep(rawStates));
};
