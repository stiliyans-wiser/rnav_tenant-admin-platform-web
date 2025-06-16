import { IbmCloudHyperProtectCryptoServices } from '@carbon/icons-react';
import { CreateTenantStepProps } from '@/features/tenants/interfaces/create-tenant-step-props.interface';
import { CreateTenantStepLayout } from '@/features/tenants/components/create/layouts/CreateTenantStepLayout';
import { Controller, useFormContext } from 'react-hook-form';
import { useStepValidation } from '@/features/tenants/hooks/useStepValidation';
import { MuiSelect } from '@/features/common/components/form-elements/MuiSelect';
import { FormControlLabel, MenuItem, Switch } from '@mui/material';
import { MuiTextField } from '@/features/common/components/form-elements/MuiTextField';
import { useCreateTenantContext } from '@/features/tenants/contexts/CreateTenantContext';

const FIELD_NAMES = [
  'sso_config.type',
  'sso_config.enabled',
  'sso_config.tenant_id',
  'sso_config.client_id',
  'sso_config.client_secret',
  'sso_config.scopes',
];

export const SSOStep = ({ onBack, onNext }: CreateTenantStepProps) => {
  const { adminConfig } = useCreateTenantContext();
  const { control } = useFormContext();
  const { hasError } = useStepValidation(FIELD_NAMES);

  return (
    <CreateTenantStepLayout
      stepTitle="SSO"
      stepIcon={<IbmCloudHyperProtectCryptoServices size={24} />}
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
            label="SSO type"
            placeholder="Select SSO type"
            fieldState={fieldState}
            options={adminConfig?.sso_providers.map(option => (
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
        render={({ field }) => <FormControlLabel sx={{ mb: 4 }} control={<Switch {...field} checked={field.value} />} label="Enabled" />}
      />

      <Controller
        name={FIELD_NAMES[2]}
        control={control}
        rules={{ required: 'This field is required' }}
        render={({ field, fieldState }) => (
          <MuiTextField sx={{ mb: 4 }} label="Tenant ID" placeholder="Add tenant ID" field={field} fieldState={fieldState} />
        )}
      />

      <Controller
        name={FIELD_NAMES[3]}
        control={control}
        rules={{ required: 'This field is required' }}
        render={({ field, fieldState }) => (
          <MuiTextField sx={{ mb: 4 }} label="Client ID" placeholder="Add client ID" field={field} fieldState={fieldState} />
        )}
      />

      <Controller
        name={FIELD_NAMES[4]}
        control={control}
        rules={{ required: 'This field is required' }}
        render={({ field, fieldState }) => (
          <MuiTextField
            sx={{ mb: 4 }}
            label="Client secret"
            placeholder="Add client secret"
            field={field}
            fieldState={fieldState}
            multiline={true}
            rows={4}
          />
        )}
      />

      <Controller
        name={FIELD_NAMES[5]}
        control={control}
        rules={{ required: 'This field is required' }}
        render={({ field, fieldState }) => (
          <MuiTextField label="Scopes" placeholder="Add scopes" field={field} fieldState={fieldState} multiline={true} rows={4} />
        )}
      />
    </CreateTenantStepLayout>
  );
};
