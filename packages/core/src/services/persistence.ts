// import { BaseService } from "../base";
// import { ServiceConstructor } from "../types/service-constructor";

// export abstract class Service extends BaseService<undefined, {}, {}> {
//   constructor(...args: [any, any, any]) {
//     super(...args);
//   }
// }

// export class PersistenceService<Store, Services extends Record<string, ServiceConstructor<any, any, Dependencies>>, Dependencies> extends BaseService<
//   Store,
//   Services,
//   Dependencies
// > {
//   persist(services: (keyof Services)[]) {
//     if (!this.dependencies.persistenceStorage) {
//       throw new Error("You need to use a dependency as persistenceStorage to use the persistence service");
//     }
//     for (const serviceKey in services) {
//       // d'abord on check que la clé existe dans le storage et on la charge
//       const currentService = this.getService(serviceKey);
//       console.log({ currentService });
//       const state = currentService.state;
//       console.log({ state });
//       const lastStoredState = this.dependencies.persistenceStorage.getItem(`@cortex-persistence-service/${serviceKey}`);
//       if (lastStoredState) {
//         state.set(lastStoredState);
//       }
//       state.onChange((state: any) => {
//         this.dependencies.persistenceStorage.setItem(`@cortex-persistence-service/${serviceKey}`, state);
//       });
//     }
//   }

//   clean() {}

//   getClientName() {
//     return this.store.client.name;
//   }
// }

// // persist(['user', 'counter'])
// // donc déjà autocompletion par rapport aux autres services

// // il ne connait pas les services, on peut lui injecter les types comme tout le monde ensuite?

// // Pas de rehydratation en tant que fonction, elle va s'effectuer dans le persist, si le persist n'est plus appelé on ne chargera plus la data dans le store
