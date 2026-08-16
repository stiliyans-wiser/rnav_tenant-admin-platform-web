import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantsConstants } from '@/features/tenants/constants/tenants.constants';
import {
  getProviderQuotaDefaults,
  updateProviderQuotaDefaults,
  getTenantProviderQuota,
  updateTenantProviderQuota,
  deleteTenantProviderQuota,
  getTenantProviderUsage,
} from '@/features/tenants/api/providerQuotaApi';
import { ProviderQuotaDefaults } from '@/features/tenants/interfaces/provider-quota.interface';

export const useGetProviderQuotaDefaults = () => {
  return useQuery({
    queryKey: tenantsConstants.providerQuotaDefaultKeys.detail(),
    queryFn: getProviderQuotaDefaults,
  });
};

export const useUpdateProviderQuotaDefaults = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<ProviderQuotaDefaults>) => updateProviderQuotaDefaults(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantsConstants.providerQuotaDefaultKeys.all });
    },
  });
};

export const useGetTenantProviderQuota = (tenantId: string) => {
  return useQuery({
    queryKey: tenantsConstants.tenantProviderQuotaKeys.detail(tenantId),
    queryFn: () => getTenantProviderQuota(tenantId),
    enabled: !!tenantId,
  });
};

export const useUpdateTenantProviderQuota = (tenantId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<ProviderQuotaDefaults>) => updateTenantProviderQuota(tenantId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantsConstants.tenantProviderQuotaKeys.detail(tenantId) });
    },
  });
};

export const useDeleteTenantProviderQuota = (tenantId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteTenantProviderQuota(tenantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantsConstants.tenantProviderQuotaKeys.detail(tenantId) });
    },
  });
};

export const useGetTenantProviderUsage = (tenantId: string) => {
  return useQuery({
    queryKey: tenantsConstants.tenantProviderUsageKeys.detail(tenantId),
    queryFn: () => getTenantProviderUsage(tenantId),
    enabled: !!tenantId,
  });
};
