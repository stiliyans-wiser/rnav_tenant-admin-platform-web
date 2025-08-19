import api from '@/features/auth/api/axiosConfig';
import { AiUsageDashboardResponse } from '@/features/dashboard/interfaces/ai-usage-dashboard-response.interface';
import { DashboardFilter } from '@/features/dashboard/interfaces/dashboard-filter.interface';
import { buildUrlWithParams } from '@/features/common/utils/queryParamsUtil';
import { AiUsageDashboard } from '@/features/dashboard/models/ai-usage-dashboard.model';

const url = '/admin/ai-usage-dashboard';

export const getAiUsage = async (filters?: DashboardFilter): Promise<AiUsageDashboard> => {
  const params = {
    account_id: filters?.accountId,
    time_period: filters?.timePeriod,
    from_date: filters?.fromDate,
    to_date: filters?.toDate,
  };

  const urlWithParams = buildUrlWithParams(url, params);
  const response = await api.get<AiUsageDashboardResponse>(urlWithParams);

  return new AiUsageDashboard(response.data);
};
