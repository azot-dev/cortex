import { Tab, Tabs, styled } from '@mui/material';
import { FC, useState } from 'react';
import { useAppSelector, useAppService } from '../../cortex/utils/hooks';

export const TopBanner: FC = () => {
  // @ts-ignore
  const windowIndex = useAppSelector((state) => state.windows.index.get());
  const WindowsService = useAppService('windows');

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    WindowsService.choose(newValue);
  };

  const a11yProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  };

  const StyledTab = styled(Tab)({
    fontSize: '0.65rem',
    minHeight: '30px',
    minWidth: '50px',
    marginRight: '0px',
    border: '1px solid #7B7D81',
    letterSpacing: '0.7px',
    padding: '8px 12px',
    '&:first-of-type': {
      borderTopLeftRadius: '4px',
      borderBottomLeftRadius: '4px',
    },
    '&:last-of-type': {
      borderTopRightRadius: '4px',
      borderBottomRightRadius: '4px',
    },
    '&.Mui-selected': {
      backgroundColor: '#6C6E75',
      color: 'white',
    },
    '&:not(.Mui-selected)': {
      backgroundColor: '#373C46',
      color: 'white',
    },
    '&:hover': {
      backgroundColor: '#808286',
    },
  });

  const StyledTabs = styled(Tabs)({
    display: 'flex',
    alignItems: 'center',
    minHeight: 0,
    '& .MuiTabs-indicator': {
      display: 'none',
    },
  });

  return (
    <div
      style={{
        height: 50,
        backgroundColor: '#565A62',
        borderBottom: '1px solid #7B7D81',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 15,
      }}
    >
      <StyledTabs value={windowIndex} onChange={handleChange}>
        <StyledTab label="Actions" {...a11yProps(0)} />
        <StyledTab label="Settings" {...a11yProps(1)} />
      </StyledTabs>
    </div>
  );
};
