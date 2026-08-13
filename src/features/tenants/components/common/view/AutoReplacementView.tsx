import { IconButton, Stack, Typography } from '@mui/material';
import { CheckmarkFilled, Misuse } from '@carbon/icons-react';
import { AutoReplacementConfig, DEFAULT_AUTO_REPLACEMENT_CONFIG } from '@/features/tenants/interfaces/auto-replacement-config.interface';

export interface AutoReplacementData {
  company_name: string;
  auto_replacement_config?: AutoReplacementConfig;
}

interface AutoReplacementViewProps {
  data: AutoReplacementData;
}

export const AutoReplacementView = ({ data }: AutoReplacementViewProps) => {
  const config = data.auto_replacement_config ?? DEFAULT_AUTO_REPLACEMENT_CONFIG;

  return (
    <Stack gap={4}>
      <Stack direction="row" gap={3}>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Enabled</Typography>
          <Typography variant="subtitle2">
            {config.enabled ? (
              <IconButton color="primary" sx={{ p: 0 }}>
                <CheckmarkFilled />
              </IconButton>
            ) : (
              <IconButton color="error" sx={{ p: 0 }}>
                <Misuse />
              </IconButton>
            )}
          </Typography>
        </Stack>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Min Replacement Pool</Typography>
          <Typography variant="subtitle2">{config.min_pool_threshold}</Typography>
        </Stack>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Rematch Cooldown (s)</Typography>
          <Typography variant="subtitle2">{config.debounce_window_seconds}</Typography>
        </Stack>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Max Suggestions</Typography>
          <Typography variant="subtitle2">{config.max_replacement_suggestions}</Typography>
        </Stack>
      </Stack>
      <Typography variant="body2" color="text.secondary">
        {config.enabled
          ? 'Automatically suggests replacement candidates when a candidate is dropped, hired, or declined.'
          : 'Auto-replacement is disabled. Candidate status changes will not trigger replacement suggestions.'}
      </Typography>
    </Stack>
  );
};
