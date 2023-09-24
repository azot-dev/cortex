import { createCoreFactory } from './coreFactory';
// Assurez-vous que les chemins d'importation sont corrects en fonction de l'organisation de votre projet.
import { serviceConstructors } from './services';
// Assurez-vous que les chemins d'importation sont corrects en fonction de l'organisation de votre projet.

// Exemple d'un store et de dépendances pour illustrer comment ils sont utilisés.
const myStore = {
  user: {
    id: '1',
    name: 'John',
  },
  settings: {
    theme: 'dark',
  },
};

const myDependencies = {
  apiClient: {}, // Supposons un client API simplifié ici.
};

// Créez le core avec le store, les dépendances et les services.
const core = createCoreFactory(myStore, myDependencies, serviceConstructors);

// Utilisation d'un service
const myAuthService = core.getService('AuthService');
myAuthService.authenticate();
