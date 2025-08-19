import { Divider, IconButton, Stack, Typography } from '@mui/material';
import { ThemeLogoPreview } from '@/features/tenants/components/common/theming/ThemeLogoPreview';
import { ThemeMode } from '@/features/theming/enums/theme-mode.enum';
import { CheckmarkFilled, ColorSwitch, Sun } from '@carbon/icons-react';
import { Image as ImageIcon } from '@carbon/icons-react/lib/generated/bucket-9';
import { ColorThemeSelector } from '@/features/tenants/components/common/theming/ColorThemeSelector';
import { themes } from '@/features/theming/constants/themes';
import { TenantLogo } from '@/features/tenants/interfaces/tenant-logo.interface';

export interface BrandAndThemingData {
  company_name: string;
  settings: {
    theme: string;
    theme_color: string;
    default_theme_mode: string;
    logos: {
      light?: TenantLogo;
      dark?: TenantLogo;
    };
  };
}

interface BrandAndThemingViewProps {
  data: BrandAndThemingData;
}

export const BrandAndThemingView = ({ data }: BrandAndThemingViewProps) => {
  return (
    <Stack gap={4}>
      <Stack direction="row" gap={3}>
        <ThemeLogoPreview mode={ThemeMode.LIGHT} logoData={data.settings.logos?.light} />
        <ThemeLogoPreview mode={ThemeMode.DARK} logoData={data.settings.logos?.dark || data.settings.logos?.light} />
      </Stack>

      <Divider />

      <Stack direction="row" gap={3}>
        <Stack gap={3} sx={{ flex: 1 }}>
          <Stack direction="row" gap={1} sx={{ alignItems: 'center' }}>
            <ColorSwitch />
            <Typography variant="body1">Default mode</Typography>
          </Stack>
          <Stack direction="row" gap={1} sx={{ alignItems: 'center' }}>
            <Sun />
            <Typography variant="subtitle2">{data.settings.default_theme_mode === ThemeMode.LIGHT ? 'Light mode' : 'Dark mode'}</Typography>
          </Stack>
          <Stack direction="row" gap={1} sx={{ alignItems: 'center' }}>
            <IconButton color="primary" sx={{ p: 0 }}>
              <CheckmarkFilled />
            </IconButton>
            <Typography variant="caption">Users allowed to change modes</Typography>
          </Stack>
        </Stack>

        <Stack gap={1} sx={{ flex: '1' }}>
          <Stack direction="row" gap={1} sx={{ alignItems: 'center' }}>
            <ImageIcon />
            <Typography variant="body1">Color theme</Typography>
          </Stack>
          <ColorThemeSelector
            theme={themes[data.settings.theme_color]?.theme || themes[data.settings.theme].theme}
            title={themes[data.settings.theme_color]?.name || themes[data.settings.theme].name}
            themeMode={ThemeMode.LIGHT}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};
