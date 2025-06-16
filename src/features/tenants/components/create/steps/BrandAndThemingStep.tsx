import { useCallback, useMemo } from 'react';
import { Divider, FormControlLabel, Stack, Switch, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import {
  ColorPalette,
  ColorSwitch,
  Image as ImageIcon,
  Light,
  Moon,
  PaintBrush,
  SettingsView,
  VisualRecognition,
} from '@carbon/icons-react';
import { ThemeMode } from '@/features/theming/enums/theme-mode.enum';
import deepPurpleTheme from '@/features/theming/deepPurpleTheme';
import lightBlueTheme from '@/features/theming/lightBlueTheme';
import lightGreenTheme from '@/features/theming/lightGreenTheme';
import amberTheme from '@/features/theming/amberTheme';
import redTheme from '@/features/theming/redTheme';
import { UploadComponent } from '@/features/common/components/UploadComponent';
import { Controller, ControllerRenderProps, useFormContext } from 'react-hook-form';
import defaultTheme from '@/features/theming/defaultTheme';
import { ThemeLogoPreview } from '@/features/tenants/components/create/common/ThemeLogoPreview';
import { ColorThemeSelector } from '@/features/tenants/components/create/common/ColorThemeSelector';
import { ThemeConfigSelector } from '@/features/tenants/components/create/common/ThemeConfigSelector';
import { CreateTenantStepProps } from '@/features/tenants/interfaces/create-tenant-step-props.interface';
import { CreateTenantStepLayout } from '@/features/tenants/components/create/layouts/CreateTenantStepLayout';

enum ThemeConfigOptionsEnum {
  DEFAULT = 'default',
  CUSTOM = 'custom',
}

const FIELD_NAMES = [
  'settings.logos.light',
  'settings.logos.dark',
  'settings.default_theme_mode',
  'settings.theme_color',
  'settings.theme',
  'settings.has_dark_logo',
];

const customThemeRequiredValidation = {
  [FIELD_NAMES[0]]: true,
  [FIELD_NAMES[1]]: true,
  [FIELD_NAMES[2]]: true,
  [FIELD_NAMES[3]]: true,
};

const ErrorLabel = ({ field }) => {
  if (field.isTouched && customThemeRequiredValidation[field.name]) {
    return (
      <Typography variant="caption" color="error">
        This field is required.
      </Typography>
    );
  }

  return null;
};

export const BrandAndThemingStep = ({ onBack, onNext }: CreateTenantStepProps) => {
  const { control, watch, setValue } = useFormContext();

  const themeMode = watch(FIELD_NAMES[2]) || ThemeMode.LIGHT;
  const themeOption = watch(FIELD_NAMES[4]) || ThemeConfigOptionsEnum.DEFAULT;
  const isCustomTheme = themeOption === ThemeConfigOptionsEnum.CUSTOM;

  // Watch individual fields for validation
  const lightLogo = watch(FIELD_NAMES[0]);
  const darkLogo = watch(FIELD_NAMES[1]);
  const defaultThemeMode = watch(FIELD_NAMES[2]);
  const themeColor = watch(FIELD_NAMES[3]);
  const hasDarkLogo = watch(FIELD_NAMES[5]);

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
      setValue(FIELD_NAMES[0], null); // logos.light
      setValue(FIELD_NAMES[1], null); // logos.dark
      setValue(FIELD_NAMES[3], ThemeConfigOptionsEnum.DEFAULT); // theme_color
      setValue(FIELD_NAMES[5], false); // has_dark_logo
    } else {
      setValue(FIELD_NAMES[3], null); // theme_color
    }
  };

  // Function to check if any required control doesn't have value
  const checkHasError = useCallback(() => {
    if (!isCustomTheme) {
      return false;
    }

    const fieldValues = [lightLogo, darkLogo, defaultThemeMode, themeColor];

    return FIELD_NAMES.slice(0, 4).some((fieldName, index) => {
      // Skip validation if dark logo is not enabled
      if (fieldName === FIELD_NAMES[1] && !hasDarkLogo) {
        return false;
      }

      const fieldValue = fieldValues[index];
      const isRequired = customThemeRequiredValidation[fieldName];

      return isRequired && !fieldValue;
    });
  }, [isCustomTheme, lightLogo, darkLogo, defaultThemeMode, themeColor, hasDarkLogo]);

  // Global hasError flag
  const hasError = useMemo(() => checkHasError(), [checkHasError]);

  return (
    <CreateTenantStepLayout
      stepTitle="Brand & Theming"
      stepIcon={<VisualRecognition size={24} />}
      isNextButtonDisabled={hasError}
      onBack={() => onBack(hasError)}
      onNext={() => onNext(hasError)}
    >
      <Stack gap={4}>
        <Stack gap={2}>
          <Stack direction="row" gap={1} sx={{ alignItems: 'center' }}>
            <SettingsView />
            <Typography variant="body1">Theme Configuration</Typography>
          </Stack>

          <Controller
            name={FIELD_NAMES[4]}
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
                name={FIELD_NAMES[0]}
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
                name={FIELD_NAMES[5]}
                control={control}
                render={({ field }) => (
                  <FormControlLabel control={<Switch {...field} checked={field.value} />} label="Different logo version for dark mode" />
                )}
              />

              {hasDarkLogo && (
                <Controller
                  name={FIELD_NAMES[1]}
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
            name={FIELD_NAMES[2]}
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
              name={FIELD_NAMES[3]}
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
    </CreateTenantStepLayout>
  );
};
