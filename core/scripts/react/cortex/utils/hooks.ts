// utils/hooks.ts

import { createCortexHooks } from '@azot-dev/react-cortex';
import { Services, StoreType } from './types';

export const {
  useAppSelector,
  useService,
  useStore,
  useLazyMethod,
  useMethod,
} = createCortexHooks<StoreType, Services>();
