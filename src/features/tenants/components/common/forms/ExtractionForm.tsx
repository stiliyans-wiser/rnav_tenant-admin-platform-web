import { FormControlLabel, Switch, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { formFieldNames } from '@/features/tenants/constants/form.constants';

export const ExtractionForm = () => {
  const { control } = useFormContext();

  return (
    <>
      <Controller
        name={formFieldNames.extractionConfig.includeReasoning}
        control={control}
        defaultValue={false}
        render={({ field }) => (
          <FormControlLabel
            control={<Switch {...field} checked={field.value ?? false} />}
            label="Include AI Reasoning for Skill Extraction"
          />
        )}
      />
      <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: 1 }}>
        When enabled, the AI provides an explanation for each extracted skill, increasing transparency but also extraction cost (~15-25%).
      </Typography>
    </>
  );
};
