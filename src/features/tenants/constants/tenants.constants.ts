export const tenantsConstants = {
  tenantKeys: {
    all: ['tenants'] as const,
    lists: () => [...tenantsConstants.tenantKeys.all, 'list'] as const,
    list: (filters: string) => [...tenantsConstants.tenantKeys.lists(), { filters }] as const,
    details: () => [...tenantsConstants.tenantKeys.all, 'detail'] as const,
    detail: (id: string) => [...tenantsConstants.tenantKeys.details(), id] as const,
  },
  providerFeatureFlagAuditKeys: {
    all: ['provider-feature-flag-audit'] as const,
    list: (tenantId: string) => [...tenantsConstants.providerFeatureFlagAuditKeys.all, tenantId] as const,
  },
  matchingOntologyKeys: {
    all: ['matching-ontology'] as const,
    detail: (tenantId: string) => [...tenantsConstants.matchingOntologyKeys.all, tenantId] as const,
  },
  autoMatchAvailabilityKeys: {
    all: ['auto-match-availability'] as const,
    detail: (tenantId: string) => [...tenantsConstants.autoMatchAvailabilityKeys.all, tenantId] as const,
  },
  decisionReasonsKeys: {
    all: ['decision-reasons-availability'] as const,
    detail: (tenantId: string) => [...tenantsConstants.decisionReasonsKeys.all, tenantId] as const,
  },
  decisionReviewKeys: {
    all: ['decision-review'] as const,
    list: (tenantId: string, filters: unknown, page: number, pageSize: number) =>
      [...tenantsConstants.decisionReviewKeys.all, tenantId, 'list', filters, page, pageSize] as const,
    detail: (tenantId: string, eventId: string) => [...tenantsConstants.decisionReviewKeys.all, tenantId, 'detail', eventId] as const,
  },
  scoringTemplateKeys: {
    all: ['scoring-templates'] as const,
    list: (tenantId: string) => [...tenantsConstants.scoringTemplateKeys.all, tenantId] as const,
    catalog: (tenantId: string) => [...tenantsConstants.scoringTemplateKeys.all, 'catalog', tenantId] as const,
  },
  connectorKeys: {
    all: ['connectors'] as const,
    configs: (tenantId: string) => [...tenantsConstants.connectorKeys.all, 'configs', tenantId] as const,
    syncStatus: (tenantId: string) => [...tenantsConstants.connectorKeys.all, 'sync-status', tenantId] as const,
    syncSummary: (tenantId: string, source: string) =>
      [...tenantsConstants.connectorKeys.all, 'sync-summary', tenantId, source] as const,
    skipEvents: (tenantId: string, source: string) =>
      [...tenantsConstants.connectorKeys.all, 'skip-events', tenantId, source] as const,
    expiredCount: (tenantId: string, source: string) =>
      [...tenantsConstants.connectorKeys.all, 'expired-count', tenantId, source] as const,
    clientConfigs: (tenantId: string) => [...tenantsConstants.connectorKeys.all, 'client-configs', tenantId] as const,
  },
  candidateProviderKeys: {
    all: ['candidate-providers'] as const,
    list: (tenantId: string) => [...tenantsConstants.candidateProviderKeys.all, tenantId] as const,
  },
  providerQuotaDefaultKeys: {
    all: ['provider-quota-defaults'] as const,
    detail: () => [...tenantsConstants.providerQuotaDefaultKeys.all, 'detail'] as const,
  },
  tenantProviderQuotaKeys: {
    all: ['tenant-provider-quota'] as const,
    detail: (tenantId: string) => [...tenantsConstants.tenantProviderQuotaKeys.all, tenantId] as const,
  },
  tenantProviderUsageKeys: {
    all: ['tenant-provider-usage'] as const,
    detail: (tenantId: string) => [...tenantsConstants.tenantProviderUsageKeys.all, tenantId] as const,
  },
};
