// utils/hooks.ts

import { createSelectorHook, createServiceHook } from '@azot-dev/react-cortex';
import { Services, StoreType } from './types';

export const useAppSelector = createSelectorHook<StoreType>();
export const useAppService = createServiceHook<Services>();
