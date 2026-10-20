import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tenantsConstants } from '@/features/tenants/constants/tenants.constants';
import { getMatchingOntology, updateMatchingOntology } from '@/features/tenants/api/matchingOntologyApi';
import { MatchingOntologyPatch } from '@/features/tenants/interfaces/matching-ontology.interface';

export const useGetMatchingOntology = (tenantId: string) => {
  return useQuery({
    queryKey: tenantsConstants.matchingOntologyKeys.detail(tenantId),
    queryFn: () => getMatchingOntology(tenantId),
    enabled: !!tenantId,
  });
};

export const useUpdateMatchingOntology = (tenantId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: MatchingOntologyPatch) => updateMatchingOntology(tenantId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantsConstants.matchingOntologyKeys.detail(tenantId) });
    },
  });
};
