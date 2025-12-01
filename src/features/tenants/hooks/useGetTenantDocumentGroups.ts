import { useQuery } from '@tanstack/react-query';
import { tenantsConstants } from '@/features/tenants/constants/tenants.constants';
import { getTenantDocumentGroups } from '@/features/tenants/api/tenantDocumentGroupsApi';

export const useGetTenantDocumentGroups = (accountId: string) => {
  return useQuery({
    queryKey: tenantsConstants.documentGroupKeys.list(accountId),
    queryFn: () => getTenantDocumentGroups(accountId),
    enabled: !!accountId,
  });
};
