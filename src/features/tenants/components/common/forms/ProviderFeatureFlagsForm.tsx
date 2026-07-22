import { Controller, useFormContext } from 'react-hook-form';
import { FormControlLabel, Stack, Switch, Typography } from '@mui/material';
import {
  ProviderFeatureFlags,
  providerFeatureFlagDescriptions,
  providerFeatureFlagLabels,
} from '@/features/tenants/interfaces/provider-feature-flags.interface';

const flagKeys = [
  'linkedin_candidate_sourcing',
  'candidate_provider_configs',
  'job_position_provider_configs',
  'kpmg_provider_flows',
] satisfies Array<keyof ProviderFeatureFlags>;

export const ProviderFeatureFlagsForm = () => {
  const { control } = useFormContext();

  return (
    <Stack gap={3}>
      {flagKeys.map(flag => (
        <Stack key={flag} gap={0.5}>
          <Controller
            name={`provider_feature_flags.${flag}`}
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch checked={Boolean(field.value)} onChange={event => field.onChange(event.target.checked)} />}
                label={providerFeatureFlagLabels[flag]}
              />
            )}
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
            {providerFeatureFlagDescriptions[flag]}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};
