import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

enum SessionStatus {
  LOADING = 'loading',
  AUTHENTICATED = 'authenticated',
}

export const useAuth = () => {
  const { data: session, status } = useSession();

  const isLoading = useMemo(() => {
    return status === SessionStatus.LOADING;
  }, [status]);

  const isAuthenticated = useMemo(() => {
    return status === SessionStatus.AUTHENTICATED && !!session;
  }, [status, session]);

  const currentUser = useMemo(() => {
    return session?.user || null;
  }, [session]);

  return { isLoading, isAuthenticated, currentUser };
};
