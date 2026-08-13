'use client';

import { useEffect, useState } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import { setSessionToken } from '@/features/auth/api/axiosConfig';
import { QueryProvider } from '@/features/common/providers/QueryProvider';

interface ClientProvidersProps {
  children: React.ReactNode;
}

const ProvidersContent = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [tokenReady, setTokenReady] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    setSessionToken(session?.accessToken || null);
    setTokenReady(true);
  }, [session, status]);

  if (!tokenReady) {
    return null;
  }

  return <QueryProvider>{children}</QueryProvider>;
};

export const ClientProviders = ({ children }: ClientProvidersProps) => {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false} refetchWhenOffline={false} basePath="/backoffice/api/auth">
      <ProvidersContent>{children}</ProvidersContent>
    </SessionProvider>
  );
};
