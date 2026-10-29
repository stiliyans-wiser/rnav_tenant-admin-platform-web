import api from '@/features/auth/api/axiosConfig';
import { AutoMatchOnJobEditAvailability } from '@/features/tenants/interfaces/auto-match-availability.interface';

const path = (accountId: string) => `/backoffice/accounts/${accountId}/auto-match-on-job-edit`;

export const getAutoMatchAvailability = async (accountId: string): Promise<AutoMatchOnJobEditAvailability> => {
  const response = await api.get<AutoMatchOnJobEditAvailability>(path(accountId));
  return response.data;
};

export const updateAutoMatchAvailability = async (accountId: string, available: boolean): Promise<AutoMatchOnJobEditAvailability> => {
  const response = await api.patch<AutoMatchOnJobEditAvailability>(path(accountId), { available });
  return response.data;
};
