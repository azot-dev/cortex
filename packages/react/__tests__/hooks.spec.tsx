import { BaseService, createCortexFactory } from "@azot-dev/cortex/src";
import { CortexProvider, createCortexHooks } from "../src/provider";
import React, { ReactNode } from "react";
import { act, renderHook } from "@testing-library/react-hooks";
import { observable } from "@legendapp/state";

jest.useFakeTimers();

export abstract class Service<T = undefined> extends BaseService<T, typeof services, {}> {
  constructor(...args: [any, any, any, any]) {
    super(...args);
  }
}

type State = {
  isLoggedIn: boolean;
};

class UserService extends Service<State> {
  initialState = { isLoggedIn: false };
  static initialState: State = {
    isLoggedIn: false,
  };

  login() {
    this.state.isLoggedIn.set(true);
  }
}

type CountState = { count: number };
class CounterService extends Service<CountState> {
  static initialState = { count: 0 };
  increment() {
    this.state.count.set((count) => count + 1);
  }

  incrementAfter5Seconds() {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.increment();
        resolve();
      }, 5000);
    });
  }

  rejectAfter5Seconds() {
    return new Promise<void>((_resolve, reject) => {
      setTimeout(() => {
        reject(new Error("rejection"));
      }, 5000);
    });
  }

  resolve2After5Seconds() {
    return new Promise<number>((resolve) => {
      setTimeout(() => {
        resolve(2);
      }, 5000);
    });
  }
}

const services = {
  user: UserService,
  counter: CounterService,
};

export const Core = createCortexFactory()(services);

export const { useAppSelector, useLazyMethod, useMethod, useService, useStore, useAppState } = createCortexHooks<typeof services>();

describe("Cortex hooks", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe("useStore", () => {
    it("should be rendered", async () => {
      const core = new Core();
      const wrapper = ({ children }: { children: ReactNode }) => <CortexProvider coreInstance={core}>{children}</CortexProvider>;
      const { result } = renderHook(() => useStore(), { wrapper });

      expect(result.current).not.toBeNull();
      expect(result.current).toBeDefined();
    });

    it("should give access to the store", async () => {
      const core = new Core();
      const wrapper = ({ children }: { children: ReactNode }) => <CortexProvider coreInstance={core}>{children}</CortexProvider>;
      const { result } = renderHook(() => useStore(), { wrapper });
      expect(result.current.counter.count.get()).toBe(0);
    });
  });

  describe("useAppSelector", () => {
    it("should give access to the store parts", async () => {
      const core = new Core();
      const wrapper = ({ children }: { children: ReactNode }) => <CortexProvider coreInstance={core}>{children}</CortexProvider>;
      const { result } = renderHook(() => useAppSelector((state) => state.counter.count.get()), { wrapper });
      expect(result.current).toBe(0);
    });
  });

  describe("useAppState", () => {
    it("should access and modify a state if it is a callback", async () => {
      const core = new Core();
      const wrapper = ({ children }: { children: ReactNode }) => <CortexProvider coreInstance={core}>{children}</CortexProvider>;
      const { result } = renderHook(() => useAppState((state) => state.counter.count), { wrapper });
      expect(result.current[0]).toBe(0);

      act(() => {
        result.current[1](3);
      });

      expect(result.current[0]).toBe(3);
    });
  });

  describe("useService", () => {
    it("should modify the store", async () => {
      const core = new Core();
      const wrapper = ({ children }: { children: ReactNode }) => <CortexProvider coreInstance={core}>{children}</CortexProvider>;
      const { result } = renderHook(() => useService("counter"), { wrapper });

      act(() => {
        result.current.increment();
      });

      expect(core.store.counter.count.get()).toBe(1);
    });

    it("should not access to getState, setState and init", async () => {
      const core = new Core();
      const wrapper = ({ children }: { children: ReactNode }) => <CortexProvider coreInstance={core}>{children}</CortexProvider>;
      const { result } = renderHook(() => useService("counter"), { wrapper });

      expect((result.current as any).getState).toBeUndefined();
      expect((result.current as any).setState).toBeUndefined();
      expect((result.current as any).init).toBeUndefined();
    });
  });

  const getHookRender = (methodKey: CounterServiceMethodNames) => {
    const core = new Core();
    const wrapper = ({ children }: { children: ReactNode }) => <CortexProvider coreInstance={core}>{children}</CortexProvider>;

    // @ts-ignore
    return renderHook(() => useLazyMethod(core.getService("counter")[methodKey]), { wrapper });
  };

  describe("useMethod", () => {
    it("should be called when the component renders", async () => {
      const core = new Core();
      const wrapper = ({ children }: { children: ReactNode }) => <CortexProvider coreInstance={core}>{children}</CortexProvider>;

      const { result, waitFor } = renderHook(() => useMethod(core.getService("counter").resolve2After5Seconds), { wrapper });

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      await waitFor(() => {
        return result.current.isCalled === true;
      });

      expect(result.current.isCalled).toBe(true);
    });
  });

  describe("useLazyMethod", () => {
    it.only("should be executed with a string parameter", async () => {
      const core = new Core();
      const wrapper = ({ children }: { children: ReactNode }) => <CortexProvider coreInstance={core}>{children}</CortexProvider>;

      const { result, waitFor } = renderHook(() => useLazyMethod("counter.resolve2After5Seconds"), { wrapper });

      act(() => {
        result.current.call();
        jest.advanceTimersByTime(5000);
      });

      await waitFor(() => {
        return result.current.isCalled === true;
      });

      expect(result.current.isCalled).toBeTruthy();
      expect(result.current.isSuccess).toBeTruthy();
      expect(result.current.data).toBe(2);
    });
    it("should not be called when the component renders, without calling call()", async () => {
      const { result } = getHookRender("resolve2After5Seconds");

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(result.current.isCalled).toBe(false);
    });

    describe("call", () => {
      it("should return the data if the promise is resolved", async () => {
        const core = new Core();
        const wrapper = ({ children }: { children: ReactNode }) => <CortexProvider coreInstance={core}>{children}</CortexProvider>;

        const { result } = renderHook(() => useLazyMethod(core.getService("counter").resolve2After5Seconds), { wrapper });

        const initiateAsyncOperation = () => {
          return result.current.call();
        };

        let resolvedValue: number | undefined;

        await act(async () => {
          const asyncOperation = initiateAsyncOperation();
          jest.advanceTimersByTime(5000);

          resolvedValue = await asyncOperation;
        });

        expect(resolvedValue).toBe(2);
      });
    });

    describe("data", () => {
      it("should be undefined before the method to be called", () => {
        const { result } = getHookRender("resolve2After5Seconds");
        expect(result.current.data).toBeUndefined();
      });

      it("should still be undefined if there is an error", async () => {
        const { result, waitFor } = getHookRender("rejectAfter5Seconds");

        act(() => {
          result.current.call();
          jest.advanceTimersByTime(5000);
        });

        await waitFor(() => {
          return result.current.isLoading === false;
        });

        expect(result.current.data).toBeUndefined();
      });

      it("should be the result if there is no error", async () => {
        const { result, waitFor } = getHookRender("resolve2After5Seconds");

        act(() => {
          result.current.call();
          jest.advanceTimersByTime(5000);
          jest.runOnlyPendingTimers();
        });

        await waitFor(() => {
          return result.current.data === 2;
        });
        expect(result.current.data).toBe(2);
      });
    });

    describe("loading state", () => {
      it("should be falsy before the call is done", () => {
        const { result } = getHookRender("resolve2After5Seconds");
        expect(result.current.isLoading).toBeFalsy();
      });

      it("should be truthy while the data is resolving", () => {
        const { result } = getHookRender("resolve2After5Seconds");
        act(() => {
          result.current.call();
          jest.advanceTimersByTime(2000);
        });
        expect(result.current.isLoading).toBeTruthy();
      });

      it("should be falsy after the promise is resolved", async () => {
        const { result, waitFor } = getHookRender("resolve2After5Seconds");
        act(() => {
          result.current.call();
          jest.advanceTimersByTime(5000);
          jest.runOnlyPendingTimers();
        });

        await waitFor(() => {
          return result.current.isLoading === false;
        });
        expect(result.current.isLoading).toBeFalsy();
      });

      it("should be falsy after the promise is rejected", async () => {
        const { result, waitFor } = getHookRender("rejectAfter5Seconds");
        act(() => {
          result.current.call();
          jest.advanceTimersByTime(5000);
          jest.runOnlyPendingTimers();
        });

        await waitFor(() => {
          return result.current.isLoading === false;
        });

        expect(result.current.isLoading).toBeFalsy();
      });
    });

    describe("error", () => {
      it("should update with the error message", async () => {
        const { result, waitFor } = getHookRender("rejectAfter5Seconds");
        act(() => {
          result.current.call();
          jest.advanceTimersByTime(5000);
          jest.runOnlyPendingTimers();
        });

        await waitFor(() => {
          return result.current.isLoading === false;
        });

        expect(result.current.error).toBeDefined();
        expect(result.current.error?.message).toBe("rejection");
      });

      it("should not update if the promise is resolved", async () => {
        const { result, waitFor } = getHookRender("resolve2After5Seconds");
        act(() => {
          result.current.call();
          jest.advanceTimersByTime(5000);
          jest.runOnlyPendingTimers();
        });

        await waitFor(() => {
          return result.current.isLoading === false;
        });

        expect(result.current.error).toBe(null);
      });
    });
    describe("isError", () => {
      it("should be false if the promise is resolved", async () => {
        const { result, waitFor } = getHookRender("resolve2After5Seconds");
        act(() => {
          result.current.call();
          jest.advanceTimersByTime(5000);
          jest.runOnlyPendingTimers();
        });

        await waitFor(() => {
          return result.current.isLoading === false;
        });

        expect(result.current.isError).toBeFalsy();
      });

      it("should be true if the promise is rejected", async () => {
        const { result, waitFor } = getHookRender("rejectAfter5Seconds");
        act(() => {
          result.current.call();
          jest.advanceTimersByTime(5000);
          jest.runOnlyPendingTimers();
        });

        await waitFor(() => {
          return result.current.isLoading === false;
        });

        expect(result.current.isError).toBeTruthy();
      });
    });
    describe("isSuccess", () => {
      it("should be true if the promise is resolved", async () => {
        const { result, waitFor } = getHookRender("resolve2After5Seconds");
        act(() => {
          result.current.call();
          jest.advanceTimersByTime(5000);
          jest.runOnlyPendingTimers();
        });

        await waitFor(() => {
          return result.current.isLoading === false;
        });

        expect(result.current.isSuccess).toBeTruthy();
      });

      it("should be false if the promise is rejected", async () => {
        const { result, waitFor } = getHookRender("rejectAfter5Seconds");
        act(() => {
          result.current.call();
          jest.advanceTimersByTime(5000);
          jest.runOnlyPendingTimers();
        });

        await waitFor(() => {
          return result.current.isLoading === false;
        });

        expect(result.current.isSuccess).toBeFalsy();
      });
    });

    describe("isCalled", () => {
      it("should be false before the call", async () => {
        const { result } = getHookRender("resolve2After5Seconds");

        expect(result.current.isCalled).toBeFalsy();
      });

      it("should be true after the call", async () => {
        const { result, waitFor } = getHookRender("rejectAfter5Seconds");
        act(() => {
          result.current.call();
          jest.advanceTimersByTime(5000);
          jest.runOnlyPendingTimers();
        });

        await waitFor(() => {
          return result.current.isLoading === false;
        });

        expect(result.current.isCalled).toBeTruthy();
      });
    });
  });
});

type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

type MethodNamesOfClass<T extends abstract new (...args: any) => any> = FunctionPropertyNames<InstanceType<T>>;

type CounterServiceMethodNames = MethodNamesOfClass<typeof CounterService>;
