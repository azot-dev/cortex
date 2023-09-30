// index.ts

import { createCoreFactory } from './coreFactory';
import { serviceConstructors } from './services';

type StoreType = {
  user: {
    id: string;
    name: string;
  };
  settings: {
    theme: string;
  };
};

type DependenciesType = {
  apiClient: any;
};

const myStore: StoreType = {
  user: {
    id: '1',
    name: 'John',
  },
  settings: {
    theme: 'dark',
  },
};

const CoreClass = createCoreFactory<
  typeof serviceConstructors,
  StoreType,
  DependenciesType
>(myStore, serviceConstructors);
const core = new CoreClass({});

const myAuthService = core.getService('AuthService');
myAuthService.authenticate();
