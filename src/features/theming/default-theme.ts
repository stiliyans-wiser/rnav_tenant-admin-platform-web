import { createTheme } from '@mui/material';
import Link from 'next/link';

export const defaultTheme = createTheme({
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
          '50': '#E6FAF7',
          '100': '#65E4CC',
          '200': '#00D2AA',
          '300': '#01BD99',
          '400': '#04A788',
          '500': '#009376',
          '600': '#009482',
          '700': '#016855',
          '800': '#015444',
          '900': '#003F33',
          main: '#016855',
          dark: '#015444',
          light: '#04A788',
          contrastText: '#FFFFFF',
        },
        secondary: {
          '50': '#E7EAEA',
          '100': '#CFD5D5',
          '200': '#B7C1C1',
          '300': '#9EACAC',
          '400': '#6F8182',
          '500': '#566C6D',
          '600': '#3E5959',
          '700': '#274444',
          '800': '#0F2F2F',
          '900': '#1B1B19',
          main: '#566C6D',
          dark: '#274444',
          light: '#9EACAC',
          contrastText: '#FFFFFF',
        },
        error: {
          main: '#C53024',
          dark: '#B82B1D',
          light: '#E35545',
          contrastText: '#FFFFFF',
        },
        warning: {
          main: '#FDA700',
          dark: '#FB7A00',
          light: '#FFEC0F',
          contrastText: '#FFFFFF',
        },
        info: {
          contrastText: '#FFFFFF',
          main: '#0288D1',
        },
        success: {
          contrastText: '#FFFFFF',
          main: '#2E7D32',
        },
        text: {
          primary: 'rgba(0, 0, 0, 0.87)',
        },
        common: {},
        action: {
          disabledBackground: 'rgba(0, 0, 0, 0.12)',
        },
        background: {
          default: '#F2F4F1',
          paper: '#FFFFFF',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          '50': '#E6FAF7',
          '100': '#65E4CC',
          '200': '#00D2AA',
          '300': '#01BD99',
          '400': '#04A788',
          '500': '#009376',
          '600': '#009482',
          '700': '#016855',
          '800': '#015444',
          '900': '#003F33',
          main: '#00D2AA',
          dark: '#04A788',
          light: '#E6FAF7',
          contrastText: 'rgba(0, 0, 0, 0.87)',
        },
        secondary: {
          '50': '#E7EAEA',
          '100': '#CFD5D5',
          '200': '#B7C1C1',
          '300': '#9EACAC',
          '400': '#6F8182',
          '500': '#566C6D',
          '600': '#3E5959',
          '700': '#274444',
          '800': '#0F2F2F',
          '900': '#1B1B19',
          main: '#B7C1C1',
          dark: '#04A788',
          light: '#E6FAF7',
          contrastText: 'rgba(0, 0, 0, 0.87)',
        },
        error: {
          main: '#E6462A',
          dark: '#C53024',
          light: '#D8716A',
          contrastText: '#FFFFFF',
        },
        warning: {
          main: '#FFF263',
          dark: '#FEC000',
          light: '#FFF263',
          contrastText: 'rgba(0, 0, 0, 0.87)',
        },
        info: {
          contrastText: 'rgba(0, 0, 0, 0.87)',
          main: '#29B6F6',
        },
        success: {
          contrastText: 'rgba(0, 0, 0, 0.87)',
          main: '#66BB6A',
        },
        text: {
          primary: '#FFFFFF',
        },
        common: {},
        action: {
          disabledBackground: 'rgba(255, 255, 255, 0.12)',
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
  },
});

export default defaultTheme; 
