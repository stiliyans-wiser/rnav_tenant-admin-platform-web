import { useQuery } from '@tanstack/react-query';
import { tenantsConstants } from '@/features/tenants/constants/tenants.constants';
import { getTenantById } from '@/features/tenants/api/tenantsApi';

export const useGetTenantById = (id: string) => {
  return useQuery({
    queryKey: tenantsConstants.tenantKeys.detail(id),
    queryFn: () => getTenantById(id),
    enabled: !!id,
  });
};
