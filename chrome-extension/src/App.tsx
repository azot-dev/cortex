import React, { useEffect, useState, FC, PropsWithChildren } from 'react';
import ReactJson from 'react-json-view';
import Split from 'react-split';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Chip from '@mui/material/Chip';

const theme = createTheme({
  components: {
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          color: '#D0D0D0',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '100%',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
      },
    },
  },
  palette: {
    primary: {
      main: '#D0D0D0',
    },
    text: {
      primary: '#D0D0D0',
      secondary: '#D0D0D0',
    },
    background: {
      default: '#2A2F3A',
    },
  },
});

function App() {
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.backgroundColor = theme.palette.background.default;
  }, []);
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
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
          <DisplayPanel />
          <HistoryPanel />
          <StorePanel />
        </Split>
      </ThemeProvider>
    </div>
  );
}

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

const VerticalPanel: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div style={{ height: '100%', backgroundColor: '#2A2F3A' }}>{children}</div>
  );
};

const PanelContent: FC<PropsWithChildren> = ({ children }) => {
  return <Box p={1}>{children}</Box>;
};

function DisplayPanel() {
  return (
    <VerticalPanel>
      <PanelContent>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Store"
          />
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Service 1 super super super cool"
          />
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Service 2"
          />
        </FormGroup>
      </PanelContent>
    </VerticalPanel>
  );
}

function HistoryPanel() {
  return (
    <VerticalPanel>
      <Box sx={{ marginLeft: '-5px', marginRight: '-5px' }}>
        <Event label="salut" />
        <Event label="salut" />
        <Event label="salut" />
      </Box>
    </VerticalPanel>
  );
}

const Event: FC<{
  label: string;
  color?: string;
  date?: string;
  baseDate?: string;
}> = ({ baseDate, color, date, label }) => {
  return (
    <Box
      height={40}
      sx={(theme) => ({
        borderBottom: 1,
        borderColor: theme.palette.primary.main,
        display: 'flex',
        justifyContent: 'space-between',
        paddingLeft: '10px',
        paddingRight: '10px',
        alignItems: 'center',
      })}
    >
      <Typography color={color ?? 'textPrimary'}>{label}</Typography>
      <Chip
        label="Custom delete icon"
        variant="outlined"
        size="small"
        sx={{
          backgroundColor: '#3D444F',
          border: '1px solid #74767C',
          borderRadius: 2,
        }}
      />
    </Box>
  );
};

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function StorePanel() {
  const [state, setState] = useState([]);
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    // console.log('envoi du message get current state');
    // chrome.runtime.sendMessage(
    //   { type: 'GET_CURRENT_STATE' },
    //   function (response) {
    //     if (response?.data) {
    //       setState(response.data);
    //     }
    //   }
    // );
    // chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    //   if (request.type === 'UPDATE_UI') {
    //     setState(request.data);
    //   }
    // });
  }, []);

  return (
    <VerticalPanel>
      <div
        style={{
          height: '50px',
          marginBottom: '15px',
          backgroundColor: '#3D444F',
          marginLeft: -5,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Tabs value={value} onChange={handleChange}>
          <Tab label="State" {...a11yProps(0)} />
          <Tab label="Diff" {...a11yProps(1)} />
        </Tabs>
      </div>
      <CustomTabPanel value={value} index={0}>
        <ReactJson
          src={state}
          theme={'apathy'}
          style={{ backgroundColor: 'transparent' }}
        />{' '}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Item Two
      </CustomTabPanel>
    </VerticalPanel>
  );
}

export default App;
