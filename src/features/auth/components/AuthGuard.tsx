'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (!isAuthenticated && pathname !== '/login') {
    router.replace('/login');

    return null;
  }

  if (isAuthenticated && pathname === '/login') {
    router.replace('/tenants');
  }

  return <>{children}</>;
}
