import React from 'react';
import {
  XCoreProvider,
  createAppSelector,
  createAppService,
} from '../lib/react/provider';
import { CoreClass } from '.';

const useMyAppSelector = createAppSelector<InstanceType<typeof CoreClass>>();
const useMyAppService = createAppService<InstanceType<typeof CoreClass>>();

const App = () => {
  // const theme = useMyAppSelector((state) => state.settings.theme.get());
  const authService = useMyAppService('AuthService');
  const something = useMyAppSelector((state) => state.user);
  return <div></div>;
};

const AppWrapper = () => {
  return (
    <XCoreProvider coreInstance={new CoreClass()}>
      <App />
    </XCoreProvider>
  );
};
