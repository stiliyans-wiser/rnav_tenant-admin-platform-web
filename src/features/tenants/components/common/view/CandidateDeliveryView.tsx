import { Chip, IconButton, Stack, Typography } from '@mui/material';
import { CheckmarkFilled, Misuse } from '@carbon/icons-react';
import { MatchConfig } from '@/features/tenants/interfaces/match-config.interface';
import { ReportConfig, DEFAULT_REPORT_CONFIG } from '@/features/tenants/interfaces/report-config.interface';

export interface CandidateDeliveryData {
  company_name: string;
  match_config?: MatchConfig;
  report_config?: ReportConfig;
}

interface CandidateDeliveryViewProps {
  data: CandidateDeliveryData;
}

const BoolIcon = ({ value }: { value: boolean }) =>
  value ? (
    <IconButton color="primary" sx={{ p: 0 }}>
      <CheckmarkFilled />
    </IconButton>
  ) : (
    <IconButton color="error" sx={{ p: 0 }}>
      <Misuse />
    </IconButton>
  );

const CADENCE_LABELS: Record<number, string> = {
  0: 'Disabled',
  6: 'Every 6 hours',
  12: 'Every 12 hours',
  24: 'Daily',
  48: 'Every 2 days',
  72: 'Every 3 days',
};

export const CandidateDeliveryView = ({ data }: CandidateDeliveryViewProps) => {
  const mc: MatchConfig = data.match_config ?? ({} as MatchConfig);
  const rc = data.report_config ?? DEFAULT_REPORT_CONFIG;

  return (
    <Stack gap={3}>
      <Stack gap={1}>
        <Typography variant="caption" color="text.secondary">
          Shortlist &amp; Limits
        </Typography>
        <Stack direction="row" gap={3}>
          <Stack gap={1} sx={{ flex: 1 }}>
            <Typography variant="caption">Default Shortlist Size</Typography>
            <Typography variant="subtitle2">{mc.shortlist_default_size ?? 3}</Typography>
          </Stack>
          <Stack gap={1} sx={{ flex: 1 }}>
            <Typography variant="caption">Max Candidates Per Position</Typography>
            <Typography variant="subtitle2">{mc.candidate_limit_per_job ?? 20}</Typography>
          </Stack>
          <Stack gap={1} sx={{ flex: 1 }}>
            <Typography variant="caption">Delivery Review Threshold</Typography>
            <Typography variant="subtitle2">{mc.delivery_review_threshold ?? 90}%</Typography>
          </Stack>
        </Stack>
      </Stack>

      <Stack gap={1}>
        <Typography variant="caption" color="text.secondary">
          Freshness Scoring
        </Typography>
        <Stack direction="row" gap={3}>
          <Stack gap={1} sx={{ flex: 1 }}>
            <Typography variant="caption">Enabled</Typography>
            <Typography variant="subtitle2">
              <BoolIcon value={mc.freshness_bonus_enabled ?? false} />
            </Typography>
          </Stack>
          <Stack gap={1} sx={{ flex: 1 }}>
            <Typography variant="caption">Bonus Points</Typography>
            <Typography variant="subtitle2">{mc.freshness_bonus_points ?? 5}</Typography>
          </Stack>
          <Stack gap={1} sx={{ flex: 1 }}>
            <Typography variant="caption">Window</Typography>
            <Typography variant="subtitle2">{mc.freshness_window_days ?? 90} days</Typography>
          </Stack>
        </Stack>
      </Stack>

      <Stack gap={1}>
        <Typography variant="caption" color="text.secondary">
          Matching Schedule
        </Typography>
        <Typography variant="subtitle2">
          {CADENCE_LABELS[mc.matching_cadence_hours ?? 24] ?? `${mc.matching_cadence_hours}h`}
        </Typography>
      </Stack>

      <Stack gap={1}>
        <Typography variant="caption" color="text.secondary">
          Report Delivery
        </Typography>
        <Stack direction="row" gap={3}>
          <Stack gap={1} sx={{ flex: 1 }}>
            <Typography variant="caption">Automated Reports</Typography>
            <Typography variant="subtitle2">
              <BoolIcon value={rc.report_cadence_enabled ?? false} />
            </Typography>
          </Stack>
          <Stack gap={1} sx={{ flex: 1 }}>
            <Typography variant="caption">Reports / Period</Typography>
            <Typography variant="subtitle2">{rc.report_count ?? 3}</Typography>
          </Stack>
          <Stack gap={1} sx={{ flex: 1 }}>
            <Typography variant="caption">Period (days)</Typography>
            <Typography variant="subtitle2">{rc.report_period_days ?? 14}</Typography>
          </Stack>
        </Stack>
        {(rc.notification_recipients ?? []).length > 0 && (
          <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mt: 1 }}>
            {(rc.notification_recipients ?? []).map(r => (
              <Chip key={r} label={r} size="small" />
            ))}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};
