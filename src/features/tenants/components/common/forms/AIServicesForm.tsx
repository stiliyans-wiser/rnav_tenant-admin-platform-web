import { MuiSelect } from '@/features/common/components/form-elements/MuiSelect';
import { MuiTextField } from '@/features/common/components/form-elements/MuiTextField';
import { FormControlLabel, MenuItem, Switch, Typography } from '@mui/material';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { AdminConfig } from '@/features/tenants/interfaces/admin-config.interface';
import { formFieldNames } from '@/features/tenants/constants/form.constants';

interface AIServicesFormProps {
  adminConfig: AdminConfig;
}

export const AIServicesForm = ({ adminConfig }: AIServicesFormProps) => {
  const { control } = useFormContext();
  const hasOpenAiKey = Boolean(
    useWatch({
      control,
      name: 'ai_config.has_open_ai_key',
    }),
  );

  return (
    <>
      <Controller
        name={formFieldNames.aiConfig.aiType}
        control={control}
        rules={{ required: 'This field is required' }}
        render={({ field, fieldState }) => (
          <MuiSelect
            sx={{ mb: 4 }}
            field={{ ...field, value: field.value || '' }}
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
        name={formFieldNames.aiConfig.aiEmbeddingModel}
        control={control}
        rules={{ required: 'This field is required' }}
        render={({ field, fieldState }) => (
          <MuiSelect
            sx={{ mb: 4 }}
            field={{ ...field, value: field.value || '' }}
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
        name={formFieldNames.aiConfig.temperature}
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
            field={{ ...field, value: field.value || '' }}
            fieldState={fieldState}
          />
        )}
      />

      <Controller
        name={formFieldNames.aiConfig.openAiKey}
        control={control}
        rules={hasOpenAiKey ? undefined : { required: 'This field is required' }}
        render={({ field, fieldState }) => (
          <>
            <MuiTextField
              sx={{ mb: hasOpenAiKey ? 1 : 4 }}
              label="Open AI key"
              placeholder={hasOpenAiKey ? 'Configured - leave blank to keep existing key' : 'Add key value'}
              field={{ ...field, value: field.value || '' }}
              fieldState={fieldState}
              required={!hasOpenAiKey}
            />
            {hasOpenAiKey ? (
              <Typography variant="caption" sx={{ display: 'block', mb: 4, color: 'text.secondary' }}>
                A server-side key is configured. Leave blank to keep/use it, or enter a new key to replace it.
              </Typography>
            ) : null}
          </>
        )}
      />

      <Controller
        name={formFieldNames.aiConfig.openAiEndpoint}
        control={control}
        rules={{ required: 'This field is required' }}
        render={({ field, fieldState }) => (
          <MuiTextField sx={{ mb: 4 }} label="Open AI endpoint" placeholder="Add endpoint URL" field={{ ...field, value: field.value || '' }} fieldState={fieldState} />
        )}
      />

      <Controller
        name={formFieldNames.aiConfig.openAiVersion}
        control={control}
        rules={{ required: 'This field is required' }}
        render={({ field, fieldState }) => (
          <MuiTextField sx={{ mb: 4 }} label="Open AI version" placeholder="Add version" field={{ ...field, value: field.value || '' }} fieldState={fieldState} />
        )}
      />

      <Controller
        name={formFieldNames.aiConfig.webSearch}
        control={control}
        defaultValue={false}
        render={({ field }) => <FormControlLabel control={<Switch {...field} checked={field.value} />} label="Include web search" />}
      />

      <Controller
        name={formFieldNames.matchConfig.topK}
        control={control}
        defaultValue={50}
        rules={{
          required: 'This field is required',
          min: {
            value: 0,
            message: 'The value must be at least 0',
          },
          max: {
            value: 100,
            message: 'The value must not exceed 100',
          },
        }}
        render={({ field, fieldState }) => (
          <MuiTextField
            sx={{ mt: 4, mb: 1 }}
            type="number"
            label="Recruitment matching top_k"
            placeholder="Add top_k value"
            field={{ ...field, value: field.value ?? 50 }}
            fieldState={fieldState}
          />
        )}
      />
    </>
  );
};
