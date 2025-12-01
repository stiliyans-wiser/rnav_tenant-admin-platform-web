'use client';

import { useEffect } from 'react';
import { redirect, usePathname } from 'next/navigation';
import { Typography } from '@mui/material';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated && pathname !== '/login') {
      redirect('/login');
    }

    if (isAuthenticated && (pathname === '/login' || pathname === '/')) {
      redirect('/dashboard');
    }
  }, [isAuthenticated, isLoading, pathname]);

  if (isLoading) {
    return (
      <Typography variant="h6" align="center">
        Loading...
      </Typography>
    );
  }

  return <>{children}</>;
};
