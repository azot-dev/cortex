// import { StorageGateway } from "../adapters/storage/storage.gateway";
// import { BaseService } from "../base";
// import { ServiceConstructor } from "../types/service-constructor";

// const PERSISTENCE_SERVICE_KEY = "@cortex-persistence-service";

// export const createPersistenceService = <Services>(persistenceStorage: StorageGateway) => {
//   return class {
//     persist(services: (keyof Services)[]) {
//       if (!persistenceStorage) {
//         throw new Error("You need to use a dependency as persistenceStorage to use the persistence service");
//       }
//       for (const serviceKey in services) {
//         // d'abord on check que la clé existe dans le storage et on la charge
//         const currentService = this.getService(serviceKey);
//         console.log({ currentService });
//         const state = currentService.state;
//         console.log({ state });
//         const lastStoredState = persistenceStorage.getItem(`${PERSISTENCE_SERVICE_KEY}/${serviceKey}`);
//         if (lastStoredState) {
//           state.set(lastStoredState);
//         }
//         state.onChange((state: any) => {
//           persistenceStorage.setItem(`${PERSISTENCE_SERVICE_KEY}/${serviceKey}`, state);
//         });
//       }
//     }

//     clean() {}
//   };
// };

// // persist(['user', 'counter'])
// // donc déjà autocompletion par rapport aux autres services

// // il ne connait pas les services, on peut lui injecter les types comme tout le monde ensuite?

// // Pas de rehydratation en tant que fonction, elle va s'effectuer dans le persist, si le persist n'est plus appelé on ne chargera plus la data dans le store

// // 2 possibilités: soit passer ça dans une dépendence, soit utiliser une factory, factory

export {};
