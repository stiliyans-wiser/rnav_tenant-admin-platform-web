'use client';

import { useAuth } from '../context/AuthContext';
import { redirect } from 'next/navigation';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated } = useAuth();
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  if (!isAuthenticated && pathname !== '/login') {
    redirect('/login');
  }

  if (isAuthenticated && pathname === '/login') {
    redirect('/');
  }

  return <>{children}</>;
} 
