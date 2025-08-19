import { DashboardFilter } from '@/features/dashboard/interfaces/dashboard-filter.interface';

export const aiUsageConstants = {
  aiUsageKeys: {
    all: ['ai-usage'] as const,
    lists: () => [...aiUsageConstants.aiUsageKeys.all, 'list'] as const,
    list: (filters: DashboardFilter) => [...aiUsageConstants.aiUsageKeys.lists(), { filters }] as const,
  },
};
