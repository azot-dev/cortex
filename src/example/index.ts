// example/index.ts

import { createCoreFactory } from '../lib/coreFactory';
import { serviceConstructors } from './services/_services';

type DependenciesType = {
  apiClient: any;
};

const myStore = {
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
  typeof myStore,
  DependenciesType
>(myStore, serviceConstructors);
const core = new CoreClass({});

const myAuthService = core.getService('AuthService');
myAuthService.authenticate();
