import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { FormControlLabel, MenuItem, Switch } from '@mui/material';
import { useEffect } from 'react';
import { MuiSelect } from '@/features/common/components/form-elements/MuiSelect';
import { MuiTextField } from '@/features/common/components/form-elements/MuiTextField';
import { AdminConfig } from '@/features/tenants/interfaces/admin-config.interface';
import { formFieldNames } from '@/features/tenants/constants/form.constants';

interface SSOFormProps {
  adminConfig: AdminConfig;
}

export const SSOForm = ({ adminConfig }: SSOFormProps) => {
  const { control, trigger, clearErrors } = useFormContext();

  const isRequired = useWatch({
    control,
    name: formFieldNames.sso.enabled,
    defaultValue: false,
  });

  // Trigger validation when toggle changes
  useEffect(() => {
    const ssoFields = [
      formFieldNames.sso.type,
      formFieldNames.sso.tenantId,
      formFieldNames.sso.clientId,
      formFieldNames.sso.clientSecret,
      formFieldNames.sso.scopes,
    ];

    if (isRequired) {
      trigger(ssoFields);
    } else {
      clearErrors(ssoFields);
    }
  }, [isRequired, trigger, clearErrors]);

  return (
    <>
      <Controller
        name={formFieldNames.sso.enabled}
        control={control}
        defaultValue={false}
        render={({ field }) => <FormControlLabel sx={{ mb: 4 }} control={<Switch {...field} checked={field.value} />} label="Enabled" />}
      />

      <Controller
        name={formFieldNames.sso.type}
        control={control}
        rules={isRequired ? { required: 'This field is required' } : {}}
        render={({ field, fieldState }) => (
          <MuiSelect
            sx={{ mb: 4 }}
            field={{ ...field, value: field.value || '' }}
            label="SSO type"
            placeholder="Select SSO type"
            fieldState={fieldState}
            required={isRequired}
            options={adminConfig?.sso_providers.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          />
        )}
      />

      <Controller
        name={formFieldNames.sso.tenantId}
        control={control}
        rules={isRequired ? { required: 'This field is required' } : {}}
        render={({ field, fieldState }) => (
          <MuiTextField
            sx={{ mb: 4 }}
            label="Tenant ID"
            placeholder="Add tenant ID"
            field={{ ...field, value: field.value || '' }}
            fieldState={fieldState}
            required={isRequired}
          />
        )}
      />

      <Controller
        name={formFieldNames.sso.clientId}
        control={control}
        rules={isRequired ? { required: 'This field is required' } : {}}
        render={({ field, fieldState }) => (
          <MuiTextField
            sx={{ mb: 4 }}
            label="Client ID"
            placeholder="Add client ID"
            field={{ ...field, value: field.value || '' }}
            fieldState={fieldState}
            required={isRequired}
          />
        )}
      />

      <Controller
        name={formFieldNames.sso.clientSecret}
        control={control}
        rules={isRequired ? { required: 'This field is required' } : {}}
        render={({ field, fieldState }) => (
          <MuiTextField
            sx={{ mb: 4 }}
            label="Client secret"
            placeholder="Add client secret"
            field={{ ...field, value: field.value || '' }}
            fieldState={fieldState}
            required={isRequired}
            multiline={true}
            rows={4}
          />
        )}
      />

      <Controller
        name={formFieldNames.sso.scopes}
        control={control}
        rules={isRequired ? { required: 'This field is required' } : {}}
        render={({ field, fieldState }) => (
          <MuiTextField
            label="Scopes"
            placeholder="Add scopes"
            field={{ ...field, value: field.value || '' }}
            fieldState={fieldState}
            required={isRequired}
            multiline={true}
            rows={4}
          />
        )}
      />
    </>
  );
};
