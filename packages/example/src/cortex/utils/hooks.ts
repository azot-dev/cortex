// utils/hooks.ts

import { createCortexHooks } from '@azot-dev/react-cortex';
import { Services } from './types';

export const {
  useAppSelector,
  useLazyMethod,
  useMethod,
  useService,
  useStore,
} = createCortexHooks<Services>();
