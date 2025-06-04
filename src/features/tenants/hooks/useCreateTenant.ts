import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantsConstants } from '@/features/tenants/constants/tenants.constants';
import { createTenant } from '@/features/tenants/api/tenantsApi';
import { Tenant } from '../interfaces/tenant.interface';

export const useCreateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tenant: Omit<Tenant, 'id'>) => createTenant(tenant),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantsConstants.tenantKeys.lists() });
    },
  });
};
