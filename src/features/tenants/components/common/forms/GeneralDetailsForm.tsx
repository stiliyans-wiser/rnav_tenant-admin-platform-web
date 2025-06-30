import React from 'react';
import { Controller, ControllerRenderProps, FieldValues, useFormContext, useWatch } from 'react-hook-form';
import { Chip, Divider, MenuItem, Stack } from '@mui/material';
import { MuiTextField } from '@/features/common/components/form-elements/MuiTextField';
import { MuiSelect } from '@/features/common/components/form-elements/MuiSelect';
import { TenantFormConfig } from '@/features/tenants/interfaces/tenant-form-config.interface';
import { formFieldNames } from '@/features/tenants/constants/form.constants';
import { DOCUMENT_DATA_SOURCE_LABELS } from '@/features/tenants/constants/messages.constants';
import { AdminConfig } from '@/features/tenants/interfaces/admin-config.interface';

interface GeneralDetailsFormProps extends TenantFormConfig {
  adminConfig: AdminConfig;
}

const CURRENCY_OPTIONS: string[] = ['EUR', 'USD', 'GBP', 'JPY', 'AUD'];
const TIMEZONE_OPTIONS: string[] = ['UTC', 'EST', 'PST', 'CET', 'GMT'];

export const GeneralDetailsForm = ({ adminConfig, disabledFields = [] }: GeneralDetailsFormProps) => {
  const { control } = useFormContext();

  console.log(adminConfig);

  const selectedDataSourceValues = useWatch({
    control,
    name: formFieldNames.documents.documentDataSources,
  });

  const handleDeleteChip = (item: string, field: ControllerRenderProps<FieldValues, string>) => {
    const newSelected = selectedDataSourceValues.filter((value: string) => value !== item);

    field.onChange(newSelected);
  };

  const renderChip = (item: string, field: any) => {
    return (
      <Chip
        key={item}
        label={DOCUMENT_DATA_SOURCE_LABELS[item] || item}
        onDelete={() => handleDeleteChip(item, field)}
        onMouseDown={event => event.stopPropagation()}
      />
    );
  };

  return (
    <>
      <Controller
        name={formFieldNames.generalDetails.companyName}
        control={control}
        rules={{ required: 'This field is required' }}
        render={({ field, fieldState }) => (
          <MuiTextField sx={{ mb: 4 }} label="Company name" placeholder="Add company name" field={field} fieldState={fieldState} />
        )}
      />

      <Controller
        name={formFieldNames.generalDetails.domain}
        control={control}
        disabled={disabledFields.includes(formFieldNames.generalDetails.domain)}
        rules={{ required: 'This field is required' }}
        render={({ field, fieldState }) => (
          <MuiTextField sx={{ mb: 4 }} label="Domain name" placeholder="Add domain name" field={field} fieldState={fieldState} />
        )}
      />

      <Divider sx={{ mb: 4 }} />

      <Controller
        name={formFieldNames.documents.documentDataSources}
        control={control}
        defaultValue={adminConfig?.document_data_sources || []}
        rules={{ required: 'This field is required' }}
        render={({ field, fieldState }) => (
          <MuiSelect
            field={field}
            label="Document Data Sources"
            placeholder="Select Document Data Sources"
            fieldState={fieldState}
            multiple={true}
            options={adminConfig?.document_data_sources?.map(dataSource => (
              <MenuItem key={dataSource} value={dataSource}>
                {DOCUMENT_DATA_SOURCE_LABELS[dataSource]}
              </MenuItem>
            ))}
            renderValue={(selectedDocuments: string[]) => (
              <Stack direction="row" sx={{ flexWrap: 'wrap' }} gap={0.5}>
                {selectedDocuments?.map(item => renderChip(item, field))}
              </Stack>
            )}
          />
        )}
      />

      <Divider sx={{ my: 4 }} />

      <Controller
        name={formFieldNames.settings.preferredCurrency}
        control={control}
        rules={{ required: 'This field is required' }}
        render={({ field, fieldState }) => (
          <MuiSelect
            sx={{ mb: 4 }}
            field={{ ...field, value: field.value || '' }}
            label="Preferred currency"
            placeholder="Select currency type"
            fieldState={fieldState}
            options={CURRENCY_OPTIONS.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          />
        )}
      />

      <Controller
        name={formFieldNames.settings.preferredTimezone}
        control={control}
        rules={{ required: 'This field is required' }}
        render={({ field, fieldState }) => (
          <MuiSelect
            field={{ ...field, value: field.value || '' }}
            label="Preferred timezone"
            placeholder="Select timezone"
            fieldState={fieldState}
            options={TIMEZONE_OPTIONS.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          />
        )}
      />
    </>
  );
};
