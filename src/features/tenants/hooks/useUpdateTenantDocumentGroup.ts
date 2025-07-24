import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantsConstants } from '@/features/tenants/constants/tenants.constants';
import { updateTenantDocumentGroup } from '@/features/tenants/api/tenantDocumentGroupsApi';
import { DocumentGroup } from '@/features/tenants/interfaces/document-group.interface';

export const useUpdateTenantDocumentGroup = (accountId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupSlug, documentGroup }: { groupSlug: string; documentGroup: Partial<DocumentGroup> }) =>
      updateTenantDocumentGroup(accountId, groupSlug, documentGroup),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantsConstants.documentGroupKeys.list(accountId) });
    },
  });
};
