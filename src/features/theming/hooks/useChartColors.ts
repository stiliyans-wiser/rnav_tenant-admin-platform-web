import { useMemo } from 'react';
import { useColorScheme } from '@mui/material';
import { ThemeMode } from '@/features/theming/enums/theme-mode.enum';
import chartTheme from '@/features/theming/constants/chartTheme';

const useChartColors = () => {
  const { mode } = useColorScheme();

  return useMemo(() => {
    return mode === ThemeMode.LIGHT ? chartTheme.light.colors : chartTheme.dark.colors;
  }, [mode]);
};

export default useChartColors;
