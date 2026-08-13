import { FormControlLabel, Stack, Switch, TextField, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { formFieldNames } from '@/features/tenants/constants/form.constants';

export const AutoReplacementForm = () => {
  const { control } = useFormContext();

  return (
    <Stack spacing={3}>
      <Controller
        name={formFieldNames.autoReplacement.enabled}
        control={control}
        defaultValue={false}
        render={({ field }) => (
          <FormControlLabel
            control={<Switch {...field} checked={field.value ?? false} />}
            label="Enable auto-replacement candidate search"
          />
        )}
      />
      <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: -2 }}>
        When disabled, candidate status changes do not create replacement suggestions or trigger full rematches.
      </Typography>

      <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="flex-start">
        <Controller
          name={formFieldNames.autoReplacement.minPoolThreshold}
          control={control}
          defaultValue={5}
          rules={{ min: 1 }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Minimum replacement pool"
              type="number"
              size="small"
              inputProps={{ min: 1, step: 1 }}
              helperText="Full rematch runs below this count"
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />
        <Controller
          name={formFieldNames.autoReplacement.debounceWindowSeconds}
          control={control}
          defaultValue={300}
          rules={{ min: 0 }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Full rematch cooldown (s)"
              type="number"
              size="small"
              inputProps={{ min: 0, step: 1 }}
              helperText="Seconds between expensive full rematches"
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />
        <Controller
          name={formFieldNames.autoReplacement.maxReplacementSuggestions}
          control={control}
          defaultValue={10}
          rules={{ min: 1, max: 50 }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Maximum suggestions"
              type="number"
              size="small"
              inputProps={{ min: 1, max: 50, step: 1 }}
              helperText="Replacement candidates shown (1-50)"
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />
      </Stack>
    </Stack>
  );
};
