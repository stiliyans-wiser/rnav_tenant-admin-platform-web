import { Alert, Chip, CircularProgress, Divider, Stack, Typography } from '@mui/material';
import {
  DEFAULT_PROVIDER_FEATURE_FLAGS,
  ProviderFeatureFlagAudit,
  ProviderFeatureFlags,
  providerFeatureFlagLabels,
} from '@/features/tenants/interfaces/provider-feature-flags.interface';

export interface ProviderFeatureFlagsData {
  company_name: string;
  provider_feature_flags: ProviderFeatureFlags;
  audit?: ProviderFeatureFlagAudit[];
  auditLoading?: boolean;
}

interface ProviderFeatureFlagsViewProps {
  data: ProviderFeatureFlagsData;
}

const flagKeys = Object.keys(DEFAULT_PROVIDER_FEATURE_FLAGS) as Array<keyof ProviderFeatureFlags>;

const formatDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString();
};

const formatValue = (value: boolean | undefined) => (value ? 'enabled' : 'disabled');

export const ProviderFeatureFlagsView = ({ data }: ProviderFeatureFlagsViewProps) => {
  const auditItems = data.audit ?? [];

  return (
    <Stack gap={3}>
      <Stack direction="row" flexWrap="wrap" gap={1}>
        {flagKeys.map(flag => {
          const enabled = Boolean(data.provider_feature_flags[flag]);
          return (
            <Chip
              key={flag}
              color={enabled ? 'success' : 'default'}
              label={`${providerFeatureFlagLabels[flag]}: ${enabled ? 'Enabled' : 'Disabled'}`}
              variant={enabled ? 'filled' : 'outlined'}
            />
          );
        })}
      </Stack>

      <Divider />

      <Stack gap={1.5}>
        <Typography variant="subtitle2">Recent audit</Typography>
        {data.auditLoading ? (
          <Stack direction="row" alignItems="center" gap={1}>
            <CircularProgress size={18} />
            <Typography variant="body2" color="text.secondary">
              Loading audit entries...
            </Typography>
          </Stack>
        ) : auditItems.length === 0 ? (
          <Alert severity="info">No provider feature flag changes recorded yet.</Alert>
        ) : (
          auditItems.slice(0, 5).map(item => (
            <Stack key={item.id} gap={0.75} sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 1.25 }}>
              <Typography variant="body2" fontWeight={600}>
                {formatDate(item.changed_at)} - {item.changed_by_name || item.changed_by_email || item.source}
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {item.changed_fields.map(field => {
                  const key = field as keyof ProviderFeatureFlags;
                  return (
                    <Chip
                      key={`${item.id}-${field}`}
                      size="small"
                      label={`${providerFeatureFlagLabels[key] ?? field}: ${formatValue(item.old_value[key])} -> ${formatValue(item.new_value[key])}`}
                      variant="outlined"
                    />
                  );
                })}
              </Stack>
            </Stack>
          ))
        )}
      </Stack>
    </Stack>
  );
};
