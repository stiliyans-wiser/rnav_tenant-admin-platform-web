import api from '@/features/auth/api/axiosConfig';
import { Tenant } from '@/features/tenants/interfaces/tenant.interface';
import { ProviderFeatureFlagAudit } from '@/features/tenants/interfaces/provider-feature-flags.interface';
import {
  ScoringTemplateListOut,
  ScoringTemplate,
  CreateScoringTemplateIn,
  UpdateScoringTemplateIn,
} from '@/features/tenants/interfaces/scoring-template.interface';
import { CandidateProviderConfig } from '@/features/tenants/interfaces/candidate-provider.interface';

const url = '/admin/accounts';

export const getTenants = async (): Promise<Tenant[]> => {
  const response = await api.get<Tenant[]>(url);
  return response.data;
};

export const getTenantById = async (id: string): Promise<Tenant> => {
  const response = await api.get<Tenant>(`${url}/${id}`);
  return response.data;
};

export const createTenant = async (tenant: Omit<Tenant, 'id'>): Promise<Tenant> => {
  const response = await api.post<Tenant>(url, tenant);
  return response.data;
};

export const updateTenant = async (id: string, tenant: Partial<Tenant>): Promise<Tenant> => {
  const response = await api.patch<Tenant>(`${url}/${id}`, tenant);
  return response.data;
};

export const getTenantProviderFeatureFlagAudit = async (id: string): Promise<ProviderFeatureFlagAudit[]> => {
  const response = await api.get<ProviderFeatureFlagAudit[]>(`${url}/${id}/provider-feature-flags/audit`);
  return response.data;
};

export const deleteTenant = async (id: string): Promise<void> => {
  await api.delete(`${url}/${id}`);
};

export const getScoringTemplates = async (tenantId: string): Promise<ScoringTemplateListOut> => {
  const response = await api.get<ScoringTemplateListOut>(`${url}/${tenantId}/scoring-templates`);
  return response.data;
};

export const getScoringTemplateCatalog = async (tenantId: string): Promise<ScoringTemplateListOut> => {
  const response = await api.get<ScoringTemplateListOut>(`${url}/${tenantId}/scoring-templates/catalog`);
  return response.data;
};

export const createScoringTemplate = async (tenantId: string, body: CreateScoringTemplateIn): Promise<ScoringTemplate> => {
  const response = await api.post<ScoringTemplate>(`${url}/${tenantId}/scoring-templates`, body);
  return response.data;
};

export const updateScoringTemplate = async (
  tenantId: string,
  templateId: string,
  body: UpdateScoringTemplateIn,
): Promise<ScoringTemplate> => {
  const response = await api.put<ScoringTemplate>(`${url}/${tenantId}/scoring-templates/${templateId}`, body);
  return response.data;
};

export const deleteScoringTemplate = async (tenantId: string, templateId: string): Promise<void> => {
  await api.delete(`${url}/${tenantId}/scoring-templates/${templateId}`);
};

// --- Candidate Provider APIs ---

export const getCandidateProviders = async (tenantId: string): Promise<CandidateProviderConfig[]> => {
  const response = await api.get<CandidateProviderConfig[]>(`${url}/${tenantId}/candidate-providers`);
  return response.data;
};

export const createCandidateProvider = async (
  tenantId: string,
  body: Partial<CandidateProviderConfig>,
): Promise<CandidateProviderConfig> => {
  const response = await api.post<CandidateProviderConfig>(`${url}/${tenantId}/candidate-providers`, body);
  return response.data;
};

export const updateCandidateProvider = async (
  tenantId: string,
  providerId: string,
  body: Partial<CandidateProviderConfig>,
): Promise<CandidateProviderConfig> => {
  const response = await api.patch<CandidateProviderConfig>(`${url}/${tenantId}/candidate-providers/${providerId}`, body);
  return response.data;
};

export const deleteCandidateProvider = async (tenantId: string, providerId: string): Promise<void> => {
  await api.delete(`${url}/${tenantId}/candidate-providers/${providerId}`);
};
