import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantsConstants } from '@/features/tenants/constants/tenants.constants';
import {
  getCandidateProviders,
  createCandidateProvider,
  updateCandidateProvider,
  deleteCandidateProvider,
} from '@/features/tenants/api/tenantsApi';
import { CandidateProviderConfig } from '@/features/tenants/interfaces/candidate-provider.interface';

export const useGetCandidateProviders = (tenantId: string) => {
  return useQuery({
    queryKey: tenantsConstants.candidateProviderKeys.list(tenantId),
    queryFn: () => getCandidateProviders(tenantId),
    enabled: !!tenantId,
  });
};

export const useCreateCandidateProvider = (tenantId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<CandidateProviderConfig>) => createCandidateProvider(tenantId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantsConstants.candidateProviderKeys.list(tenantId) });
    },
  });
};

export const useUpdateCandidateProvider = (tenantId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ providerId, body }: { providerId: string; body: Partial<CandidateProviderConfig> }) =>
      updateCandidateProvider(tenantId, providerId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantsConstants.candidateProviderKeys.list(tenantId) });
    },
  });
};

export const useDeleteCandidateProvider = (tenantId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (providerId: string) => deleteCandidateProvider(tenantId, providerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantsConstants.candidateProviderKeys.list(tenantId) });
    },
  });
};
