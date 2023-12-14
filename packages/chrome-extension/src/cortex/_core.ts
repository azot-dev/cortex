// _core.ts

import { createCortexFactory } from '@azot-dev/cortex';
import { services } from './services/_services';
import { store } from './store/_store';
import { Dependencies } from './dependencies/_dependencies';

export const Core = createCortexFactory<Dependencies>()(store, services);

export const core = new Core();
