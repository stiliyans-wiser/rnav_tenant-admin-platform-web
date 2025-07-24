import { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Box, IconButton, InputAdornment, MenuItem } from '@mui/material';
import { Events, View, ViewOff } from '@carbon/icons-react';
import { CreateTenantStepProps } from '@/features/tenants/interfaces/create-tenant-step-props.interface';
import { CreateTenantLayout } from '@/features/tenants/components/common/layouts/CreateTenantLayout';
import { CreateTenantUser } from '@/features/tenants/interfaces/create-tenant-user.interface';
import { MuiSelect } from '@/features/common/components/form-elements/MuiSelect';
import { MuiTextField } from '@/features/common/components/form-elements/MuiTextField';
import { useCreateTenantContext } from '@/features/tenants/contexts/CreateTenantContext';
import { useCreateTenantUsers } from '@/features/tenants/hooks/useCreateTenantUsers';
import { emailRegex } from '@/features/common/utils/regexes';
import { formFieldNames } from '@/features/tenants/constants/form.constants';

const ROLE_OPTIONS: string[] = ['admin'];

export const UsersStep = ({ onBack, onNext }: CreateTenantStepProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { accountId } = useCreateTenantContext();
  const createTenantUsers = useCreateTenantUsers();

  const formMethods = useForm<CreateTenantUser>({
    mode: 'onChange',
    defaultValues: {
      account_id: accountId,
      role: 'admin',
    },
  });
  const hasError = !formMethods.formState.isValid;

  const onSubmit = async () => {
    const requestBody = formMethods.getValues();

    try {
      await createTenantUsers.mutateAsync(requestBody);
      onNext(hasError);
    } catch (error) {
      console.error('Error saving document type:', error);
    }
  };

  return (
    <CreateTenantLayout
      stepTitle="User & Role"
      stepIcon={<Events size={24} />}
      isNextButtonDisabled={hasError}
      nextButtonLabel="Finish"
      onBack={() => onBack(hasError)}
      onNext={onSubmit}
    >
      <FormProvider {...formMethods}>
        <Box component="form">
          <Controller
            name={formFieldNames.users.email as 'email'}
            control={formMethods.control}
            rules={{
              required: 'This field is required',
              pattern: {
                value: emailRegex,
                message: 'Please enter a valid email address.',
              },
            }}
            render={({ field, fieldState }) => (
              <MuiTextField
                sx={{ mb: 4 }}
                label="Email"
                type="email"
                placeholder="example@email.com"
                field={{ ...field, value: field.value || '' }}
                fieldState={fieldState}
              />
            )}
          />

          <Controller
            name={formFieldNames.users.firstName as 'first_name'}
            control={formMethods.control}
            rules={{ required: 'This field is required' }}
            render={({ field, fieldState }) => (
              <MuiTextField sx={{ mb: 4 }} label="First name" placeholder="John" field={{ ...field, value: field.value || '' }} fieldState={fieldState} />
            )}
          />

          <Controller
            name={formFieldNames.users.lastName as 'last_name'}
            control={formMethods.control}
            rules={{ required: 'This field is required' }}
            render={({ field, fieldState }) => (
              <MuiTextField sx={{ mb: 4 }} label="Last name" placeholder="Doe" field={{ ...field, value: field.value || '' }} fieldState={fieldState} />
            )}
          />

          <Controller
            name={formFieldNames.users.password as 'password'}
            control={formMethods.control}
            rules={{ required: 'This field is required' }}
            render={({ field, fieldState }) => (
              <MuiTextField
                sx={{ mb: 4 }}
                label="Password"
                placeholder="Enter password"
                type={showPassword ? 'text' : 'password'}
                field={field}
                fieldState={fieldState}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton aria-label="toggle password visibility" onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <View size={20} /> : <ViewOff size={20} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
          />

          <Controller
            name={formFieldNames.users.role as 'role'}
            control={formMethods.control}
            rules={{ required: 'This field is required' }}
            render={({ field, fieldState }) => (
              <MuiSelect
                field={field}
                label="Role"
                placeholder="Select role"
                fieldState={fieldState}
                options={ROLE_OPTIONS?.map(option => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              />
            )}
          />
        </Box>
      </FormProvider>
    </CreateTenantLayout>
  );
};
