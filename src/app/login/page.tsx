'use client';

import { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useAuth } from '@/features/auth/context/AuthContext';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Alert,
  Typography,
  Card,
  CardContent
} from '@mui/material';
import { View, ViewOff } from '@carbon/icons-react';
import TextField from '@mui/material/TextField';

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

  const onSubmit = async (data: LoginFormData) => {
    try {
      if (data.loginKey.trim()) {
        await login(data.loginKey.trim());
      }
    } catch (err) {
      setError('Invalid login key. Please try again.');
    }
  };

  return (
    <Card variant="outlined" sx={{ alignSelf: 'center', width: '520px', padding: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ marginY: 2, textAlign: 'center' }}>
          Login
        </Typography>

        <FormProvider {...formMethods}>
          <Box
            component="form"
            onSubmit={formMethods.handleSubmit(onSubmit)}
            sx={{ mt: 2 }}
          >
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
                <TextField
                  {...field}
                  fullWidth
                  label="Login Key"
                  type={isRevealKey ? 'text' : 'password'}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle key visibility"
                            onClick={() => setIsRevealKey(!isRevealKey)}
                            edge="end"
                          >
                            {isRevealKey ? <View /> : <ViewOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }
                  }}
                  sx={{ mb: 2 }}
                />
              )}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={!formMethods.formState.isValid}
              sx={{ mt: 2 }}
            >
              Login
            </Button>
          </Box>
        </FormProvider>
      </CardContent>
    </Card>
  );
} 
