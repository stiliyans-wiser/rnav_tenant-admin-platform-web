import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Snackbar,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { CheckmarkFilled, Misuse } from '@carbon/icons-react';
import { updateAutoMatchAvailability } from '@/features/tenants/api/autoMatchAvailabilityApi';
import { useGetAutoMatchAvailability } from '@/features/tenants/hooks/useAutoMatchAvailability';
import { runOptimisticToggle } from '@/features/tenants/utils/optimisticToggle';
import { LANGUAGE_MODE_LABELS, LANGUAGE_SETTING_DEFAULTS } from '@/features/tenants/constants/form.constants';
import { MatchConfig } from '@/features/tenants/interfaces/match-config.interface';

export interface MatchingControlsData {
  company_name: string;
  match_config?: MatchConfig;
}

interface MatchingControlsViewProps {
  data: MatchingControlsData;
  tenantId: string;
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

const modeLabel = (mode: string) => LANGUAGE_MODE_LABELS[mode as keyof typeof LANGUAGE_MODE_LABELS] ?? mode;

export const MatchingControlsView = ({ data, tenantId }: MatchingControlsViewProps) => {
  const cfg = data.match_config;
  const { data: availability, isLoading, isError } = useGetAutoMatchAvailability(tenantId);
  const [available, setAvailable] = useState(false);
  const [pending, setPending] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);

  useEffect(() => {
    if (availability) setAvailable(availability.available);
  }, [availability]);

  const confirmToggle = async () => {
    if (pending === null) return;
    const next = pending;
    setPending(null);
    setSaving(true);
    const ok = await runOptimisticToggle({
      previous: available,
      next,
      apply: setAvailable,
      request: async value => (await updateAutoMatchAvailability(tenantId, value)).available,
    });
    setSaving(false);
    setSaveFailed(!ok);
  };

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
        Language requirements
      </Typography>

      <Stack direction="row" gap={3}>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Rule mode</Typography>
          <Typography variant="subtitle2">{modeLabel(cfg?.language_rule_mode ?? LANGUAGE_SETTING_DEFAULTS.language_rule_mode)}</Typography>
        </Stack>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Recall mode</Typography>
          <Typography variant="subtitle2">{modeLabel(cfg?.language_recall_mode ?? LANGUAGE_SETTING_DEFAULTS.language_recall_mode)}</Typography>
        </Stack>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Recall pool size</Typography>
          <Typography variant="subtitle2">{cfg?.language_recall_pool_size ?? LANGUAGE_SETTING_DEFAULTS.language_recall_pool_size}</Typography>
        </Stack>
      </Stack>

      <Stack direction="row" gap={3}>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Reserved slots / language</Typography>
          <Typography variant="subtitle2">{cfg?.language_reserved_slots_per_language ?? LANGUAGE_SETTING_DEFAULTS.language_reserved_slots_per_language}</Typography>
        </Stack>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Reserved slots total</Typography>
          <Typography variant="subtitle2">{cfg?.language_reserved_slots_total ?? LANGUAGE_SETTING_DEFAULTS.language_reserved_slots_total}</Typography>
        </Stack>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Gate cap</Typography>
          <Typography variant="subtitle2">{cfg?.language_gate_score_cap ?? LANGUAGE_SETTING_DEFAULTS.language_gate_score_cap}</Typography>
        </Stack>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Recall min similarity</Typography>
          <Typography variant="subtitle2">{cfg?.language_recall_min_similarity ?? LANGUAGE_SETTING_DEFAULTS.language_recall_min_similarity}</Typography>
        </Stack>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Recall max gap (cosine)</Typography>
          <Typography variant="subtitle2">{cfg?.language_recall_max_gap_cosine ?? LANGUAGE_SETTING_DEFAULTS.language_recall_max_gap_cosine}</Typography>
        </Stack>
      </Stack>

      <Stack gap={0.5}>
        <Stack direction="row" alignItems="center" gap={1}>
          <Switch
            checked={available}
            disabled={isLoading || isError || saving}
            onChange={(_, value) => setPending(value)}
            inputProps={{ 'aria-label': 'Auto-match on job edit' }}
          />
          <Typography variant="caption">Auto-match on job edit</Typography>
        </Stack>
        <Typography variant="caption" color="text.secondary">
          Lets this tenant's admin turn on automatic matching after a job edit. Off = the tenant can't use it.
        </Typography>
        {isError && (
          <Typography variant="caption" color="error">
            Could not load the current value.
          </Typography>
        )}
      </Stack>

      <Dialog open={pending !== null} onClose={() => setPending(null)}>
        <DialogTitle>{pending ? 'Make auto-match on job edit available?' : 'Make auto-match on job edit unavailable?'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {pending
              ? "This tenant's admin will be able to turn on automatic matching after a job edit."
              : 'This tenant can no longer use automatic matching after a job edit, even if its admin switched it on.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setPending(null)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={confirmToggle}>
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={saveFailed} autoHideDuration={6000} onClose={() => setSaveFailed(false)}>
        <Alert severity="error" onClose={() => setSaveFailed(false)}>
          Could not save. The previous value was restored.
        </Alert>
      </Snackbar>

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
