import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantsConstants } from '@/features/tenants/constants/tenants.constants';
import { updateTenant } from '@/features/tenants/api/tenantsApi';
import { Tenant } from '@/features/tenants/interfaces/tenant.interface';

export const useUpdateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, tenant }: { id: string; tenant: Partial<Tenant> }) => updateTenant(id, tenant),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: tenantsConstants.tenantKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tenantsConstants.tenantKeys.detail(id) });
    },
  });
};
