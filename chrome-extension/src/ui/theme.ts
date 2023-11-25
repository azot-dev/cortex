import { createTheme } from '@mui/material';

export const theme = createTheme({
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
