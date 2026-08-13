import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantsConstants } from '@/features/tenants/constants/tenants.constants';
import {
  getScoringTemplates,
  getScoringTemplateCatalog,
  createScoringTemplate,
  updateScoringTemplate,
  deleteScoringTemplate,
} from '@/features/tenants/api/tenantsApi';
import { CreateScoringTemplateIn, UpdateScoringTemplateIn } from '@/features/tenants/interfaces/scoring-template.interface';

export const useGetScoringTemplates = (tenantId: string) => {
  return useQuery({
    queryKey: tenantsConstants.scoringTemplateKeys.list(tenantId),
    queryFn: () => getScoringTemplates(tenantId),
    enabled: !!tenantId,
  });
};

export const useGetScoringTemplateCatalog = (tenantId: string) => {
  return useQuery({
    queryKey: tenantsConstants.scoringTemplateKeys.catalog(tenantId),
    queryFn: () => getScoringTemplateCatalog(tenantId),
    enabled: !!tenantId,
  });
};

export const useCreateScoringTemplate = (tenantId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateScoringTemplateIn) => createScoringTemplate(tenantId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantsConstants.scoringTemplateKeys.list(tenantId) });
      queryClient.invalidateQueries({ queryKey: tenantsConstants.tenantKeys.detail(tenantId) });
    },
  });
};

export const useUpdateScoringTemplate = (tenantId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ templateId, body }: { templateId: string; body: UpdateScoringTemplateIn }) =>
      updateScoringTemplate(tenantId, templateId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantsConstants.scoringTemplateKeys.list(tenantId) });
      queryClient.invalidateQueries({ queryKey: tenantsConstants.tenantKeys.detail(tenantId) });
    },
  });
};

export const useDeleteScoringTemplate = (tenantId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (templateId: string) => deleteScoringTemplate(tenantId, templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantsConstants.scoringTemplateKeys.list(tenantId) });
      queryClient.invalidateQueries({ queryKey: tenantsConstants.tenantKeys.detail(tenantId) });
    },
  });
};
