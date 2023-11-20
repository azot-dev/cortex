import { useEffect } from 'react';
import Split from 'react-split';
import { ThemeProvider } from '@mui/material';
import { CortexProvider } from '@azot-dev/react-cortex';
import { Core } from '../cortex/_core';
import { theme } from './theme';
import { ServicesPanel } from './panels/services.panel';
import { EventsPanel } from './panels/events/events.panel';
import { StorePanel } from './panels/store/store.panel';

const App = () => {
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.backgroundColor = theme.palette.background.default;
  }, []);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CortexProvider coreInstance={new Core()}>
          <Split
            sizes={[20, 40, 40]}
            minSize={100}
            expandToMin={false}
            gutterSize={2}
            gutterAlign="center"
            snapOffset={30}
            dragInterval={1}
            direction="horizontal"
            cursor="col-resize"
            style={{
              display: 'flex',
              height: '100vh',
            }}
            gutter={createGutter}
          >
            <ServicesPanel />
            <EventsPanel />
            <StorePanel />
          </Split>
        </CortexProvider>
      </ThemeProvider>
    </div>
  );
};

const createGutter = (
  _index: number,
  _direction: 'horizontal' | 'vertical'
) => {
  const gutter = document.createElement('div');
  gutter.style.width = '22px';
  gutter.style.position = 'relative';
  gutter.style.cursor = 'col-resize';

  gutter.style.paddingLeft = '5px';
  gutter.style.paddingRight = '5px';
  gutter.style.backgroundColor = '#2A2F3A';
  const inner = document.createElement('div');
  inner.style.position = 'absolute';
  inner.style.top = '0';
  inner.style.right = '5px';
  inner.style.bottom = '0';
  inner.style.left = '5px';
  inner.style.backgroundColor = '#74767C';
  inner.style.zIndex = '1';

  gutter.appendChild(inner);

  return gutter;
};

export default App;
