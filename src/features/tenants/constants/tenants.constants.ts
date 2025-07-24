export const tenantsConstants = {
  tenantKeys: {
    all: ['tenants'] as const,
    lists: () => [...tenantsConstants.tenantKeys.all, 'list'] as const,
    list: (filters: string) => [...tenantsConstants.tenantKeys.lists(), { filters }] as const,
    details: () => [...tenantsConstants.tenantKeys.all, 'detail'] as const,
    detail: (id: string) => [...tenantsConstants.tenantKeys.details(), id] as const,
  },
  documentGroupKeys: {
    all: ['document-groups'] as const,
    lists: () => [...tenantsConstants.documentGroupKeys.all, 'list'] as const,
    list: (accountId: string) => [...tenantsConstants.documentGroupKeys.lists(), accountId] as const,
  },
};
