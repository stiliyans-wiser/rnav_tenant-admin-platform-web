import { useQuery } from '@tanstack/react-query';
import { tenantsConstants } from '@/features/tenants/constants/tenants.constants';
import { getAutoMatchAvailability } from '@/features/tenants/api/autoMatchAvailabilityApi';

export const useGetAutoMatchAvailability = (tenantId: string) => {
  return useQuery({
    queryKey: tenantsConstants.autoMatchAvailabilityKeys.detail(tenantId),
    queryFn: () => getAutoMatchAvailability(tenantId),
    enabled: !!tenantId,
  });
};
