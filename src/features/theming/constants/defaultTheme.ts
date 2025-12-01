'use client';

import { createTheme } from '@mui/material';
import Link from 'next/link';
import { colorSchemeSelectorConst, typographyConst } from '@/features/theming/constants/themingConst';
import { createFontFaceDeclarations } from '@/features/theming/utils/themeUtils';

export const defaultTheme = createTheme({
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
          '50': '#EAEBF6',
          '100': '#CBCCE8',
          '200': '#AAABD8',
          '300': '#898AC8',
          '400': '#726FBB',
          '500': '#5D55AF',
          '600': '#564CA5',
          '700': '#4E4299',
          '800': '#46388D',
          '900': '#392677',
          main: '#4E4299',
          dark: '#392677',
          light: '#726FBB',
          contrastText: '#FFFFFF',
        },
        secondary: {
          '50': '#F9F4FF',
          '100': '#EFEBFF',
          '200': '#E3DEF5',
          '300': '#D0CCE2',
          '400': '#ABA7BC',
          '500': '#8A869B',
          '600': '#625F72',
          '700': '#4F4C5F',
          '800': '#312E40',
          '900': '#120E1F',
          main: '#4F4C5F',
          dark: '#120E1F',
          light: '#ABA7BC',
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
          secondary: 'rgba(0, 0, 0, 0.6)',
          disabled: 'rgba(0, 0, 0, 0.38)',
        },
        common: {
          white: '#FFFFFF',
          black: 'rgba(0, 0, 0, 0.87)',
        },
        action: {
          active: 'rgba(0, 0, 0, 0.30)',
          hover: 'rgba(0, 0, 0, 0.04)',
          selected: 'rgba(0, 0, 0, 0.08)',
          focus: 'rgba(0, 0, 0, 0.12)',
          disabledBackground: 'rgba(0, 0, 0, 0.12)',
        },
        background: {
          default: '#EDEEF3',
          paper: '#FFFFFF',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          '50': '#EAEBF6',
          '100': '#CBCCE8',
          '200': '#AAABD8',
          '300': '#898AC8',
          '400': '#726FBB',
          '500': '#5D55AF',
          '600': '#564CA5',
          '700': '#4E4299',
          '800': '#46388D',
          '900': '#392677',
          main: '#AAABD8',
          dark: '#726FBB',
          light: '#EAEBF6',
          contrastText: 'rgba(0, 0, 0, 0.87)',
        },
        secondary: {
          '50': '#F9F4FF',
          '100': '#EFEBFF',
          '200': '#E3DEF5',
          '300': '#D0CCE2',
          '400': '#ABA7BC',
          '500': '#8A869B',
          '600': '#625F72',
          '700': '#4F4C5F',
          '800': '#312E40',
          '900': '#120E1F',
          main: '#E3DEF5',
          dark: '#ABA7BC',
          light: '#F9F4FF',
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
          main: '#81D4FA',
          dark: '#29B6F6',
          light: '#E1F5FE',
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
          secondary: 'rgba(255, 255, 255, 0.7)',
          disabled: 'rgba(255, 255, 255, 0.38)',
        },
        common: {
          white: '#FFFFFF',
          black: 'rgba(0, 0, 0, 0.87)',
        },
        action: {
          active: 'rgba(255, 255, 255, 0.30)',
          hover: 'rgba(255, 255, 255, 0.08)',
          selected: 'rgba(255, 255, 255, 0.16)',
          focus: 'rgba(255, 255, 255, 0.12)',
          disabledBackground: 'rgba(255, 255, 255, 0.12)',
        },
        background: {
          default: '#120E1F',
          paper: '#1E1A2A',
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

export default defaultTheme;
