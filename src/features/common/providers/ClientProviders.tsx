'use client';

import { useEffect } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import { setSessionToken } from '@/features/auth/api/axiosConfig';
import { QueryProvider } from '@/features/common/providers/QueryProvider';

interface ClientProvidersProps {
  children: React.ReactNode;
}

const ProvidersContent = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();

  useEffect(() => {
    setSessionToken(session?.accessToken || null);
  }, [session]);

  return <QueryProvider>{children}</QueryProvider>;
};

export const ClientProviders = ({ children }: ClientProvidersProps) => {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false} refetchWhenOffline={false} basePath="/next-api/auth">
      <ProvidersContent>{children}</ProvidersContent>
    </SessionProvider>
  );
};
