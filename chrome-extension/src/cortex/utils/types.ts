// utils/types.ts

import { Observable } from '@legendapp/state';
import { services } from '../services/_services';
import { store } from '../store/_store';

export type StoreType = typeof store;

export type Store = Observable<StoreType>;

export type Services = typeof services;
