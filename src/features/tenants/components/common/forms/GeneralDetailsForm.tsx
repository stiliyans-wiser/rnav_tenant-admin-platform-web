import { Controller, useFormContext } from 'react-hook-form';
import { Divider, MenuItem } from '@mui/material';
import { MuiTextField } from '@/features/common/components/form-elements/MuiTextField';
import { MuiSelect } from '@/features/common/components/form-elements/MuiSelect';
import { TenantFormConfig } from '@/features/tenants/interfaces/tenant-form-config.interface';
import { formFieldNames } from '@/features/tenants/constants/form.constants';

const CURRENCY_OPTIONS: string[] = ['EUR', 'USD', 'GBP', 'JPY', 'AUD'];
const TIMEZONE_OPTIONS: string[] = ['UTC', 'EST', 'PST', 'CET', 'GMT'];

export const GeneralDetailsForm = ({ disabledFields = [] }: TenantFormConfig) => {
  const { control } = useFormContext();

  return (
    <>
      <Controller
        name={formFieldNames.generalDetails.companyName}
        control={control}
        rules={{ required: 'This field is required' }}
        render={({ field, fieldState }) => (
          <MuiTextField sx={{ mb: 4 }} label="Company name" placeholder="Add company name" field={{ ...field, value: field.value || '' }} fieldState={fieldState} />
        )}
      />

      <Controller
        name={formFieldNames.generalDetails.domain}
        control={control}
        disabled={disabledFields.includes(formFieldNames.generalDetails.domain)}
        rules={{ required: 'This field is required' }}
        render={({ field, fieldState }) => (
          <MuiTextField sx={{ mb: 4 }} label="Domain name" placeholder="Add domain name" field={{ ...field, value: field.value || '' }} fieldState={fieldState} />
        )}
      />

      <Divider sx={{ mb: 4 }} />

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
