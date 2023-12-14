import { Box } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

export const PanelContent: FC<PropsWithChildren> = ({ children }) => {
  return <Box p={1}>{children}</Box>;
};
