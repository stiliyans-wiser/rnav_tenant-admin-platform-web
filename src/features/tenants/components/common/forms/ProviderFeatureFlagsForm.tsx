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
  'a1_provider_flows',
  'hlctech_provider_flows',
  'jobs_bg_provider_flows',
  'telus_digital_provider_flows',
  'concentrix_provider_flows',
  'avedo_provider_flows',
  'dormakaba_provider_flows',
  'gracher_provider_flows',
  'solaredge_provider_flows',
  'sutherland_provider_flows',
  'postbank_provider_flows',
  'commerzbank_provider_flows',
  'ringcentral_provider_flows',
  'cocacola_provider_flows',
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
