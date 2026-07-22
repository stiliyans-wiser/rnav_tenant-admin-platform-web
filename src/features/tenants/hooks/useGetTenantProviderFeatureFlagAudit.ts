import { useQuery } from '@tanstack/react-query';
import { tenantsConstants } from '@/features/tenants/constants/tenants.constants';
import { getTenantProviderFeatureFlagAudit } from '@/features/tenants/api/tenantsApi';

export const useGetTenantProviderFeatureFlagAudit = (tenantId?: string) => {
  return useQuery({
    queryKey: tenantsConstants.providerFeatureFlagAuditKeys.list(tenantId || ''),
    queryFn: () => getTenantProviderFeatureFlagAudit(tenantId as string),
    enabled: !!tenantId,
  });
};
