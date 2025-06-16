import { SettingsServices } from '@carbon/icons-react';
import { CreateTenantStepProps } from '@/features/tenants/interfaces/create-tenant-step-props.interface';
import { CreateTenantStepLayout } from '@/features/tenants/components/create/layouts/CreateTenantStepLayout';
import { Controller, useFormContext } from 'react-hook-form';
import { MuiSelect } from '@/features/common/components/form-elements/MuiSelect';
import { FormControlLabel, MenuItem, Switch } from '@mui/material';
import { MuiTextField } from '@/features/common/components/form-elements/MuiTextField';
import { useStepValidation } from '@/features/tenants/hooks/useStepValidation';
import { useCreateTenantContext } from '@/features/tenants/contexts/CreateTenantContext';

const FIELD_NAMES = [
  'ai_config.open_ai_type',
  'ai_config.open_ai_embedding_model',
  'ai_config.temperature',
  'ai_config.open_ai_key',
  'ai_config.open_ai_endpoint',
  'ai_config.open_ai_version',
  'ai_config.web_search',
];

export const AIServicesStep = ({ onBack, onNext }: CreateTenantStepProps) => {
  const { adminConfig } = useCreateTenantContext();
  const { control } = useFormContext();
  const { hasError } = useStepValidation(FIELD_NAMES);

  return (
    <CreateTenantStepLayout
      stepTitle="AI Services"
      stepIcon={<SettingsServices size={24} />}
      isNextButtonDisabled={hasError}
      onBack={() => onBack(hasError)}
      onNext={() => onNext(hasError)}
    >
      <Controller
        name={FIELD_NAMES[0]}
        control={control}
        rules={{ required: 'This field is required' }}
        render={({ field, fieldState }) => (
          <MuiSelect
            sx={{ mb: 4 }}
            field={field}
            label="AI tool / Open AI type"
            placeholder="Select AI tool"
            fieldState={fieldState}
            options={adminConfig?.ai_providers.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          />
        )}
      />

      <Controller
        name={FIELD_NAMES[1]}
        control={control}
        rules={{ required: 'This field is required' }}
        render={({ field, fieldState }) => (
          <MuiSelect
            sx={{ mb: 4 }}
            field={field}
            label="Default embedding model"
            placeholder="Select embedding model"
            fieldState={fieldState}
            options={adminConfig?.embedding_types.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          />
        )}
      />

      <Controller
        name={FIELD_NAMES[2]}
        control={control}
        rules={{
          required: 'This field is required',
          min: {
            value: 0,
            message: 'The value must be at least 0',
          },
          max: {
            value: 1,
            message: 'The value must not exceed 1',
          },
        }}
        render={({ field, fieldState }) => (
          <MuiTextField
            sx={{ mb: 4 }}
            type="number"
            label="Temperature"
            placeholder="Add temperature value"
            field={field}
            fieldState={fieldState}
          />
        )}
      />

      <Controller
        name={FIELD_NAMES[3]}
        control={control}
        rules={{ required: 'This field is required' }}
        render={({ field, fieldState }) => (
          <MuiTextField sx={{ mb: 4 }} label="Open AI key" placeholder="Add key value" field={field} fieldState={fieldState} />
        )}
      />

      <Controller
        name={FIELD_NAMES[4]}
        control={control}
        rules={{ required: 'This field is required' }}
        render={({ field, fieldState }) => (
          <MuiTextField sx={{ mb: 4 }} label="Open AI endpoint" placeholder="Add endpoint URL" field={field} fieldState={fieldState} />
        )}
      />

      <Controller
        name={FIELD_NAMES[5]}
        control={control}
        rules={{ required: 'This field is required' }}
        render={({ field, fieldState }) => (
          <MuiTextField sx={{ mb: 4 }} label="Open AI version" placeholder="Add version" field={field} fieldState={fieldState} />
        )}
      />

      <Controller
        name={FIELD_NAMES[6]}
        control={control}
        render={({ field }) => <FormControlLabel control={<Switch {...field} checked={field.value} />} label="Include web search" />}
      />
    </CreateTenantStepLayout>
  );
};
