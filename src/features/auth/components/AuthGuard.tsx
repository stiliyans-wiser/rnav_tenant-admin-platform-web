'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated && pathname !== '/login') {
      router.replace('/login');
    } else if (isAuthenticated && pathname === '/login') {
      router.replace('/tenants');
    }
  }, [isAuthenticated, pathname, router]);

  return <>{children}</>;
} 
