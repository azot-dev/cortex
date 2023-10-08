import React from 'react';
import {
  CortexProvider,
  createServiceHook,
  createSelectorHook,
} from '../lib/react/provider';
import { CoreClass } from '.';
import { Services, StoreType } from './utils/types';

const useMyAppSelector = createSelectorHook<StoreType>();
const useMyAppService = createServiceHook<Services>();

const App = () => {
  // const theme = useMyAppSelector((state) => state.settings.theme.get());
  const authService = useMyAppService('AuthService').authenticate();
  const something = useMyAppSelector((state) => state.settings.theme);
  return <div></div>;
};

const AppWrapper = () => {
  return (
    <CortexProvider coreInstance={new CoreClass()}>
      <App />
    </CortexProvider>
  );
};
