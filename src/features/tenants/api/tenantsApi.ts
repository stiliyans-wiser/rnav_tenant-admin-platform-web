import api from '@/features/auth/api/axiosConfig';
import { Tenant } from '@/features/tenants/interfaces/tenant.interface';
import { ProviderFeatureFlagAudit } from '@/features/tenants/interfaces/provider-feature-flags.interface';
import {
  ScoringTemplateListOut,
  ScoringTemplate,
  CreateScoringTemplateIn,
  UpdateScoringTemplateIn,
} from '@/features/tenants/interfaces/scoring-template.interface';

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

// --- Connector Config APIs ---

import {
  ConnectorConfig,
  ConnectorConfigUpdate,
  SyncRecord,
  SyncSummary,
  SkipEventsResponse,
  CrawlerClientConfig,
} from '@/features/tenants/interfaces/connector-config.interface';
import { CandidateProviderConfig } from '@/features/tenants/interfaces/candidate-provider.interface';

export const getConnectorConfigs = async (tenantId: string): Promise<ConnectorConfig[]> => {
  const response = await api.get<ConnectorConfig[]>(`${url}/${tenantId}/connector-configs`);
  return response.data;
};

export const updateConnectorConfig = async (
  tenantId: string,
  source: string,
  body: ConnectorConfigUpdate,
): Promise<ConnectorConfig> => {
  const response = await api.patch<ConnectorConfig>(`${url}/${tenantId}/connector-configs/${source}`, body);
  return response.data;
};

export const triggerConnectorRun = async (
  tenantId: string,
  source: string,
  params?: Record<string, string>,
): Promise<any> => {
  const qs = params ? `?${new URLSearchParams(params).toString()}` : '';
  const response = await api.post(`${url}/${tenantId}/connector-run/${source}${qs}`);
  return response.data;
};

export const getConnectorSyncStatus = async (tenantId: string): Promise<SyncRecord[]> => {
  const response = await api.get<SyncRecord[]>(`${url}/${tenantId}/connector-sync-status`);
  return response.data;
};

export const getConnectorSyncSummary = async (tenantId: string, source: string): Promise<SyncSummary> => {
  const response = await api.get<SyncSummary>(`${url}/${tenantId}/connector-sync-summary/${source}`);
  return response.data;
};

export const getConnectorSkipEvents = async (
  tenantId: string,
  source: string,
  params: Record<string, string>,
): Promise<SkipEventsResponse> => {
  const response = await api.get<SkipEventsResponse>(
    `${url}/${tenantId}/connector-skip-events/${source}?${new URLSearchParams(params).toString()}`,
  );
  return response.data;
};

export const getConnectorExpiredCount = async (tenantId: string, source: string): Promise<{ count: number }> => {
  const response = await api.get<{ count: number }>(`${url}/${tenantId}/connector-expired-count/${source}`);
  return response.data;
};

export const cleanupConnectorExpired = async (tenantId: string, source: string): Promise<any> => {
  const response = await api.post(`${url}/${tenantId}/connector-cleanup-expired/${source}`);
  return response.data;
};

// --- Crawler Client Config APIs (pre-existing admin endpoints) ---

export const getCrawlerClientConfigs = async (tenantId: string): Promise<CrawlerClientConfig[]> => {
  const response = await api.get<CrawlerClientConfig[]>(`${url}/${tenantId}/connectors`);
  return response.data;
};

export const updateCrawlerClientConfig = async (
  tenantId: string,
  source: string,
  body: Partial<CrawlerClientConfig>,
): Promise<CrawlerClientConfig> => {
  const response = await api.patch<CrawlerClientConfig>(`${url}/${tenantId}/connectors/${source}`, body);
  return response.data;
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
