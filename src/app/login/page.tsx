'use client';

import { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { Box, Button, IconButton, InputAdornment, Alert, Typography, Card, CardContent, Stack } from '@mui/material';
import { View, ViewOff } from '@carbon/icons-react';
import { MuiTextField } from '@/features/common/components/form-elements/MuiTextField';
import { emailRegex } from '@/features/common/utils/regexes';

interface LoginCredentials {
  username: string;
  password: string;
}

export default function LoginPage() {
  const [isRevealKey, setIsRevealKey] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isTaqaHost = typeof window !== 'undefined' && (window.location.hostname === 'taqa' || window.location.href.includes('taqa'));
  const loginTitle = isTaqaHost ? 'Login into TQ* Back-office' : 'Login';

  const formMethods = useForm<LoginCredentials>();

  const onSubmit = async (loginCredentials: LoginCredentials) => {
    try {
      const result = await signIn('credentials', {
        ...loginCredentials,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <Stack sx={{ height: '100%', justifyContent: 'center' }}>
      <Card variant="outlined" sx={{ alignSelf: 'center', width: '520px', padding: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ marginY: 2, textAlign: 'center' }}>
            {loginTitle}
          </Typography>

          <FormProvider {...formMethods}>
            <Box component="form" onSubmit={formMethods.handleSubmit(onSubmit)} sx={{ mt: 2 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Controller
                name="username"
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
                    label="Your company email"
                    placeholder="email@example.com"
                    field={field}
                    fieldState={fieldState}
                    sx={{ mb: 3 }}
                  />
                )}
              />

              <Controller
                name="password"
                control={formMethods.control}
                rules={{ required: 'This field is required' }}
                render={({ field, fieldState }) => (
                  <MuiTextField
                    label="Your Password"
                    placeholder="Enter your password"
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

              <Button type="submit" fullWidth variant="contained" size="large" disabled={!formMethods.formState.isValid} sx={{ mt: 2 }}>
                Login
              </Button>
            </Box>
          </FormProvider>
        </CardContent>
      </Card>
    </Stack>
  );
}
