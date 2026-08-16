import api from '@/features/auth/api/axiosConfig';
import { ProviderQuotaDefaults, TenantProviderQuota, TenantProviderUsage } from '@/features/tenants/interfaces/provider-quota.interface';

export const getProviderQuotaDefaults = async (): Promise<ProviderQuotaDefaults> => {
  const response = await api.get<ProviderQuotaDefaults>('/backoffice/provider-quota-defaults');
  return response.data;
};

export const updateProviderQuotaDefaults = async (body: Partial<ProviderQuotaDefaults>): Promise<ProviderQuotaDefaults> => {
  const response = await api.put<ProviderQuotaDefaults>('/backoffice/provider-quota-defaults', body);
  return response.data;
};

export const getTenantProviderQuota = async (accountId: string): Promise<TenantProviderQuota> => {
  const response = await api.get<TenantProviderQuota>(`/backoffice/tenants/${accountId}/provider-quotas`);
  return response.data;
};

export const updateTenantProviderQuota = async (
  accountId: string,
  body: Partial<ProviderQuotaDefaults>,
): Promise<TenantProviderQuota> => {
  const response = await api.put<TenantProviderQuota>(`/backoffice/tenants/${accountId}/provider-quotas`, body);
  return response.data;
};

export const deleteTenantProviderQuota = async (accountId: string): Promise<void> => {
  await api.delete(`/backoffice/tenants/${accountId}/provider-quotas`);
};

export const getTenantProviderUsage = async (accountId: string): Promise<TenantProviderUsage> => {
  const response = await api.get<TenantProviderUsage>(`/backoffice/tenants/${accountId}/provider-usage`);
  return response.data;
};
