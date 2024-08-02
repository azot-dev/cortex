import { Observable } from "@legendapp/state";
import { legacy_createStore as createStore, applyMiddleware, compose } from "redux";
import type { GetStore } from "../../types/service-constructor";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

enum ACTIONS {
  STORE_CHANGED = "STORE_CHANGED",
  INIT_STORE = "INIT_STORE",
}

type Action = { type: typeof ACTIONS.STORE_CHANGED; payload: any } | { type: typeof ACTIONS.INIT_STORE; payload: any };

const initStore = (store: any) => {
  return {
    type: ACTIONS.INIT_STORE,
    payload: store,
  };
};

const changeStore = (store: any) => {
  return {
    type: ACTIONS.STORE_CHANGED,
    payload: store,
  };
};

const methodCalled = (serviceName: string, methodName: string) => {
  return {
    type: `[${serviceName}] ${methodName}`,
  };
};

type Params = {
  active?: boolean;
  host?: string;
  port?: number;
};

export const createDebuggerService = ({ host, port, active }: Params) => {
  if (!active) {
    return class DebuggerService {};
  }
  type Store = Observable<GetStore<any>>;

  let composeEnhancers = compose;
  let store: Store;
  let reduxStore: any;

  const rootReducer = (state: any = {}, action: Action) => {
    switch (action.type) {
      case ACTIONS.STORE_CHANGED:
        return action.payload;
      case ACTIONS.INIT_STORE:
        return action.payload;
      default:
        return state;
    }
  };

  const initDebugger = () => {
    if (typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
      composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

      reduxStore = createStore(rootReducer, composeEnhancers(applyMiddleware()));

      return;
    }
    const composeWithDevTools = require("remote-redux-devtools").composeWithDevTools;
    composeEnhancers = composeWithDevTools({
      name: "Cortex Debugger",
      realtime: true,
      port: port ?? 8000,
      host: host ?? "192.168.1.1",
    });

    reduxStore = createStore(rootReducer, composeEnhancers(applyMiddleware()));
  };

  const decorateAllMethods = (serviceName: string, instance: any) => {
    const prototype = Object.getPrototypeOf(instance);

    Object.getOwnPropertyNames(prototype).forEach((methodName) => {
      if (methodName === "constructor") return;

      const descriptor = Object.getOwnPropertyDescriptor(prototype, methodName);
      if (descriptor && typeof descriptor.value === "function") {
        const originalMethod = descriptor.value;

        instance[methodName] = function (...args: any[]) {
          reduxStore?.dispatch(methodCalled(serviceName, methodName));
          // @ts-ignore
          return originalMethod.apply(this, args);
        }.bind(instance);
      }
    });
  };

  return class DebuggerService {
    constructor(injectedStore: Observable<GetStore<any>>, _state: any, _dependencies: Record<string, any>, serviceRegistry: any) {
      store = injectedStore as Observable<GetStore<any>>;
      initDebugger();

      const serviceNames: string[] = serviceRegistry.getNames();
      serviceNames.forEach((serviceName) => {
        const service = serviceRegistry.get(serviceName);
        decorateAllMethods(serviceName, service);
      });
      reduxStore?.dispatch(initStore(store.get()));
      store.onChange((newStore) => {
        reduxStore?.dispatch(changeStore(newStore.value));
      });
    }
  };
};
