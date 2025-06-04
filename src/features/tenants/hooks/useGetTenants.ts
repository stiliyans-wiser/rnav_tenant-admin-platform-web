import { useQuery } from '@tanstack/react-query';
import { tenantsConstants } from '@/features/tenants/constants/tenants.constants';
import { getTenants } from '@/features/tenants/api/tenantsApi';

export const useGetTenants = () => {
  return useQuery({
    queryKey: tenantsConstants.tenantKeys.lists(),
    queryFn: getTenants,
  });
};
