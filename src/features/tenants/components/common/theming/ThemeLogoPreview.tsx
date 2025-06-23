import Image from 'next/image';
import lightThemeLogo from '@/assets/logo-light-theme.png';
import darkThemeLogo from '@/assets/logo-dark-theme.png';
import { Stack, Typography } from '@mui/material';
import { Image as ImageIcon } from '@carbon/icons-react';
import { ThemeMode } from '@/features/theming/enums/theme-mode.enum';
import { TenantLogo } from '@/features/tenants/interfaces/tenant-logo.interface';

interface DefaultThemeLogoPreviewProps {
  mode: ThemeMode;
  logoData?: TenantLogo;
}

export const ThemeLogoPreview = ({ mode, logoData }: DefaultThemeLogoPreviewProps) => {
  const containerStyles = {
    justifyContent: 'center',
    padding: 3,
    borderRadius: '4px',
    border: '1px solid var(--mui-palette-divider)',
  };

  if (mode === ThemeMode.DARK) {
    const darkLogoSrc = logoData ? `data:${logoData.file_type};base64,${logoData.content_base64}` : darkThemeLogo;

    return (
      <Stack gap={2} sx={{ width: '50%' }}>
        <Stack direction="row" gap={1} sx={{ alignItems: 'center' }}>
          <ImageIcon />
          <Typography>Dark mode</Typography>
        </Stack>

        <Stack
          direction="row"
          sx={{
            ...containerStyles,
            backgroundColor: '#121212',
          }}
        >
          <Image width={104} height={32} src={darkLogoSrc} alt="Dark Theme Logo" />
        </Stack>
      </Stack>
    );
  }

  const lightLogoSrc = logoData ? `data:${logoData.file_type};base64,${logoData.content_base64}` : lightThemeLogo;

  return (
    <Stack gap={2} sx={{ width: '50%' }}>
      <Stack direction="row" gap={1} sx={{ alignItems: 'center' }}>
        <ImageIcon />
        <Typography>Light mode</Typography>
      </Stack>

      <Stack
        direction="row"
        sx={{
          ...containerStyles,
          backgroundColor: '#ffffff',
        }}
      >
        <Image width={104} height={32} src={lightLogoSrc} alt="Light Theme Logo" />
      </Stack>
    </Stack>
  );
};
