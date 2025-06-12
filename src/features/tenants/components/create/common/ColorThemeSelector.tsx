import { ThemeMode } from '@/features/theming/enums/theme-mode.enum';
import { Stack, Typography } from '@mui/material';

interface ColorThemeSelectorProps {
  title?: string;
  theme: any;
  themeMode: ThemeMode;
  size?: 'small' | 'large';
  showColorLabels?: boolean;
}

const smallSizeStyles = {
  light: {
    width: '24px',
    height: '24px',
  },
  main: {
    width: '32px',
    height: '32px',
  },
  dark: {
    width: '24px',
    height: '24px',
  },
}

const largeSizeStyles = {
  light: {
    width: '60px',
    height: '60px',
  },
  main: {
    width: '80px',
    height: '80px',
  },
  dark: {
    width: '60px',
    height: '60px',
  },
}

export const ColorThemeSelector = ({ theme, title, themeMode, size = 'small', showColorLabels = false }: ColorThemeSelectorProps) => {
  const palette = theme.colorSchemes[themeMode].palette;

  const isSmallSize = size === 'small';
  const sizeStyles = isSmallSize ? smallSizeStyles : largeSizeStyles;

  return (
    <Stack gap={1} sx={{
      alignItems: 'center',
      width: '100%',
      padding: 2,
      borderRadius: '4px',
      backgroundColor: palette.background.default
    }}>
      {title && (
        <Typography variant="caption" sx={{ color: palette.text.primary}}>{title}</Typography>
      )}
      <Stack direction="row" sx={{ alignItems: 'center' }}>
        <Stack sx={{
          justifyContent: 'center',
          alignItems: 'center',
          width: sizeStyles.dark.width,
          height: sizeStyles.dark.height,
          borderRadius: '4px 0 0 4px',
          backgroundColor: palette.primary.dark
        }}>
          {showColorLabels && (<Typography variant="caption" sx={{ color: palette.primary.contrastText}}>dark</Typography>)}
        </Stack>

        <Stack sx={{
          justifyContent: 'center',
          alignItems: 'center',
          width: sizeStyles.main.width,
          height: sizeStyles.main.height,
          borderRadius: '4px',
          backgroundColor: palette.primary.main
        }}>
          {showColorLabels && (<Typography variant="caption" sx={{ color: palette.primary.contrastText}}>main</Typography>)}
        </Stack>

        <Stack sx={{
          justifyContent: 'center',
          alignItems: 'center',
          width: sizeStyles.light.width,
          height: sizeStyles.light.height,
          borderRadius: '0 4px 4px 0',
          backgroundColor: palette.primary.light
        }}>
          {showColorLabels && (<Typography variant="caption" sx={{ color: palette.primary.contrastText}}>light</Typography>)}
        </Stack>
      </Stack>
    </Stack>
  );
}
