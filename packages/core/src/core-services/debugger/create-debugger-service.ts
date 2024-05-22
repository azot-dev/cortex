import { Observable } from "@legendapp/state";
import { legacy_createStore as createStore, applyMiddleware, compose } from "../../../../../node_modules/redux";
import { GetStore } from "../../types/service-constructor";

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

type Params = {
  hostname?: string;
  port?: number;
};

export const createDebuggerService = ({ hostname, port }: Params) => {
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
    if (process.env.NODE_ENV !== "development") {
      return;
    }
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
      hostname: hostname ?? "192.168.1.1",
    });

    reduxStore = createStore(rootReducer, composeEnhancers(applyMiddleware()));
    console.log({ reduxStore });
  };

  return class DebuggerService {
    constructor(injectedStore: Observable<GetStore<any>>, _state: any, _dependencies: Record<string, any>, _serviceRegistry: any) {
      store = injectedStore as Observable<GetStore<any>>;
      initDebugger();
      reduxStore.dispatch(initStore(store.get()));
      store.onChange((newStore) => {
        reduxStore.dispatch(changeStore(newStore.value));
      });
    }
  };
};
