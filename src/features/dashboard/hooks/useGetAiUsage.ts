import { useQuery } from '@tanstack/react-query';
import { aiUsageConstants } from '@/features/dashboard/constants/aiUsage.constants';
import { getAiUsage } from '@/features/dashboard/api/aiUsageApi';
import { DashboardFilter } from '@/features/dashboard/interfaces/dashboard-filter.interface';

export const useGetAiUsage = (filters?: DashboardFilter) => {
  return useQuery({
    queryKey: aiUsageConstants.aiUsageKeys.list(filters || {}),
    queryFn: () => getAiUsage(filters),
    enabled: filters !== undefined,
    retry: false,
  });
};
