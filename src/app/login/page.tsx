'use client';

import { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Box, Button, IconButton, InputAdornment, Alert, Typography, Card, CardContent, Stack } from '@mui/material';
import { View, ViewOff } from '@carbon/icons-react';
import { MuiTextField } from '@/features/common/components/form-elements/MuiTextField';

interface LoginFormData {
  loginKey: string;
}

export default function LoginPage() {
  const [isRevealKey, setIsRevealKey] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const formMethods = useForm<LoginFormData>({
    defaultValues: {
      loginKey: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    try {
      setError(null);

      const loginKeyInput = data.loginKey.trim();
      if (loginKeyInput) {
        login(loginKeyInput);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Invalid login key. Please try again.');
      }
    }
  };

  return (
    <Stack sx={{ height: '100%', justifyContent: 'center' }}>
      <Card variant="outlined" sx={{ alignSelf: 'center', width: '520px', padding: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ marginY: 2, textAlign: 'center' }}>
            Login
          </Typography>

          <FormProvider {...formMethods}>
            <Box component="form" onSubmit={formMethods.handleSubmit(onSubmit)} sx={{ mt: 2 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Controller
                name="loginKey"
                control={formMethods.control}
                rules={{ required: 'Login key is required' }}
                render={({ field, fieldState }) => (
                  <MuiTextField
                    label="Login Key"
                    placeholder="Enter your login key"
                    type={isRevealKey ? 'text' : 'password'}
                    field={field}
                    fieldState={fieldState}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton aria-label="toggle password visibility" onClick={() => setIsRevealKey(!isRevealKey)} edge="end">
                              {isRevealKey ? <View size={20} /> : <ViewOff size={20} />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              />

              <Button type="submit" fullWidth variant="contained" size="large" disabled={formMethods.formState.isSubmitting} sx={{ mt: 2 }}>
                Login
              </Button>
            </Box>
          </FormProvider>
        </CardContent>
      </Card>
    </Stack>
  );
}
