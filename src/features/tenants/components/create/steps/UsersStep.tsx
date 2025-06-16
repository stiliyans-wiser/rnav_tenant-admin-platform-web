import { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Box, IconButton, InputAdornment, MenuItem } from '@mui/material';
import { Events, View, ViewOff } from '@carbon/icons-react';
import { CreateTenantStepProps } from '@/features/tenants/interfaces/create-tenant-step-props.interface';
import { CreateTenantStepLayout } from '@/features/tenants/components/create/layouts/CreateTenantStepLayout';
import { CreateTenantUser } from '@/features/tenants/interfaces/create-tenant-user.interface';
import { MuiSelect } from '@/features/common/components/form-elements/MuiSelect';
import { MuiTextField } from '@/features/common/components/form-elements/MuiTextField';
import { useCreateTenantContext } from '@/features/tenants/contexts/CreateTenantContext';
import { useCreateTenantUsers } from '@/features/tenants/hooks/useCreateTenantUsers';
import { emailRegex } from '@/features/common/utils/regexes';

const FIELD_NAMES: (keyof CreateTenantUser)[] = ['email', 'first_name', 'last_name', 'password', 'role', 'account_id'];
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
    <CreateTenantStepLayout
      stepTitle="User & Role"
      stepIcon={<Events size={24} />}
      isNextButtonDisabled={hasError}
      isBackButtonDisabled={false}
      nextButtonLabel="Finish"
      onBack={() => onBack(hasError)}
      onNext={onSubmit}
    >
      <FormProvider {...formMethods}>
        <Box component="form">
          <Controller
            name={FIELD_NAMES[0]}
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
                field={field}
                fieldState={fieldState}
              />
            )}
          />

          <Controller
            name={FIELD_NAMES[1]}
            control={formMethods.control}
            rules={{ required: 'This field is required' }}
            render={({ field, fieldState }) => (
              <MuiTextField sx={{ mb: 4 }} label="First name" placeholder="John" field={field} fieldState={fieldState} />
            )}
          />

          <Controller
            name={FIELD_NAMES[2]}
            control={formMethods.control}
            rules={{ required: 'This field is required' }}
            render={({ field, fieldState }) => (
              <MuiTextField sx={{ mb: 4 }} label="Last name" placeholder="Doe" field={field} fieldState={fieldState} />
            )}
          />

          <Controller
            name={FIELD_NAMES[3]}
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
            name={FIELD_NAMES[4]}
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
    </CreateTenantStepLayout>
  );
};
