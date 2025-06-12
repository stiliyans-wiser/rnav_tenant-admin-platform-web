'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { isClient } from '@/features/common/utils/is-client.util';

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
    }

    if (isAuthenticated && pathname === '/login') {
      router.replace('/tenants');
    }
  }, [isAuthenticated, pathname, router]);

  // Don't render anything during SSR for unauthenticated users
  if (!isClient()) {
    return null;
  }

  if (!isAuthenticated && pathname !== '/login') {
    return null;
  }

  return <>{children}</>;
}
