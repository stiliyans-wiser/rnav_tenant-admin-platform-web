import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tenantsConstants } from '@/features/tenants/constants/tenants.constants';
import { getDecisionReasonsAvailability, updateDecisionReasonsAvailability } from '@/features/tenants/api/decisionReasonsApi';
import { DecisionReasonsAvailabilityPatch } from '@/features/tenants/interfaces/decision-reasons-availability.interface';

export const useGetDecisionReasonsAvailability = (tenantId: string) => {
  return useQuery({
    queryKey: tenantsConstants.decisionReasonsKeys.detail(tenantId),
    queryFn: () => getDecisionReasonsAvailability(tenantId),
    enabled: !!tenantId,
  });
};

export const useUpdateDecisionReasonsAvailability = (tenantId: string) => {
  const queryClient = useQueryClient();
  const key = tenantsConstants.decisionReasonsKeys.detail(tenantId);
  return useMutation({
    mutationFn: (body: DecisionReasonsAvailabilityPatch) => updateDecisionReasonsAvailability(tenantId, body),
    onSuccess: data => {
      queryClient.setQueryData(key, data);
    },
  });
};
