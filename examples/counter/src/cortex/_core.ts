import { createCortexFactory } from '@azot-dev/cortex';
import { services } from './services/_services';
import { Dependencies } from './dependencies/_dependencies';

export const Core = createCortexFactory<Dependencies>()(services);
