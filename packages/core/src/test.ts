// import { BaseService } from "./base";
// import { createCortexFactory } from "./coreFactory";
// import { InitialState } from "./decorators";

// export abstract class Service<T = undefined> extends BaseService<T, typeof services, {}> {
//   static initialState: any;

//   constructor(...args: [any, any, any]) {
//     super(...args);
//   }
// }

// type UserState = {
//   isLoggedIn: boolean;
// };

// const initialState: UserState = { isLoggedIn: false };

// @InitialState(initialState)
// class UserService extends Service<UserState> {

//   init(): void {}

//   login() {
//     this.getService("counter").increment();
//     const isLoggedIn = this.state.isLoggedIn.get();
//   }
// }

// type CountState = { count: number };
// class CounterService extends Service<CountState> {
//   initialState = { hello: "salut", count: 0 };
//   increment() {
//     this.state.count.set((count) => count + 1);
//   }
// }

// type TroisièmeState = { lolo: string };

// class TroisièmeService extends Service<TroisièmeState> {
//   initialState = { lolo: "", count: 0 };
//   increment() {
//     this.state.lolo.set((count) => count + 1);
//   }
// }

// const services = {
//   user: UserService,
//   counter: CounterService,
// };

// export const Core = createCortexFactory()(services);

// const c = new Core();
// c.store.user.isLoggedIn.get();
// c.getService("counter").increment();
// const u = c.getService("counter").getState();
// c.getService("counter").setState((state) => ({ count: state.count }));
