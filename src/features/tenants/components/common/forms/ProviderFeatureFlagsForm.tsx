import { Controller, useFormContext } from 'react-hook-form';
import { FormControlLabel, Stack, Switch, Typography } from '@mui/material';
import {
  ProviderFeatureFlags,
  providerFeatureFlagDescriptions,
  providerFeatureFlagLabels,
} from '@/features/tenants/interfaces/provider-feature-flags.interface';

// satisfies ensures each entry is a valid key of ProviderFeatureFlags (catches typos).
// The exhaustiveness guard below ensures every key of ProviderFeatureFlags is listed here
// (catches omissions when a new flag is added to the backend model).
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
  'apleona_provider_flows',
] satisfies Array<keyof ProviderFeatureFlags>;

// Compile-time guard: TypeScript will error here if any key from ProviderFeatureFlags
// is missing from flagKeys. Add the new key to flagKeys above to fix the error.
// When the backend ProviderFeatureFlags model gains a new field, update the interface in
// provider-feature-flags.interface.ts and add the key to flagKeys above.
type _FlagKeysExhaustive = keyof ProviderFeatureFlags extends (typeof flagKeys)[number] ? true : never;
const _assertAllFlagsPresent: _FlagKeysExhaustive = true;

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
