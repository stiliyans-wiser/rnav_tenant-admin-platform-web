'use client';

import { createTheme } from '@mui/material';
import Link from 'next/link';
import { colorSchemeSelectorConst, typographyConst } from '@/features/theming/constants/themingConst';
import { createFontFaceDeclarations } from '@/features/theming/utils/themeUtils';

export const lightBlueTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: colorSchemeSelectorConst,
  },
  typography: {
    fontFamily: typographyConst.fontFamily,
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#0288D1',
          dark: '#015F92',
          light: '#349FDA',
          contrastText: '#FFFFFF',
        },
        secondary: {
          main: '#455A64',
          dark: '#303E46',
          light: '#6A7B83',
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
          main: '#81D4FA',
          dark: '#5A94AF',
          light: '#9ADCFB',
          contrastText: 'rgba(0, 0, 0, 0.87)',
        },
        secondary: {
          main: '#B0BEC5',
          dark: '#7B8589',
          light: '#BFCBD0',
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
    MuiCssBaseline: {
      styleOverrides: createFontFaceDeclarations(typographyConst.fontFamily),
    },
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

export default lightBlueTheme;
