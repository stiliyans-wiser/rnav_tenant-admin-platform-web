import { FormControlLabel, Switch, useColorScheme } from '@mui/material';
import { ThemeMode } from '../enums/theme-mode.enum.ts';

export const ThemeSwitcher = () => {
  const { mode, setMode } = useColorScheme();

  if (!mode) {
    return null;
  }

  const handleThemeModeChange = () => {
    const newMode = mode === ThemeMode.LIGHT ? 'dark' : 'light';
    setMode(newMode);
  };

  return <FormControlLabel control={<Switch checked={mode === 'dark'} />} label="Dark Mode" onChange={handleThemeModeChange} />;
};
