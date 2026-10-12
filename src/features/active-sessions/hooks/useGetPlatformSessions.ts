import { useQuery } from '@tanstack/react-query';
import { activeSessionsConstants } from '@/features/active-sessions/constants/active-sessions.constants';
import { getPlatformSessions } from '@/features/active-sessions/api/activeSessions';

const POLL_INTERVAL_MS = 30_000;

export const useGetPlatformSessions = () => {
  return useQuery({
    queryKey: activeSessionsConstants.sessionKeys.platform(),
    queryFn: getPlatformSessions,
    refetchInterval: POLL_INTERVAL_MS,
    retry: 2,
    retryDelay: 1000,
  });
};
