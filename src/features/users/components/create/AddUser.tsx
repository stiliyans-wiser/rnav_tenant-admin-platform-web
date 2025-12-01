import { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Box, Button, Divider, IconButton, InputAdornment, Stack } from '@mui/material';
import { View, ViewOff } from '@carbon/icons-react';
import { MuiTextField } from '@/features/common/components/form-elements/MuiTextField';
import { useCreateUser } from '@/features/users/hooks/useCreateUser';
import { emailRegex } from '@/features/common/utils/regexes';
import { CreateUser } from '@/features/users/interfaces/create-user.interface';

interface AddUserProps {
  onClose: () => void;
}

export const AddUser = ({ onClose }: AddUserProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const formMethods = useForm<CreateUser>({
    mode: 'onChange',
  });

  const createUser = useCreateUser();

  const onSubmit = async () => {
    const requestBody = formMethods.getValues();

    try {
      await createUser.mutateAsync(requestBody);
      onClose();
    } catch (error) {
      console.error('Error saving user: ', error);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <Box component="form" sx={{ height: '100%' }} onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Stack sx={{ justifyContent: 'space-between', height: '100%' }}>
          <Stack>
            <Controller
              name="name"
              control={formMethods.control}
              rules={{ required: 'This field is required' }}
              render={({ field, fieldState }) => (
                <MuiTextField
                  sx={{ mb: 4 }}
                  label="Name"
                  placeholder="John Doe"
                  field={{ ...field, value: field.value || '' }}
                  fieldState={fieldState}
                />
              )}
            />

            <Controller
              name="email"
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
              name="password"
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
          </Stack>

          <Stack>
            <Divider sx={{ marginY: 3 }} />
            <Stack direction="row" gap={2} sx={{ justifyContent: 'flex-end' }}>
              <Button variant="outlined" color="primary" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" type="submit" disabled={!formMethods.formState.isValid}>
                Create
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </FormProvider>
  );
};
