import { createTheme } from '@mui/material';

export const theme = createTheme({
  typography: {
    fontFamily: 'Roboto Mono, monospace',
    fontSize: 11,
    allVariants: {
      letterSpacing: '0.3px',
    },
  },
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
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#D0D0D0',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
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
    success: {
      main: '#B5F7C3',
      light: '#B5F7C3',
      dark: '#B5F7C3',
    },
    error: {
      main: '#F7ADB4',
      light: '#F7ADB4',
      dark: '#F7ADB4',
    },
  },
});
