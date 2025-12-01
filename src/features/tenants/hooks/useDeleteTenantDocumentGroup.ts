import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantsConstants } from '@/features/tenants/constants/tenants.constants';
import { deleteTenantDocumentGroup } from '@/features/tenants/api/tenantDocumentGroupsApi';

export const useDeleteTenantDocumentGroup = (accountId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupSlug: string) => deleteTenantDocumentGroup(accountId, groupSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantsConstants.documentGroupKeys.list(accountId) });
    },
  });
};
