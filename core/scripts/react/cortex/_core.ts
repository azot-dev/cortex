// _core.ts

import { createCoreFactory } from '@azot-dev/x-core';
import { services } from './services/_services';
import { store } from './store/_store';
import { Dependencies } from './dependencies/_dependencies';

export const Core = createCoreFactory<Dependencies>()(store, services);
