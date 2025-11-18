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

export default function TaqaLoginPage() {
  const [isRevealKey, setIsRevealKey] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loginTitle = 'Step Into the Advisor';

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
    <Stack
      sx={{
        minHeight: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: '#00A0DF',
        backgroundImage:
          'url(/bg-images/bottom-right.png), url(/bg-images/top-left.png), url(/bg-images/bottom-left.png), url(/bg-images/center-bottom-left.png), url(/bg-images/center-top-left.png)',
        backgroundRepeat: 'no-repeat, no-repeat, no-repeat, no-repeat, no-repeat',
        backgroundPosition: 'right bottom, left top, left bottom, 70% 90%, 35% 25%',
        backgroundSize: '60% auto, 80% auto, 40% auto, 50% auto, 40% auto',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: '30px' }}>
        <Box component="img" src="/taqa-logo.png" alt="TAQA logo" sx={{ width: '157px', height: 'auto' }} />
      </Box>
      <Card variant="outlined" sx={{ width: '486px', height: '380px', padding: 3, borderRadius: '24px' }}>
        <CardContent>
          <Typography variant="h6" sx={{ marginY: 2, textAlign: 'center' }}>
            {loginTitle}
          </Typography>
          <FormProvider {...formMethods}>
            <Box component="form" onSubmit={formMethods.handleSubmit(onSubmit)}>
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
                    label="Username"
                    placeholder="email@example.com"
                    field={field}
                    fieldState={fieldState}
                    sx={{ mb: 3, '& .MuiInputBase-root': { height: 48 } }}
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
                    sx={{ '& .MuiInputBase-root': { height: 48 } }}
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

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={!formMethods.formState.isValid}
                sx={{ mt: 2, bgcolor: '#00A0DF', borderRadius: '8px' }}
              >
                Login
              </Button>
            </Box>
          </FormProvider>
        </CardContent>
      </Card>
    </Stack>
  );
}
