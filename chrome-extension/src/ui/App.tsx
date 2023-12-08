import { FC, useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material';
import { CortexProvider } from '@azot-dev/react-cortex';
import { core } from '../cortex/_core';
import { theme } from './theme';
import 'typeface-roboto-mono';
import { TopBanner } from './components/top-banner';
import { ActionsWindow } from './windows/actions';
import { SettingsWindow } from './windows/settings';
import { useAppSelector } from '../cortex/utils/hooks';

const windows = [<ActionsWindow />, <SettingsWindow />];

const App: FC = () => {
  // @ts-ignore
  const windowIndex = useAppSelector((state) => state.windows.index.get());

  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.backgroundColor = theme.palette.background.default;
  }, []);

  return (
    <div className="App">
      <TopBanner />
      {windows[windowIndex]}
    </div>
  );
};

const AppWrapper = () => {
  return (
    <ThemeProvider theme={theme}>
      <CortexProvider coreInstance={core}>
        <App />
      </CortexProvider>
    </ThemeProvider>
  );
};

export default AppWrapper;
