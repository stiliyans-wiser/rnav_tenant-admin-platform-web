import { Chip, IconButton, Stack, Typography } from '@mui/material';
import { CheckmarkFilled, Misuse } from '@carbon/icons-react';
import { TalentAutomationConfig } from '@/features/tenants/interfaces/talent-automation-config.interface';

export interface TalentAutomationData {
  company_name: string;
  talent_automation_config?: TalentAutomationConfig;
}

interface TalentAutomationViewProps {
  data: TalentAutomationData;
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

export const TalentAutomationView = ({ data }: TalentAutomationViewProps) => {
  const cfg = data.talent_automation_config;

  return (
    <Stack gap={4}>
      <Typography variant="overline" color="text.secondary">
        Modules
      </Typography>

      <Stack direction="row" gap={3}>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">M1 — Instant Screening</Typography>
          <Typography variant="subtitle2">
            <BoolIcon value={Boolean(cfg?.screening_enabled)} />
          </Typography>
        </Stack>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">M2 — Profile Enrichment</Typography>
          <Typography variant="subtitle2">
            <BoolIcon value={Boolean(cfg?.enrichment_enabled)} />
          </Typography>
        </Stack>
      </Stack>

      <Stack direction="row" gap={3}>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">M3 — Cross-role Reroute</Typography>
          <Typography variant="subtitle2">
            <BoolIcon value={Boolean(cfg?.reroute_enabled)} />
          </Typography>
        </Stack>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">M4 — Interview Preparation</Typography>
          <Typography variant="subtitle2">
            <BoolIcon value={Boolean(cfg?.interview_prep_enabled)} />
          </Typography>
        </Stack>
      </Stack>

      <Typography variant="overline" color="text.secondary">
        HITL Policy
      </Typography>

      <Stack direction="row" gap={3}>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Confidence threshold</Typography>
          <Typography variant="subtitle2">{cfg?.confidence_threshold ?? 70}%</Typography>
        </Stack>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Screening SLA</Typography>
          <Typography variant="subtitle2">{cfg?.screening_sla_seconds ?? 300}s</Typography>
        </Stack>
      </Stack>

      <Stack direction="row" gap={3}>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Require approval for rejections</Typography>
          <Typography variant="subtitle2">
            <BoolIcon value={cfg?.hitl_required_for_rejection ?? true} />
          </Typography>
        </Stack>
      </Stack>

      <Typography variant="overline" color="text.secondary">
        Enrichment Fields
      </Typography>

      <Stack direction="row" spacing={1} flexWrap="wrap">
        {(cfg?.enrichment_questions ?? []).length > 0 ? (
          cfg!.enrichment_questions!.map(q => <Chip key={q} label={q} size="small" />)
        ) : (
          <Typography variant="body2" color="text.secondary">
            No enrichment fields configured
          </Typography>
        )}
      </Stack>

      <Typography variant="overline" color="text.secondary">
        M3 + M4 Settings
      </Typography>

      <Stack direction="row" gap={3}>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Max reroute suggestions</Typography>
          <Typography variant="subtitle2">{cfg?.max_reroute_suggestions ?? 3}</Typography>
        </Stack>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Interview questions per candidate</Typography>
          <Typography variant="subtitle2">{cfg?.interview_prep_question_count ?? 5}</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};
