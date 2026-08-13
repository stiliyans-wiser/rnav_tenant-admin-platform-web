'use client';

import { useState } from 'react';
import {
  Alert,
  Card,
  CardContent,
  CircularProgress,
  FormControlLabel,
  Stack,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { CrawlerClientConfig } from '@/features/tenants/interfaces/connector-config.interface';
import {
  useGetCrawlerClientConfigs,
  useUpdateCrawlerClientConfig,
} from '@/features/tenants/hooks/useConnectorConfigs';

const SOURCE_LABELS: Record<string, string> = {
  hcltech: 'HCLTech',
  a1: 'A1 Bulgaria',
  kpmg: 'KPMG',
  jobs_bg: 'jobs.bg',
};

const SOURCES = ['hcltech', 'a1', 'kpmg', 'jobs_bg'];

type CrawlerClientStatus = 'watched' | 'potential';

function ClientSourceCard({
  source,
  config,
  onStatusChange,
  onTogglePlatform,
  saving,
}: {
  source: string;
  config: CrawlerClientConfig | undefined;
  onStatusChange: (source: string, status: CrawlerClientStatus) => void;
  onTogglePlatform: (source: string, enabled: boolean) => void;
  saving: boolean;
}) {
  const currentStatus = (config?.client_status as CrawlerClientStatus) ?? 'potential';
  const platformEnabled = config?.platform_enabled ?? false;

  return (
    <Card variant="outlined" sx={{ mb: 1.5 }}>
      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle2" fontWeight={600} sx={{ minWidth: 120 }}>
            {SOURCE_LABELS[source] ?? source}
          </Typography>

          <Stack direction="row" alignItems="center" spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={platformEnabled}
                  onChange={(_, checked) => onTogglePlatform(source, checked)}
                  size="small"
                  disabled={saving}
                />
              }
              label={<Typography variant="body2">Platform Enabled</Typography>}
              labelPlacement="start"
              sx={{ mr: 2 }}
            />

            <ToggleButtonGroup
              value={currentStatus}
              exclusive
              size="small"
              onChange={(_, value) => {
                if (value) onStatusChange(source, value as CrawlerClientStatus);
              }}
              disabled={saving}
            >
              <ToggleButton value="watched" sx={{ px: 2, textTransform: 'none' }}>
                Watched
              </ToggleButton>
              <ToggleButton value="potential" sx={{ px: 2, textTransform: 'none' }}>
                Potential
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

interface CrawlerSettingsPanelProps {
  tenantId: string;
}

export const CrawlerSettingsPanel = ({ tenantId }: CrawlerSettingsPanelProps) => {
  const { data: configs, isLoading, isError } = useGetCrawlerClientConfigs(tenantId);
  const updateMutation = useUpdateCrawlerClientConfig(tenantId);
  const [savingSource, setSavingSource] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = async (source: string, status: CrawlerClientStatus) => {
    setSavingSource(source);
    setError(null);
    try {
      await updateMutation.mutateAsync({ source, body: { client_status: status } });
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? `Failed to update ${source}`);
    } finally {
      setSavingSource(null);
    }
  };

  const handleTogglePlatform = async (source: string, enabled: boolean) => {
    setSavingSource(source);
    setError(null);
    try {
      await updateMutation.mutateAsync({ source, body: { platform_enabled: enabled } });
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? `Failed to update ${source}`);
    } finally {
      setSavingSource(null);
    }
  };

  if (isLoading) {
    return (
      <Stack alignItems="center" sx={{ py: 4 }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (isError) {
    return <Alert severity="error">Failed to load client pipeline configs.</Alert>;
  }

  return (
    <Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        Configure crawler client status per source. Watched sources are actively monitored; potential sources are available but not tracked.
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 1.5 }} onClose={() => setError(null)}>{error}</Alert>}
      {SOURCES.map(source => (
        <ClientSourceCard
          key={source}
          source={source}
          config={configs?.find(c => c.source === source)}
          onStatusChange={handleStatusChange}
          onTogglePlatform={handleTogglePlatform}
          saving={savingSource === source}
        />
      ))}
    </Stack>
  );
};
