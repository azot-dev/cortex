// _core.ts

import { createCortexFactory } from '@azot-dev/x-core';
import { services } from './services/_services';
import { store } from './store/_store';
import { Dependencies } from './dependencies/_dependencies';

export const Core = createCortexFactory<Dependencies>()(store, services);
