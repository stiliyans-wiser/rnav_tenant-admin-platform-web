import { useFormContext } from 'react-hook-form';
import { Divider, IconButton, Stack, Typography } from '@mui/material';
import { CheckmarkFilled, ColorSwitch, Image as ImageIcon, Sun, VisualRecognition } from '@carbon/icons-react';
import { PreviewTenantStepLayout } from '@/features/tenants/components/create/layouts/PreviewTenantStepLayout';
import { ColorThemeSelector } from '@/features/tenants/components/create/common/ColorThemeSelector';
import { ThemeLogoPreview } from '@/features/tenants/components/create/common/ThemeLogoPreview';
import { ThemeMode } from '@/features/theming/enums/theme-mode.enum';
import { CreateTenantPreviewProps } from '@/features/tenants/interfaces/create-tenant-preview-props.interface';
import { themes } from '@/features/theming/themes';

export const BrandAndThemingPreview = ({
  onEdit,
}: CreateTenantPreviewProps) => {
  const { getValues } = useFormContext();

  const formValues = getValues();

  return (
    <PreviewTenantStepLayout
      stepTitle="Brand & Theming"
      stepIcon={<VisualRecognition size={24} />}
      onEdit={onEdit}
    >
      <Stack gap={4}>
        <Stack direction="row" gap={3}>
          <ThemeLogoPreview mode={ThemeMode.LIGHT} logoData={formValues.settings.logos?.light} />
          <ThemeLogoPreview mode={ThemeMode.DARK} logoData={formValues.settings.logos?.dark || formValues.settings.logos?.light} />
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
              <Typography variant="subtitle2">
                {formValues.settings.default_theme_mode === ThemeMode.LIGHT ? 'Light mode' : 'Dark mode'}
              </Typography>
            </Stack>
            <Stack direction="row" gap={1} sx={{ alignItems: 'center' }}>
              <IconButton color="primary" sx={{ p: 0 }}>
                <CheckmarkFilled />
              </IconButton>
              <Typography variant="caption">
                Users allowed to change modes
              </Typography>
            </Stack>
          </Stack>

          <Stack gap={1} sx={{ flex: '1' }}>
            <Stack direction="row" gap={1} sx={{ alignItems: 'center' }}>
              <ImageIcon />
              <Typography variant="body1">Color theme</Typography>
            </Stack>
            <ColorThemeSelector
              theme={themes[formValues.settings.theme_color]?.theme || themes[formValues.settings.theme].theme}
              title={themes[formValues.settings.theme_color]?.name || themes[formValues.settings.theme].name}
              themeMode={ThemeMode.LIGHT}
            />
          </Stack>
        </Stack>
      </Stack>
    </PreviewTenantStepLayout>
  );
};
