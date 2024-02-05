import React, { FC } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { CortexProvider } from '@azot-dev/react-cortex';
import { FetchApiAdapter } from './cortex/dependencies/api/fetch.api.adapter.ts';
import { Core } from './cortex/_core.ts';
import { AxiosApiAdapter } from './cortex/dependencies/api/axios.api.adapter.ts';
import { FakeApiAdapter } from './cortex/dependencies/api/fake.api.adapter.ts';
import { Box, Tab } from '@mui/material';
import { TabContext, TabList } from '@mui/lab';

const adapters = [
  { name: 'Fake adapter', adapter: new FakeApiAdapter() },
  { name: 'Axios adapter', adapter: new AxiosApiAdapter() },
  { name: 'Fetch adapter', adapter: new FetchApiAdapter() },
];

const Apps: FC = () => {
  const [value, setValue] = React.useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(Number(newValue));
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 2 }}>
          <TabList onChange={handleChange} aria-label="example">
            {adapters.map((adapter, index) => (
              <Tab label={adapter.name} key={adapter.name} value={index} />
            ))}
          </TabList>
        </Box>
        <CortexProvider coreInstance={new Core({ api: adapters[value].adapter })}>
          <App key={value} />
        </CortexProvider>
      </TabContext>
    </Box>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Apps />
  </React.StrictMode>
);
