import { Box, Tab, Tabs, Typography } from '@mui/material';
import { FC, PropsWithChildren, useRef, useState } from 'react';
import { VerticalPanel } from '../../components/vertical-panel';
import { useAppSelector } from '../../../cortex/utils/hooks';
import { currentStoreVM } from './current-store.vm';
import { DIFF_MARKER, diffStoreVM } from './diff-store.vm';
import { JSONTree, KeyPath } from 'react-json-tree';

export const StorePanel: FC = () => {
  const [value, setValue] = useState(0);
  const [openNodes, setOpenNodes] = useState<Set<string>>(new Set());
  const treeContainerRef = useRef<HTMLDivElement>(null);

  // @ts-ignore
  const currentStore = useAppSelector(currentStoreVM);
  // @ts-ignore
  const diffStore = useAppSelector(diffStoreVM);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const shouldExpandNodeInitially = (keyPath: KeyPath): boolean => {
    const pathString = keyPath.join('.');
    return openNodes.has(pathString);
  };

  const labelRenderer = (keyPath: KeyPath) => {
    const pathString = keyPath.join('.');
    const toggleNode = () => {
      setOpenNodes((prevOpenNodes) => {
        const newOpenNodes = new Set(prevOpenNodes);
        if (newOpenNodes.has(pathString)) {
          newOpenNodes.delete(pathString);
        } else {
          newOpenNodes.add(pathString);
        }
        return newOpenNodes;
      });
    };

    let fullLineWidth = 0;
    if (treeContainerRef.current) {
      fullLineWidth = treeContainerRef.current.offsetWidth;
    }

    return (
      <div style={{ position: 'relative' }}>
        <div
          onClick={toggleNode}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: -20,
            width: `${fullLineWidth}px`,
            cursor: 'pointer',
          }}
        />
        <span>{keyPath[keyPath.length - 1]}</span>
      </div>
    );
  };

  const valueRenderer = (raw: any, value: any) => {
    console.log({ raw, value });
    if (value?.startsWith?.(DIFF_MARKER)) {
      const diffString = value.substring(DIFF_MARKER.length);
      const [oldValue, newValue] = diffString.split(' => ');
      return (
        <span>
          <span
            style={{
              backgroundColor: '#8B0000',
              paddingLeft: 3,
              paddingRight: 3,
              paddingTop: 1,
              paddingBottom: 1,
              borderRadius: 3,
              color: 'white',
              textDecoration: 'line-through',
            }}
          >
            {oldValue}
          </span>
          <span> {'=>'} </span>
          <span
            style={{
              backgroundColor: '#006500',
              color: 'white',
              paddingLeft: 3,
              paddingRight: 3,
              paddingTop: 1,
              paddingBottom: 1,
              borderRadius: 3,
            }}
          >
            {newValue}
          </span>
        </span>
      );
    }
    return <span>{raw}</span>;
  };

  const theme = {
    scheme: 'monokai',
    author: 'wimer hazenberg (http://www.monokai.nl)',
    base00: 'transparent',
    base01: '#383830',
    base02: '#49483e',
    base03: '#75715e',
    base04: '#a59f85',
    base05: '#f8f8f2',
    base06: '#f5f4f1',
    base07: '#f9f8f5',
    base08: '#4EBCF7', // null
    base09: '#CA8E76', // boolean, number
    base0A: '#f4bf75',
    base0B: '#CA8E76',
    base0C: '#a1efe4',
    base0D: '#9CDCFD', // keys
    base0E: '#ae81ff',
    base0F: '#cc6633',
  };

  return (
    <VerticalPanel>
      <div
        style={{
          height: '50px',
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
        <div ref={treeContainerRef}>
          <JSONTree
            data={currentStore}
            hideRoot={true}
            theme={theme}
            getItemString={() => ''}
            shouldExpandNodeInitially={shouldExpandNodeInitially}
            labelRenderer={labelRenderer}
          />
        </div>
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
        <Box sx={{ p: 1 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};
