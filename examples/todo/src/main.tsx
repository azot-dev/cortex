import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { CortexProvider } from '@azot-dev/react-cortex';
import { Core } from './cortex/_core.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CortexProvider coreInstance={new Core()}>
      <App />
    </CortexProvider>
  </React.StrictMode>
);
