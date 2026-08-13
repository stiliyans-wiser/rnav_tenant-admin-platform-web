import { IconButton, Stack, Typography } from '@mui/material';
import { CheckmarkFilled, Misuse } from '@carbon/icons-react';
import { MatchConfig } from '@/features/tenants/interfaces/match-config.interface';

export interface MatchingControlsData {
  company_name: string;
  match_config?: MatchConfig;
}

interface MatchingControlsViewProps {
  data: MatchingControlsData;
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

export const MatchingControlsView = ({ data }: MatchingControlsViewProps) => {
  const cfg = data.match_config;

  return (
    <Stack gap={4}>
      <Typography variant="overline" color="text.secondary">
        Scoring Weights
      </Typography>

      <Stack direction="row" gap={3}>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Programmatic</Typography>
          <Typography variant="subtitle2">{cfg?.programmatic_weight?.toFixed(2) ?? '0.40'}</Typography>
        </Stack>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">LLM Semantic</Typography>
          <Typography variant="subtitle2">{cfg?.llm_semantic_weight?.toFixed(2) ?? '0.40'}</Typography>
        </Stack>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Embedding</Typography>
          <Typography variant="subtitle2">{cfg?.embedding_similarity_weight?.toFixed(2) ?? '0.20'}</Typography>
        </Stack>
      </Stack>

      <Typography variant="overline" color="text.secondary">
        Pipeline Settings
      </Typography>

      <Stack direction="row" gap={3}>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">top_k</Typography>
          <Typography variant="subtitle2">{cfg?.top_k ?? 10}</Typography>
        </Stack>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Score threshold</Typography>
          <Typography variant="subtitle2">{cfg?.score_threshold ?? 0}</Typography>
        </Stack>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Screening threshold</Typography>
          <Typography variant="subtitle2">{cfg?.screening_threshold ?? 40}</Typography>
        </Stack>
      </Stack>

      <Stack direction="row" gap={3}>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Screening model</Typography>
          <Typography variant="subtitle2">{cfg?.screening_model ?? 'gpt-4.1-mini'}</Typography>
        </Stack>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Deep model</Typography>
          <Typography variant="subtitle2">{cfg?.deep_model ?? 'gpt-4.1'}</Typography>
        </Stack>
      </Stack>

      <Typography variant="overline" color="text.secondary">
        Automation
      </Typography>

      <Stack direction="row" gap={3}>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Auto-match on job ingest</Typography>
          <Typography variant="subtitle2">
            <BoolIcon value={Boolean(cfg?.auto_match_on_job_ingest)} />
          </Typography>
        </Stack>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Auto-match on candidate ingest</Typography>
          <Typography variant="subtitle2">
            <BoolIcon value={Boolean(cfg?.auto_match_on_candidate_ingest)} />
          </Typography>
        </Stack>
      </Stack>

      <Stack direction="row" gap={3}>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Calibration mode</Typography>
          <Typography variant="subtitle2">
            <BoolIcon value={Boolean(cfg?.calibration_mode)} />
          </Typography>
        </Stack>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Calibration top_k multiplier</Typography>
          <Typography variant="subtitle2">{cfg?.calibration_top_k_multiplier ?? 3}</Typography>
        </Stack>
      </Stack>

      <Typography variant="overline" color="text.secondary">
        Screening Filters
      </Typography>

      <Stack direction="row" gap={3} flexWrap="wrap">
        {[
          { label: 'Seniority', val: cfg?.filter_seniority },
          { label: 'Min experience', val: cfg?.filter_min_experience },
          { label: 'Location', val: cfg?.filter_location },
          { label: 'Industry', val: cfg?.filter_industry },
          { label: 'Mandatory skills', val: cfg?.filter_mandatory_skills },
          { label: 'Tech ancestry', val: cfg?.filter_technology_ancestry },
          { label: 'Embedding similarity', val: cfg?.filter_embedding_similarity },
          { label: 'Career trajectory', val: cfg?.filter_career_trajectory },
          { label: 'Company DNA', val: cfg?.filter_company_dna },
        ].map(f => (
          <Stack key={f.label} gap={0.5} sx={{ minWidth: 140 }}>
            <Typography variant="caption">{f.label}</Typography>
            <BoolIcon value={Boolean(f.val)} />
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};
