'use client';

import { createTheme } from '@mui/material';
import Link from 'next/link';

export const redTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-mui-color-scheme',
  },
  typography: {
    fontFamily: 'var(--font-montserrat)',
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#C53024',
          dark: '#892119',
          light: '#D0594F',
          contrastText: '#FFFFFF',
        },
        secondary: {
          main: '#616161',
          dark: '#434343',
          light: '#808080',
          contrastText: '#FFFFFF',
        },
        error: {
          main: '#C53024',
          dark: '#AA210F',
          light: '#E35545',
          contrastText: '#FFFFFF',
        },
        warning: {
          main: '#FDA700',
          dark: '#FB7A00',
          light: '#FAE700',
          contrastText: '#FFFFFF',
        },
        info: {
          main: '#0288D1',
          dark: '#01579B',
          light: '#03A9F4',
          contrastText: '#FFFFFF',
        },
        success: {
          main: '#2E7D32',
          dark: '#1B5E20',
          light: '#4CAF50',
          contrastText: '#FFFFFF',
        },
        text: {
          primary: 'rgba(0, 0, 0, 0.87)',
        },
        common: {},
        action: {
          disabledBackground: 'rgba(0, 0, 0, 0.12)',
        },
        background: {
          default: '#F5F5F5',
          paper: '#FFFFFF',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#E29591',
          dark: '#9E6865',
          light: '#E7AAA7',
          contrastText: 'rgba(0, 0, 0, 0.87)',
        },
        secondary: {
          main: '#EEEEEE',
          dark: '#A6A6A6',
          light: '#F1F1F1',
          contrastText: 'rgba(0, 0, 0, 0.87)',
        },
        error: {
          main: '#E6462A',
          dark: '#C53024',
          light: '#D8716A',
          contrastText: '#FFFFFF',
        },
        warning: {
          main: '#FFEF3F',
          dark: '#FEC000',
          light: '#FFF263',
          contrastText: 'rgba(0, 0, 0, 0.87)',
        },
        info: {
          main: '#29B6F6',
          dark: '#0288D1',
          light: '#4FC3F7',
          contrastText: 'rgba(0, 0, 0, 0.87)',
        },
        success: {
          main: '#66BB6A',
          dark: '#388E3C',
          light: '#81C784',
          contrastText: 'rgba(0, 0, 0, 0.87)',
        },
        text: {
          primary: '#FFFFFF',
        },
        common: {},
        action: {
          disabledBackground: 'rgba(255, 255, 255, 0.12)',
        },
        background: {
          default: '#121212',
          paper: '#121212',
        },
      },
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        LinkComponent: Link,
      },
    },
    MuiLink: {
      defaultProps: {
        component: Link,
        variant: 'body1',
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        asterisk: {
          color: '#C53024',
          marginLeft: 5,
        },
      },
    },
  },
});

export default redTheme;
