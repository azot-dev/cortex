import { Box, Tab, Tabs, Typography } from '@mui/material';
import { FC, PropsWithChildren, useState } from 'react';
import { VerticalPanel } from '../../components/vertical-panel';
import ReactJson from 'react-json-view';
import { useAppSelector } from '../../../cortex/utils/hooks';
import { currentStoreVM } from './current-store.vm';
import { DIFF_MARKER, diffStoreVM } from './diff-store.vm';
import { JSONTree } from 'react-json-tree';

export const StorePanel: FC = () => {
  const [value, setValue] = useState(0);

  // @ts-ignore
  const currentStore = useAppSelector(currentStoreVM);
  // @ts-ignore
  const diffStore = useAppSelector(diffStoreVM);

  console.log({ diffStore });

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const valueRenderer = (raw: any, value: any) => {
    console.log({ raw, value });
    if (value?.startsWith?.(DIFF_MARKER)) {
      const diffString = value.substring(DIFF_MARKER.length);
      const [oldValue, newValue] = diffString.split(' => ');
      return (
        <span>
          <span style={{ color: 'red' }}>{oldValue}</span>
          <span> {'=>'} </span>
          <span style={{ color: 'green' }}>{newValue}</span>
        </span>
      );
    }
    return <span>{raw}</span>;
  };

  const theme = {
    scheme: 'monokai',
    author: 'wimer hazenberg (http://www.monokai.nl)',
    base00: '#272822',
    base01: '#383830',
    base02: '#49483e',
    base03: '#75715e',
    base04: '#a59f85',
    base05: '#f8f8f2',
    base06: '#f5f4f1',
    base07: '#f9f8f5',
    base08: '#f92672', // null
    base09: '#fd971f', // boolean, number
    base0A: '#f4bf75',
    base0B: '#a6e22e',
    base0C: '#a1efe4',
    base0D: '#66d9ef', // keys
    base0E: '#ae81ff',
    base0F: '#cc6633',
  };

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
          src={currentStore}
          theme={'apathy'}
          style={{ backgroundColor: 'transparent' }}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <JSONTree
          data={diffStore}
          shouldExpandNodeInitially={() => true}
          valueRenderer={valueRenderer}
          hideRoot={true}
          theme={theme}
          getItemString={() => ''}
        />
      </CustomTabPanel>
    </VerticalPanel>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

const CustomTabPanel: FC<
  PropsWithChildren<{
    index: number;
    value: number;
  }>
> = ({ children, value, index, ...other }) => {
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
};
