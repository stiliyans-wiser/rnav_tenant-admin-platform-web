import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { MuiTextField } from '@/features/common/components/form-elements/MuiTextField';
import { formFieldNames } from '@/features/tenants/constants/form.constants';

export const GeneralDetailsForm = () => {
  const { control } = useFormContext();

  return (
    <>
      <Controller
        name={formFieldNames.generalDetails.companyName}
        control={control}
        rules={{ required: 'This field is required' }}
        render={({ field, fieldState }) => (
          <MuiTextField
            sx={{ mb: 4 }}
            label="Company name"
            placeholder="Add company name"
            field={{ ...field, value: field.value || '' }}
            fieldState={fieldState}
          />
        )}
      />

      <Controller
        name={formFieldNames.generalDetails.domain}
        control={control}
        rules={{ required: 'This field is required' }}
        render={({ field, fieldState }) => (
          <MuiTextField
            sx={{ mb: 4 }}
            label="Domain name"
            placeholder="Add domain name"
            field={{ ...field, value: field.value || '' }}
            fieldState={fieldState}
          />
        )}
      />
    </>
  );
};
