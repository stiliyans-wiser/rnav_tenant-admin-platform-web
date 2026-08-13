import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantsConstants } from '@/features/tenants/constants/tenants.constants';
import {
  getConnectorConfigs,
  updateConnectorConfig,
  triggerConnectorRun,
  getConnectorSyncStatus,
  getConnectorSyncSummary,
  getConnectorSkipEvents,
  getConnectorExpiredCount,
  cleanupConnectorExpired,
  getCrawlerClientConfigs,
  updateCrawlerClientConfig,
} from '@/features/tenants/api/tenantsApi';
import { ConnectorConfigUpdate, CrawlerClientConfig } from '@/features/tenants/interfaces/connector-config.interface';

export const useGetConnectorConfigs = (tenantId: string) => {
  return useQuery({
    queryKey: tenantsConstants.connectorKeys.configs(tenantId),
    queryFn: () => getConnectorConfigs(tenantId),
    enabled: !!tenantId,
  });
};

export const useUpdateConnectorConfig = (tenantId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ source, body }: { source: string; body: ConnectorConfigUpdate }) =>
      updateConnectorConfig(tenantId, source, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantsConstants.connectorKeys.configs(tenantId) });
    },
  });
};

export const useTriggerConnectorRun = (tenantId: string) => {
  return useMutation({
    mutationFn: ({ source, params }: { source: string; params?: Record<string, string> }) =>
      triggerConnectorRun(tenantId, source, params),
  });
};

export const useGetConnectorSyncStatus = (tenantId: string, refetchInterval?: number) => {
  return useQuery({
    queryKey: tenantsConstants.connectorKeys.syncStatus(tenantId),
    queryFn: () => getConnectorSyncStatus(tenantId),
    enabled: !!tenantId,
    refetchInterval,
  });
};

export const useGetConnectorSyncSummary = (tenantId: string, source: string, enabled = true) => {
  return useQuery({
    queryKey: tenantsConstants.connectorKeys.syncSummary(tenantId, source),
    queryFn: () => getConnectorSyncSummary(tenantId, source),
    enabled: !!tenantId && !!source && enabled,
  });
};

export const useGetConnectorSkipEvents = (
  tenantId: string,
  source: string,
  params: Record<string, string>,
  enabled = true,
) => {
  return useQuery({
    queryKey: [...tenantsConstants.connectorKeys.skipEvents(tenantId, source), params],
    queryFn: () => getConnectorSkipEvents(tenantId, source, params),
    enabled: !!tenantId && !!source && enabled,
  });
};

export const useGetConnectorExpiredCount = (tenantId: string, source: string) => {
  return useQuery({
    queryKey: tenantsConstants.connectorKeys.expiredCount(tenantId, source),
    queryFn: () => getConnectorExpiredCount(tenantId, source),
    enabled: !!tenantId && !!source,
  });
};

export const useCleanupConnectorExpired = (tenantId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (source: string) => cleanupConnectorExpired(tenantId, source),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantsConstants.connectorKeys.all });
    },
  });
};

export const useGetCrawlerClientConfigs = (tenantId: string) => {
  return useQuery({
    queryKey: tenantsConstants.connectorKeys.clientConfigs(tenantId),
    queryFn: () => getCrawlerClientConfigs(tenantId),
    enabled: !!tenantId,
  });
};

export const useUpdateCrawlerClientConfig = (tenantId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ source, body }: { source: string; body: Partial<CrawlerClientConfig> }) =>
      updateCrawlerClientConfig(tenantId, source, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantsConstants.connectorKeys.clientConfigs(tenantId) });
    },
  });
};
