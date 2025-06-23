import { Divider, FormControlLabel, Stack, Switch, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { ColorPalette, ColorSwitch, Light, Moon, PaintBrush, SettingsView, VisualRecognition } from '@carbon/icons-react';
import { Controller, ControllerRenderProps, useFormContext } from 'react-hook-form';
import { ThemeConfigSelector } from '@/features/tenants/components/common/theming/ThemeConfigSelector';
import { Image as ImageIcon } from '@carbon/icons-react/lib/generated/bucket-9';
import { UploadComponent } from '@/features/common/components/UploadComponent';
import { ThemeLogoPreview } from '@/features/tenants/components/common/theming/ThemeLogoPreview';
import { ThemeMode } from '@/features/theming/enums/theme-mode.enum';
import { ColorThemeSelector } from '@/features/tenants/components/common/theming/ColorThemeSelector';
import deepPurpleTheme from '@/features/theming/deepPurpleTheme';
import lightBlueTheme from '@/features/theming/lightBlueTheme';
import lightGreenTheme from '@/features/theming/lightGreenTheme';
import amberTheme from '@/features/theming/amberTheme';
import redTheme from '@/features/theming/redTheme';
import defaultTheme from '@/features/theming/defaultTheme';
import { CUSTOM_THEME_REQUIRED_VALIDATION, formFieldNames } from '@/features/tenants/constants/form.constants';
import { ThemeConfigOptionsEnum } from '@/features/tenants/enums/theme-config-options.enum';
import { useBrandThemingValidation } from '@/features/tenants/hooks/useBrandThemingValidation';

const ErrorLabel = ({ field }) => {
  if (field.isTouched && CUSTOM_THEME_REQUIRED_VALIDATION[field.name]) {
    return (
      <Typography variant="caption" color="error">
        This field is required.
      </Typography>
    );
  }

  return null;
};

export const BrandAndThemingForm = () => {
  const { control, setValue } = useFormContext();
  const { isCustomTheme, formValues } = useBrandThemingValidation();

  const { hasDarkLogo } = formValues;
  const themeMode = formValues.defaultThemeMode || ThemeMode.LIGHT;

  const handleLogoFileChange = (field: ControllerRenderProps<any, string>, logoFile: File) => {
    if (!logoFile) {
      field.onChange(null);
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;

      const logoObject = {
        name: logoFile.name,
        content_base64: base64String.split(',')[1],
        file_type: logoFile.type,
      };

      field.onChange(logoObject);
    };

    reader.readAsDataURL(logoFile);
  };

  // Update form values based on theme option selection
  const updateFormValuesOnThemeChange = (newThemeOption: ThemeConfigOptionsEnum) => {
    if (newThemeOption === ThemeConfigOptionsEnum.DEFAULT) {
      setValue(formFieldNames.settings.logos.light, null);
      setValue(formFieldNames.settings.logos.dark, null);
      setValue(formFieldNames.settings.themeColor, ThemeConfigOptionsEnum.DEFAULT);
      setValue(formFieldNames.settings.hasDarkLogo, false);
    } else {
      setValue(formFieldNames.settings.themeColor, null);
    }
  };

  return (
    <Stack gap={4}>
      <Stack gap={2}>
        <Stack direction="row" gap={1} sx={{ alignItems: 'center' }}>
          <SettingsView />
          <Typography variant="body1">Theme Configuration</Typography>
        </Stack>

        <Controller
          name={formFieldNames.settings.theme}
          control={control}
          defaultValue={ThemeConfigOptionsEnum.DEFAULT}
          render={({ field }) => (
            <ToggleButtonGroup
              color="primary"
              size="large"
              value={field.value}
              exclusive
              fullWidth
              onChange={(event, newThemeOption) => {
                if (newThemeOption !== null) {
                  field.onChange(newThemeOption as ThemeConfigOptionsEnum);
                  updateFormValuesOnThemeChange(newThemeOption);
                }
              }}
            >
              <ToggleButton value={ThemeConfigOptionsEnum.DEFAULT}>
                <ThemeConfigSelector icon={<VisualRecognition />} label="Default theme" />
              </ToggleButton>
              <ToggleButton value={ThemeConfigOptionsEnum.CUSTOM}>
                <ThemeConfigSelector icon={<PaintBrush />} label="Custom theme" />
              </ToggleButton>
            </ToggleButtonGroup>
          )}
        />
      </Stack>

      <Divider />

      <Stack gap={2}>
        <Stack direction="row" gap={1} sx={{ alignItems: 'center' }}>
          <ImageIcon />
          <Typography variant="body1">Tenant logo</Typography>
        </Stack>

        {isCustomTheme ? (
          <>
            <Controller
              name={formFieldNames.settings.logos.light}
              control={control}
              render={({ field }) => (
                <Stack gap={1}>
                  <UploadComponent
                    multiple={false}
                    acceptedFileTypes={{
                      'image/*': ['.jpeg', '.png', '.gif', '.webp', '.svg'],
                    }}
                    setFilesValue={files => handleLogoFileChange(field, files[0])}
                    initialFiles={field.value ? [new File([], field.value.name)] : []}
                    uploadHintMessage="SVG, PNG, JPG or GIF (max. 3MB)"
                  />
                  <ErrorLabel field={field} />
                </Stack>
              )}
            />

            <Controller
              name={formFieldNames.settings.hasDarkLogo}
              control={control}
              render={({ field }) => (
                <FormControlLabel control={<Switch {...field} checked={field.value} />} label="Different logo version for dark mode" />
              )}
            />

            {hasDarkLogo && (
              <Controller
                name={formFieldNames.settings.logos.dark}
                control={control}
                render={({ field }) => (
                  <Stack gap={1}>
                    <UploadComponent
                      multiple={false}
                      acceptedFileTypes={{
                        'image/*': ['.jpeg', '.png', '.gif', '.webp', '.svg'],
                      }}
                      setFilesValue={files => handleLogoFileChange(field, files[0])}
                      initialFiles={field.value ? [new File([], field.value.name)] : []}
                      uploadHintMessage="SVG, PNG, JPG or GIF (max. 3MB)"
                    />
                    <ErrorLabel field={field} />
                  </Stack>
                )}
              />
            )}
          </>
        ) : (
          <Stack direction="row" gap={2} sx={{ alignItems: 'center' }}>
            <ThemeLogoPreview mode={ThemeMode.LIGHT} />
            <ThemeLogoPreview mode={ThemeMode.DARK} />
          </Stack>
        )}
      </Stack>

      <Divider />

      <Stack gap={2}>
        <Stack direction="row" gap={1} sx={{ alignItems: 'center' }}>
          <ColorSwitch />
          <Typography variant="body1">Default mode</Typography>
        </Stack>

        <Controller
          name={formFieldNames.settings.defaultThemeMode}
          control={control}
          defaultValue={ThemeMode.LIGHT}
          render={({ field }) => (
            <Stack gap={1}>
              <ToggleButtonGroup
                color="primary"
                size="large"
                value={field.value}
                exclusive
                fullWidth
                onChange={(event, newThemeMode) => {
                  if (newThemeMode !== null) {
                    field.onChange(newThemeMode);
                  }
                }}
              >
                <ToggleButton value={ThemeMode.LIGHT}>
                  <ThemeConfigSelector icon={<Light />} label="Light Mode" />
                </ToggleButton>
                <ToggleButton value={ThemeMode.DARK}>
                  <ThemeConfigSelector icon={<Moon />} label="Dark Mode" />
                </ToggleButton>
              </ToggleButtonGroup>
              {isCustomTheme && <ErrorLabel field={field} />}
            </Stack>
          )}
        />
      </Stack>

      <Divider />

      <Stack gap={2}>
        <Stack direction="row" gap={1} sx={{ alignItems: 'center' }}>
          <ColorPalette />
          <Typography variant="body1">Color theme</Typography>
        </Stack>

        {isCustomTheme ? (
          <Controller
            name={formFieldNames.settings.themeColor}
            control={control}
            render={({ field }) => (
              <Stack gap={1}>
                <ToggleButtonGroup
                  color="primary"
                  size="large"
                  value={field.value}
                  exclusive
                  fullWidth
                  onChange={(event, newPalette) => {
                    if (newPalette !== null && isCustomTheme) {
                      field.onChange(newPalette);
                    }
                  }}
                >
                  <ToggleButton value="deepPurple">
                    <ColorThemeSelector theme={deepPurpleTheme} title="Deep purple" themeMode={themeMode} />
                  </ToggleButton>
                  <ToggleButton value="lightBlue">
                    <ColorThemeSelector theme={lightBlueTheme} title="Light blue" themeMode={themeMode} />
                  </ToggleButton>
                  <ToggleButton value="lightGreen">
                    <ColorThemeSelector theme={lightGreenTheme} title="Light green" themeMode={themeMode} />
                  </ToggleButton>
                  <ToggleButton value="amber">
                    <ColorThemeSelector theme={amberTheme} title="Amber" themeMode={themeMode} />
                  </ToggleButton>
                  <ToggleButton value="red">
                    <ColorThemeSelector theme={redTheme} title="Red" themeMode={themeMode} />
                  </ToggleButton>
                </ToggleButtonGroup>
                <ErrorLabel field={field} />
              </Stack>
            )}
          />
        ) : (
          <Stack>
            <ColorThemeSelector theme={defaultTheme} themeMode={themeMode} size="large" showColorLabels={true} />
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};
