import { Controller, useFormContext } from 'react-hook-form';
import { AudioConsole } from '@carbon/icons-react';
import { Divider, MenuItem } from '@mui/material';
import { MuiTextField } from '@/features/common/components/form-elements/MuiTextField';
import { MuiSelect } from '@/features/common/components/form-elements/MuiSelect';
import { CreateTenantStepProps } from '@/features/tenants/interfaces/create-tenant-step-props.interface';
import { CreateTenantStepLayout } from '@/features/tenants/components/create/layouts/CreateTenantStepLayout';
import { useStepValidation } from '@/features/tenants/hooks/useStepValidation';

const FIELD_NAMES = ['company_name', 'domain', 'settings.preferred_currency', 'settings.preferred_timezone'];
const CURRENCY_OPTIONS: string[] = ['EUR', 'USD', 'GBP', 'JPY', 'AUD'];
const TIMEZONE_OPTIONS: string[] = ['UTC', 'EST', 'PST', 'CET', 'GMT'];

export const GeneralDetailsStep = ({ onBack, onNext }: CreateTenantStepProps) => {
  const { control } = useFormContext();
  const { hasError } = useStepValidation(FIELD_NAMES);

  return (
    <CreateTenantStepLayout
      stepTitle="General Details"
      stepIcon={<AudioConsole size={24} />}
      isNextButtonDisabled={hasError}
      isBackButtonDisabled={true}
      onBack={() => onBack(hasError)}
      onNext={() => onNext(hasError)}
    >
      <Controller
        name={FIELD_NAMES[0]}
        control={control}
        rules={{ required: 'This field is required' }}
        render={({ field, fieldState }) => (
          <MuiTextField sx={{ mb: 4 }} label="Company name" placeholder="Add company name" field={field} fieldState={fieldState} />
        )}
      />

      <Controller
        name={FIELD_NAMES[1]}
        control={control}
        rules={{ required: 'This field is required' }}
        render={({ field, fieldState }) => (
          <MuiTextField sx={{ mb: 4 }} label="Domain name" placeholder="Add domain name" field={field} fieldState={fieldState} />
        )}
      />

      <Divider sx={{ mb: 4 }} />

      <Controller
        name={FIELD_NAMES[2]}
        control={control}
        rules={{ required: 'This field is required' }}
        render={({ field, fieldState }) => (
          <MuiSelect
            sx={{ mb: 4 }}
            field={field}
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
        name={FIELD_NAMES[3]}
        control={control}
        rules={{ required: 'This field is required' }}
        render={({ field, fieldState }) => (
          <MuiSelect
            field={field}
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
    </CreateTenantStepLayout>
  );
};
