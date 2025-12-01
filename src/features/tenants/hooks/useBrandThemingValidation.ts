import { useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { CUSTOM_THEME_REQUIRED_VALIDATION, formFieldNames } from '@/features/tenants/constants/form.constants';
import { ThemeConfigOptionsEnum } from '@/features/tenants/enums/theme-config-options.enum';

export const useBrandThemingValidation = () => {
  const { watch } = useFormContext();

  // Watch form values
  const themeOption = watch(formFieldNames.settings.theme) || ThemeConfigOptionsEnum.DEFAULT;
  const lightLogo = watch(formFieldNames.settings.logos.light);
  const darkLogo = watch(formFieldNames.settings.logos.dark);
  const defaultThemeMode = watch(formFieldNames.settings.defaultThemeMode);
  const themeColor = watch(formFieldNames.settings.themeColor);
  const hasDarkLogo = watch(formFieldNames.settings.hasDarkLogo);

  const isCustomTheme = themeOption === ThemeConfigOptionsEnum.CUSTOM;

  // Function to check if any required control doesn't have value
  const checkHasError = useCallback(() => {
    if (!isCustomTheme) {
      return false;
    }

    const fieldValues = [lightLogo, darkLogo, defaultThemeMode, themeColor];

    return [
      formFieldNames.settings.logos.light,
      formFieldNames.settings.logos.dark,
      formFieldNames.settings.defaultThemeMode,
      formFieldNames.settings.themeColor,
      formFieldNames.settings.theme,
    ].some((fieldName, index) => {
      // Skip validation if dark logo is not enabled
      if (fieldName === formFieldNames.settings.logos.dark && !hasDarkLogo) {
        return false;
      }

      const fieldValue = fieldValues[index];
      const isRequired = CUSTOM_THEME_REQUIRED_VALIDATION[fieldName];

      return isRequired && !fieldValue;
    });
  }, [isCustomTheme, lightLogo, darkLogo, defaultThemeMode, themeColor, hasDarkLogo]);

  const hasError = useMemo(() => checkHasError(), [checkHasError]);

  return {
    hasError,
    isCustomTheme,
    formValues: {
      themeOption,
      lightLogo,
      darkLogo,
      defaultThemeMode,
      themeColor,
      hasDarkLogo,
    },
  };
};
