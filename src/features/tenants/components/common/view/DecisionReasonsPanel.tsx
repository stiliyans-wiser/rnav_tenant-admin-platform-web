'use client';

import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { useGetDecisionReasonsAvailability, useUpdateDecisionReasonsAvailability } from '@/features/tenants/hooks/useDecisionReasonsAvailability';
import {
  RESET_CONFIRM_TEXT,
  RESET_CONFIRM_TITLE,
  runAvailabilityToggle,
  runConfirmedReset,
  schemaNotReadyMessage,
} from '@/features/tenants/utils/decisionReasonsAvailability';

interface DecisionReasonsPanelProps {
  tenantId: string;
}

type Notice = { severity: 'success' | 'error'; text: string };

export const DecisionReasonsPanel = ({ tenantId }: DecisionReasonsPanelProps) => {
  const { data, isLoading, isError } = useGetDecisionReasonsAvailability(tenantId);
  const update = useUpdateDecisionReasonsAvailability(tenantId);
  const [available, setAvailable] = useState(false);
  const [pendingAvailable, setPendingAvailable] = useState<boolean | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    if (data) setAvailable(data.available);
  }, [data]);

  const confirmToggle = async () => {
    if (pendingAvailable === null) return;
    const next = pendingAvailable;
    setPendingAvailable(null);
    setSaving(true);
    const result = await runAvailabilityToggle({
      previous: available,
      next,
      apply: setAvailable,
      request: async value => (await update.mutateAsync({ available: value })).available,
    });
    setSaving(false);
    if (result.ok) return;
    setNotice({
      severity: 'error',
      text: result.schemaNotReady ? schemaNotReadyMessage(result.schemaNotReady) : 'Could not save. The previous value was restored.',
    });
  };

  const confirmReset = async () => {
    setResetOpen(false);
    setSaving(true);
    const result = await runConfirmedReset(true, () => update.mutateAsync({ reset_reasons: true }));
    setSaving(false);
    setNotice(
      result === 'done'
        ? { severity: 'success', text: "Reason list reset to platform defaults for this tenant." }
        : { severity: 'error', text: 'Could not reset the reason list.' },
    );
  };

  if (isLoading) return <CircularProgress size={20} />;

  return (
    <Stack gap={3}>
      <Stack gap={0.5}>
        <Stack direction="row" alignItems="center" gap={1}>
          <Switch
            checked={available}
            disabled={isError || saving}
            onChange={(_, value) => setPendingAvailable(value)}
            inputProps={{ 'aria-label': 'Decision reasons available' }}
          />
          <Typography variant="caption">Decision reasons available</Typography>
        </Stack>
        <Typography variant="caption" color="text.secondary">
          Lets this tenant's admin use decision reasons when excluding, holding or dropping candidates. Off = the tenant can't use them.
        </Typography>
        {isError && (
          <Typography variant="caption" color="error">
            Could not load the current value.
          </Typography>
        )}
      </Stack>

      {data && (
        <Stack direction="row" gap={3} flexWrap="wrap">
          <Stack gap={0.5}>
            <Typography variant="caption">Tenant setting (read-only)</Typography>
            <Chip size="small" color={data.enabled ? 'success' : 'default'} label={data.enabled ? 'Tenant: on' : 'Tenant: off'} />
          </Stack>
          <Stack gap={0.5}>
            <Typography variant="caption">Effective</Typography>
            <Chip size="small" color={data.active ? 'success' : 'default'} label={data.active ? 'Active' : 'Not active'} />
          </Stack>
          <Stack gap={0.5}>
            <Typography variant="caption">Reasons in list</Typography>
            <Typography variant="subtitle2">{data.reason_count}</Typography>
          </Stack>
          <Stack gap={0.5}>
            <Typography variant="caption">Database schema</Typography>
            <Chip size="small" color={data.schema_healthy ? 'success' : 'error'} label={data.schema_healthy ? 'Ready' : 'Not ready'} />
          </Stack>
        </Stack>
      )}

      {data && !data.schema_healthy && (
        <Alert severity="warning">{schemaNotReadyMessage({ missingColumns: data.schema_missing_columns })}</Alert>
      )}

      <Stack alignItems="flex-start">
        <Button variant="outlined" color="warning" disabled={!data || saving} onClick={() => setResetOpen(true)}>
          Reset to platform defaults
        </Button>
      </Stack>

      <Dialog open={pendingAvailable !== null} onClose={() => setPendingAvailable(null)}>
        <DialogTitle>{pendingAvailable ? 'Make decision reasons available?' : 'Make decision reasons unavailable?'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {pendingAvailable
              ? "This tenant's admin will be able to turn on decision reasons and edit the reason list."
              : "Recruiters of this tenant will no longer be asked for a reason, even if its admin switched decision reasons on."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setPendingAvailable(null)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={confirmToggle}>
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={resetOpen} onClose={() => setResetOpen(false)}>
        <DialogTitle>{RESET_CONFIRM_TITLE}</DialogTitle>
        <DialogContent>
          <DialogContentText>{RESET_CONFIRM_TEXT}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setResetOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" color="warning" onClick={confirmReset}>
            Replace reason list
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={notice !== null} autoHideDuration={8000} onClose={() => setNotice(null)}>
        <Alert severity={notice?.severity ?? 'error'} onClose={() => setNotice(null)}>
          {notice?.text}
        </Alert>
      </Snackbar>
    </Stack>
  );
};
