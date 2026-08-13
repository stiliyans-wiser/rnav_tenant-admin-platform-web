import { FormControlLabel, Switch } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { formFieldNames } from '@/features/tenants/constants/form.constants';

export const UIConfigForm = () => {
  const { control } = useFormContext();

  return (
    <>
      <Controller
        name={formFieldNames.matchConfig.showAiCopilot}
        control={control}
        defaultValue={false}
        render={({ field }) => (
          <FormControlLabel
            control={<Switch {...field} checked={field.value ?? false} />}
            label="Show AI Copilot tab"
          />
        )}
      />
      <Controller
        name={formFieldNames.matchConfig.showRankExplanation}
        control={control}
        defaultValue={false}
        render={({ field }) => (
          <FormControlLabel
            control={<Switch {...field} checked={field.value ?? false} />}
            label="Show 'Why Not #1?' rank explanations"
          />
        )}
      />
    </>
  );
};
