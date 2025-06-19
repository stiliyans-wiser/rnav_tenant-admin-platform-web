import { Theme } from '@mui/material';
import defaultTheme from './defaultTheme';
import amberTheme from './amberTheme';
import redTheme from './redTheme';
import deepPurpleTheme from './deepPurpleTheme';
import lightBlueTheme from './lightBlueTheme';
import lightGreenTheme from './lightGreenTheme';

interface ThemeDefinition {
  name: string;
  theme: Theme;
}

export const themes: { [key: string]: ThemeDefinition } = {
  default: {
    name: 'Default',
    theme: defaultTheme,
  },
  amber: {
    name: 'Amber',
    theme: amberTheme,
  },
  red: {
    name: 'Red',
    theme: redTheme,
  },
  deepPurple: {
    name: 'Deep purple',
    theme: deepPurpleTheme,
  },
  lightBlue: {
    name: 'Light blue',
    theme: lightBlueTheme,
  },
  lightGreen: {
    name: 'Light green',
    theme: lightGreenTheme,
  },
};
