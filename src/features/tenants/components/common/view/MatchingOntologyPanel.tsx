'use client';

import { useEffect, useState } from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  MenuItem,
  Skeleton,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useGetMatchingOntology, useUpdateMatchingOntology } from '@/features/tenants/hooks/useMatchingOntology';
import {
  EmbeddingStoreVersion,
  EscoMode,
  FieldChange,
  MatchingOntologyForm,
  ValueSource,
} from '@/features/tenants/interfaces/matching-ontology.interface';
import {
  ESCO_MODE_LABEL,
  MAX_HOPS_MAX,
  MAX_HOPS_MIN,
  SwitchGroup,
  V2NotReady,
  buildPatch,
  describeChanges,
  errorMessage,
  formatCoverage,
  parseV2NotReady,
  toForm,
  validateForm,
} from '@/features/tenants/utils/matchingOntologyForm';

interface MatchingOntologyPanelProps {
  tenantId: string;
  tenantName: string;
}

interface PendingChange {
  group: SwitchGroup;
  force: boolean;
  changes: FieldChange[];
}

interface Toast {
  severity: 'success' | 'error';
  message: string;
}

const GROUP_LABEL: Record<SwitchGroup, string> = {
  skill_graph: 'skill graph',
  esco: 'aliases, language guard and ESCO',
  embedding_store: 'embedding store',
};

function SourceChip({ source }: { source: ValueSource }) {
  return (
    <Chip
      size="small"
      variant={source === 'stored' ? 'filled' : 'outlined'}
      color={source === 'stored' ? 'primary' : 'default'}
      label={source === 'stored' ? 'Stored' : 'Default'}
      sx={{ ml: 1, height: 20 }}
    />
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  disabled,
  source,
}: {
  label: string;
  source?: ValueSource;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <FormControlLabel
      sx={{ alignItems: 'flex-start', m: 0 }}
      control={
        <Switch checked={checked} onChange={(_, value) => onChange(value)} disabled={disabled} inputProps={{ 'aria-label': label }} />
      }
      label={
        <Stack sx={{ pt: 0.75 }}>
          <Typography variant="body2" fontWeight={600}>
            {label}
            {source && <SourceChip source={source} />}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {description}
          </Typography>
        </Stack>
      }
    />
  );
}

function ConfirmChangesDialog({
  pending,
  tenantName,
  busy,
  onCancel,
  onConfirm,
}: {
  pending: PendingChange | null;
  tenantName: string;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={!!pending} onClose={busy ? undefined : onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>
        {pending?.force ? 'Force embedding store change?' : `Apply ${pending ? GROUP_LABEL[pending.group] : ''} changes?`}
      </DialogTitle>
      <DialogContent>
        <Stack gap={1.5}>
          <Typography variant="body2">
            This changes matching behaviour for <strong>{tenantName}</strong> only.
          </Typography>
          {pending?.force && (
            <Alert severity="warning">
              The v2 store failed its readiness check. Forcing the switch makes similarity and shortlist reads use incomplete v2 data for
              this tenant and can degrade match quality until v2 is fully populated.
            </Alert>
          )}
          <Stack gap={0.5}>
            {pending?.changes.map(change => (
              <Typography key={change.label} variant="body2">
                <strong>{change.label}:</strong> {change.from} → {change.to}
              </Typography>
            ))}
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color={pending?.force ? 'error' : 'primary'}
          onClick={onConfirm}
          disabled={busy}
          startIcon={busy ? <CircularProgress size={14} /> : undefined}
        >
          {busy ? 'Applying…' : pending?.force ? 'Force switch to v2' : 'Apply'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export const MatchingOntologyPanel = ({ tenantId, tenantName }: MatchingOntologyPanelProps) => {
  const { data, isLoading, isError, error, refetch } = useGetMatchingOntology(tenantId);
  const updateMutation = useUpdateMatchingOntology(tenantId);

  const [form, setForm] = useState<MatchingOntologyForm | null>(null);
  const [pending, setPending] = useState<PendingChange | null>(null);
  const [notReady, setNotReady] = useState<V2NotReady | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    if (data) setForm(toForm(data));
  }, [data]);

  if (isLoading) {
    return (
      <Stack gap={1} aria-busy="true" aria-label="Loading matching ontology settings">
        <Skeleton variant="rounded" height={48} />
        <Skeleton variant="rounded" height={48} />
        <Skeleton variant="rounded" height={48} />
      </Stack>
    );
  }

  if (isError || !data || !form) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={() => refetch()}>
            Retry
          </Button>
        }
      >
        {errorMessage(error, 'Failed to load matching ontology settings.')}
      </Alert>
    );
  }

  const update = (patch: Partial<MatchingOntologyForm>) => setForm(prev => (prev ? { ...prev, ...patch } : prev));
  const errors = validateForm(form);
  const busy = updateMutation.isPending;
  const showsStoredListAsDefault = form.useDefaultHubs && data.sources.blocked_hubs === 'stored';

  const groupChanges = (group: SwitchGroup) => describeChanges(data, form, group);

  const requestApply = (group: SwitchGroup, force = false) => {
    const changes = groupChanges(group);
    if (changes.length) setPending({ group, force, changes });
  };

  const handleConfirm = async () => {
    if (!pending) return;
    const body = buildPatch(data, form, pending.group, pending.force);
    try {
      await updateMutation.mutateAsync(body);
      setPending(null);
      setNotReady(null);
      setToast({ severity: 'success', message: `Matching ontology updated for ${tenantName}` });
    } catch (err) {
      const v2 = pending.group === 'embedding_store' && !pending.force ? parseV2NotReady(err) : null;
      setPending(null);
      if (v2) {
        setNotReady(v2);
        return;
      }
      setToast({ severity: 'error', message: errorMessage(err, `Failed to update matching ontology for ${tenantName}`) });
    }
  };

  const cancelPending = () => {
    if (!busy) setPending(null);
  };

  const skillGraphDirty = groupChanges('skill_graph').length > 0;
  const escoDirty = groupChanges('esco').length > 0;
  const storeDirty = groupChanges('embedding_store').length > 0;
  const { diagnostics } = data;
  const coverage = diagnostics?.vector_coverage ?? null;

  return (
    <Stack gap={3}>
      <Box component="section" aria-labelledby="ontology-skill-graph">
        <Typography id="ontology-skill-graph" variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
          Skill graph
        </Typography>
        <Stack gap={2}>
          <ToggleRow
            label="Strict skill graph"
            source={data.sources.strict_enabled}
            description="On: credit only for specializations of the job skill or direct lateral neighbours. Off: legacy best-path credit (kill switch)."
            checked={form.strictEnabled}
            onChange={strictEnabled => update({ strictEnabled })}
            disabled={busy}
          />
          <TextField
            label="Max hops"
            type="number"
            size="small"
            value={form.maxHops}
            onChange={e => update({ maxHops: e.target.value })}
            error={!!errors.maxHops}
            helperText={
              errors.maxHops ??
              `Source: ${data.sources.max_hops}. Downward specialization hops that earn credit (${MAX_HOPS_MIN}-${MAX_HOPS_MAX}).`
            }
            inputProps={{ min: MAX_HOPS_MIN, max: MAX_HOPS_MAX, step: 1 }}
            sx={{ width: 220 }}
            disabled={busy}
          />
          <Stack gap={1}>
            <Stack direction="row" alignItems="center" gap={1}>
              <Typography variant="body2" fontWeight={600}>
                Blocked hubs
              </Typography>
              <SourceChip source={data.sources.blocked_hubs} />
            </Stack>
            <FormControlLabel
              control={
                <Switch
                  checked={form.useDefaultHubs}
                  onChange={(_, useDefaultHubs) =>
                    update({
                      useDefaultHubs,
                      blockedHubsText: form.blockedHubsText || data.blocked_hubs.join('\n'),
                    })
                  }
                  disabled={busy}
                />
              }
              label={<Typography variant="body2">Use built-in default hub list</Typography>}
            />
            <TextField
              label={form.useDefaultHubs ? 'Built-in default hubs (read-only)' : 'Custom blocked hubs'}
              multiline
              minRows={3}
              maxRows={10}
              size="small"
              value={showsStoredListAsDefault ? '' : form.blockedHubsText}
              placeholder={showsStoredListAsDefault ? 'The built-in list applies once you save' : undefined}
              onChange={e => update({ blockedHubsText: e.target.value })}
              error={!!errors.blockedHubs}
              helperText={errors.blockedHubs ?? 'One hub per line (or comma separated). Credit may not pass through these skills.'}
              disabled={busy || form.useDefaultHubs}
            />
          </Stack>
          <Box>
            <Button
              variant="contained"
              size="small"
              onClick={() => requestApply('skill_graph')}
              disabled={busy || !skillGraphDirty || !!errors.maxHops || !!errors.blockedHubs}
            >
              Save skill graph
            </Button>
          </Box>
        </Stack>
      </Box>

      <Divider />

      <Box component="section" aria-labelledby="ontology-aliases">
        <Typography id="ontology-aliases" variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
          Aliases, language guard and ESCO
        </Typography>
        <Stack gap={1.5}>
          <ToggleRow
            label="Static aliases"
            source={data.sources.static_aliases_enabled}
            description="Apply the static normalization alias files (skills, job titles, locations, languages). Off: behaviour of the image without those files."
            checked={form.staticAliasesEnabled}
            onChange={staticAliasesEnabled => update({ staticAliasesEnabled })}
            disabled={busy}
          />
          <ToggleRow
            label="Language guard"
            source={data.sources.language_guard_enabled}
            description="Guard language matching for this tenant."
            checked={form.languageGuardEnabled}
            onChange={languageGuardEnabled => update({ languageGuardEnabled })}
            disabled={busy}
          />
          <Stack gap={0.5}>
            <TextField
              select
              label="ESCO job-title scoring"
              size="small"
              value={form.escoMode}
              onChange={e => update({ escoMode: e.target.value as EscoMode })}
              helperText="Off: no ESCO work. Shadow: diagnostics only, scores unchanged. On: the ESCO occupation tier replaces the title-family penalty when both titles resolve (scores only, never drops candidates)."
              sx={{ width: 320 }}
              disabled={busy}
            >
              {(Object.keys(ESCO_MODE_LABEL) as EscoMode[]).map(mode => (
                <MenuItem key={mode} value={mode}>
                  {ESCO_MODE_LABEL[mode]}
                </MenuItem>
              ))}
            </TextField>
            <Box>
              <SourceChip source={data.sources.esco_mode} />
            </Box>
          </Stack>
          <Stack direction="row" alignItems="center" gap={1}>
            <Typography variant="body2" color="text.secondary">
              Global ESCO_ENABLED (platform setting, read-only):
            </Typography>
            <Chip
              size="small"
              label={data.esco_global_enabled ? 'On' : 'Off'}
              color={data.esco_global_enabled ? 'success' : 'default'}
              variant="outlined"
            />
          </Stack>
          {!data.esco_global_enabled && form.escoMode !== 'off' && (
            <Alert severity="info">
              Global ESCO is off, so ESCO job-title scoring has no effect for any tenant until it is enabled on the platform.
            </Alert>
          )}
          <Box>
            <Button variant="contained" size="small" onClick={() => requestApply('esco')} disabled={busy || !escoDirty}>
              Save aliases and ESCO
            </Button>
          </Box>
        </Stack>
      </Box>

      <Divider />

      <Box component="section" aria-labelledby="ontology-embeddings">
        <Typography id="ontology-embeddings" variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
          Embedding store
        </Typography>
        <Stack gap={2}>
          <Stack gap={0.5}>
            {(['candidates', 'jobs'] as const).map(table => (
              <Typography key={table} variant="body2" color="text.secondary">
                {table === 'candidates' ? 'Candidate' : 'Job'} vectors:{' '}
                <Box component="span" fontWeight={600} color="text.primary">
                  {formatCoverage(coverage?.[table], coverage?.tables_exist[table] ?? true)}
                </Box>
              </Typography>
            ))}
          </Stack>
          <TextField
            select
            label="Read store"
            size="small"
            value={form.storeVersion}
            onChange={e => {
              setNotReady(null);
              update({ storeVersion: e.target.value as EmbeddingStoreVersion });
            }}
            helperText="v1 = ada-002, v2 = text-embedding-3-large. Used by similarity, shortlist and force scoring."
            sx={{ width: 260 }}
            disabled={busy}
          >
            <MenuItem value="v1">v1 (ada-002)</MenuItem>
            <MenuItem value="v2">v2 (text-embedding-3-large)</MenuItem>
          </TextField>
          <ToggleRow
            label="Dual-write"
            source={data.sources.dual_write}
            description="Ingestion writes new rows to both stores while migrating."
            checked={form.dualWrite}
            onChange={dualWrite => update({ dualWrite })}
            disabled={busy}
          />
          {notReady && (
            <Alert
              severity="warning"
              action={
                <Button color="error" size="small" variant="outlined" onClick={() => requestApply('embedding_store', true)} disabled={busy}>
                  Force…
                </Button>
              }
            >
              <AlertTitle>{notReady.message}</AlertTitle>
              {notReady.problems.length > 0 && (
                <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                  {notReady.problems.map(problem => (
                    <li key={problem}>{problem}</li>
                  ))}
                </Box>
              )}
            </Alert>
          )}
          <Box>
            <Button variant="contained" size="small" onClick={() => requestApply('embedding_store')} disabled={busy || !storeDirty}>
              Save embedding store
            </Button>
          </Box>
        </Stack>
      </Box>

      <Divider />

      <Box component="section" aria-labelledby="ontology-diagnostics">
        <Typography id="ontology-diagnostics" variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
          Diagnostics (read-only)
        </Typography>
        {diagnostics?.error && (
          <Alert severity="warning" sx={{ mb: 1 }}>
            Diagnostics unavailable: {diagnostics.error}
          </Alert>
        )}
        <Typography variant="body2" color="text.secondary">
          Skill graph links:{' '}
          <Box component="span" fontWeight={600} color="text.primary">
            {diagnostics?.skill_relationship_count == null ? 'Not available' : diagnostics.skill_relationship_count.toLocaleString('en-US')}
          </Box>
        </Typography>
      </Box>

      <ConfirmChangesDialog pending={pending} tenantName={tenantName} busy={busy} onCancel={cancelPending} onConfirm={handleConfirm} />

      <Snackbar
        open={!!toast}
        autoHideDuration={toast?.severity === 'error' ? 8000 : 3000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {toast ? (
          <Alert severity={toast.severity} onClose={() => setToast(null)}>
            {toast.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Stack>
  );
};
