import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantsConstants } from '@/features/tenants/constants/tenants.constants';
import { deleteTenant } from '@/features/tenants/api/tenantsApi';

export const useDeleteTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantsConstants.tenantKeys.lists() });
    },
  });
};
