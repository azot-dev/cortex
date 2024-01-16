import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { CortexProvider } from '@azot-dev/react-cortex';
import { Core } from './cortex/_core.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <CortexProvider coreInstance={new Core()}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </CortexProvider>
);
