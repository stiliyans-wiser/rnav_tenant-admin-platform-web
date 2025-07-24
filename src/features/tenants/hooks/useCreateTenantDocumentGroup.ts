import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantsConstants } from '@/features/tenants/constants/tenants.constants';
import { createTenantDocumentGroup } from '@/features/tenants/api/tenantDocumentGroupsApi';
import { DocumentGroup } from '@/features/tenants/interfaces/document-group.interface';

export const useCreateTenantDocumentGroup = (accountId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentGroup: Omit<DocumentGroup, 'id'>) => createTenantDocumentGroup(accountId, documentGroup),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantsConstants.documentGroupKeys.list(accountId) });
    },
  });
};
