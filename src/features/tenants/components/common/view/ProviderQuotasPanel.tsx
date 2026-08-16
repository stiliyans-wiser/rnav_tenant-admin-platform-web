'use client';

import { useState, useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { TenantProviderQuota, TenantProviderUsage } from '@/features/tenants/interfaces/provider-quota.interface';
import {
  useGetTenantProviderQuota,
  useUpdateTenantProviderQuota,
  useDeleteTenantProviderQuota,
  useGetTenantProviderUsage,
} from '@/features/tenants/hooks/useProviderQuota';

interface ProviderQuotasPanelProps {
  tenantId: string;
}

const formatDate = (value: string | null | undefined): string => {
  if (!value) return '—';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString();
};

function QuotaForm({
  quota,
  onSave,
  saving,
  onReset,
  resetting,
}: {
  quota: TenantProviderQuota;
  onSave: (values: Partial<TenantProviderQuota>) => void;
  saving: boolean;
  onReset: () => void;
  resetting: boolean;
}) {
  const [maxDaily, setMaxDaily] = useState(String(quota.max_daily_searches));
  const [maxResults, setMaxResults] = useState(String(quota.max_results_per_search));
  const [monthlyBudget, setMonthlyBudget] = useState(quota.monthly_credit_budget != null ? String(quota.monthly_credit_budget) : '');
  const [providersEnabled, setProvidersEnabled] = useState(quota.providers_enabled);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  useEffect(() => {
    setMaxDaily(String(quota.max_daily_searches));
    setMaxResults(String(quota.max_results_per_search));
    setMonthlyBudget(quota.monthly_credit_budget != null ? String(quota.monthly_credit_budget) : '');
    setProvidersEnabled(quota.providers_enabled);
  }, [quota]);

  const handleSave = () => {
    const budget = monthlyBudget.trim() === '' ? null : Math.max(1, Number.parseInt(monthlyBudget, 10) || 0);
    onSave({
      max_daily_searches: Math.max(1, Number.parseInt(maxDaily, 10) || 50),
      max_results_per_search: Math.max(1, Number.parseInt(maxResults, 10) || 25),
      monthly_credit_budget: budget,
      providers_enabled: providersEnabled,
    });
  };

  return (
    <>
      <Stack gap={2}>
        <FormControlLabel
          control={
            <Switch
              checked={providersEnabled}
              onChange={(_, checked) => setProvidersEnabled(checked)}
              disabled={saving}
            />
          }
          label={
            <Stack>
              <Typography variant="body2" fontWeight={600}>
                Providers enabled
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Kill-switch — disabling blocks all provider searches for this tenant (returns 403)
              </Typography>
            </Stack>
          }
        />

        <Stack direction="row" gap={2} flexWrap="wrap">
          <TextField
            label="Max daily searches"
            type="number"
            value={maxDaily}
            onChange={e => setMaxDaily(e.target.value)}
            size="small"
            inputProps={{ min: 1 }}
            sx={{ width: 180 }}
            disabled={saving}
          />
          <TextField
            label="Max results per search"
            type="number"
            value={maxResults}
            onChange={e => setMaxResults(e.target.value)}
            size="small"
            inputProps={{ min: 1 }}
            sx={{ width: 200 }}
            disabled={saving}
          />
          <TextField
            label="Monthly credit budget"
            type="number"
            value={monthlyBudget}
            onChange={e => setMonthlyBudget(e.target.value)}
            size="small"
            inputProps={{ min: 1 }}
            helperText="Leave blank for unlimited"
            sx={{ width: 220 }}
            disabled={saving}
          />
        </Stack>

        <Stack direction="row" gap={1} alignItems="center">
          <Button
            variant="contained"
            size="small"
            onClick={handleSave}
            disabled={saving || resetting}
            startIcon={saving ? <CircularProgress size={14} /> : undefined}
          >
            {saving ? 'Saving…' : 'Save'}
          </Button>

          {quota.source === 'override' && (
            <Button
              variant="outlined"
              size="small"
              color="warning"
              onClick={() => setConfirmResetOpen(true)}
              disabled={saving || resetting}
              startIcon={resetting ? <CircularProgress size={14} /> : undefined}
            >
              {resetting ? 'Resetting…' : 'Reset to defaults'}
            </Button>
          )}
        </Stack>

        {quota.updated_at && (
          <Typography variant="caption" color="text.secondary">
            Last updated: {formatDate(quota.updated_at)}
            {quota.updated_by ? ` by ${quota.updated_by}` : ''}
          </Typography>
        )}
      </Stack>

      <Dialog open={confirmResetOpen} onClose={() => setConfirmResetOpen(false)}>
        <DialogTitle>Reset to platform defaults?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            This will remove the per-tenant override. The tenant will use the platform default quotas going forward.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setConfirmResetOpen(false)} disabled={resetting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => {
              setConfirmResetOpen(false);
              onReset();
            }}
            disabled={resetting}
          >
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function UsageTable({ usage }: { usage: TenantProviderUsage }) {
  const { providers, monthly_results_total } = usage;

  if (providers.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
        No provider usage recorded yet.
      </Typography>
    );
  }

  return (
    <Stack gap={1.5}>
      <Typography variant="body2" color="text.secondary">
        Total results fetched this month:{' '}
        <Box component="span" fontWeight={600} color="text.primary">
          {monthly_results_total.toLocaleString()}
        </Box>
      </Typography>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Provider</TableCell>
              <TableCell align="right">Searches today</TableCell>
              <TableCell align="right">Searches this month</TableCell>
              <TableCell align="right">Results this month</TableCell>
              <TableCell align="right">Quota rejections (429)</TableCell>
              <TableCell>Last error</TableCell>
              <TableCell>Last run</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {providers.map(row => (
              <TableRow key={row.provider_config_id}>
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {row.provider_name}
                  </Typography>
                </TableCell>
                <TableCell align="right">{row.searches_today}</TableCell>
                <TableCell align="right">{row.searches_this_month}</TableCell>
                <TableCell align="right">{row.results_this_month}</TableCell>
                <TableCell align="right">
                  {row.quota_rejections_this_month > 0 ? (
                    <Chip label={row.quota_rejections_this_month} size="small" color="error" variant="outlined" />
                  ) : (
                    row.quota_rejections_this_month
                  )}
                </TableCell>
                <TableCell>
                  {row.last_error ? (
                    <Typography variant="caption" color="error.main" sx={{ maxWidth: 240, display: 'block', wordBreak: 'break-word' }}>
                      {row.last_error}
                    </Typography>
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      —
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(row.last_run_at)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}

export const ProviderQuotasPanel = ({ tenantId }: ProviderQuotasPanelProps) => {
  const [saveError, setSaveError] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);

  const { data: quota, isLoading: quotaLoading, isError: quotaError } = useGetTenantProviderQuota(tenantId);
  const { data: usage, isLoading: usageLoading } = useGetTenantProviderUsage(tenantId);
  const updateMutation = useUpdateTenantProviderQuota(tenantId);
  const deleteMutation = useDeleteTenantProviderQuota(tenantId);

  const handleSave = async (values: Partial<TenantProviderQuota>) => {
    setSaveError(null);
    try {
      await updateMutation.mutateAsync(values);
    } catch (err: any) {
      setSaveError(err?.response?.data?.detail ?? 'Failed to save quota settings');
    }
  };

  const handleReset = async () => {
    setResetError(null);
    try {
      await deleteMutation.mutateAsync();
    } catch (err: any) {
      setResetError(err?.response?.data?.detail ?? 'Failed to reset to defaults');
    }
  };

  return (
    <Stack gap={3}>
      <Box>
        <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            Quota ceilings
          </Typography>
          {quota && (
            <Chip
              label={quota.source === 'override' ? 'Overridden' : 'On platform defaults'}
              size="small"
              color={quota.source === 'override' ? 'primary' : 'default'}
              variant={quota.source === 'override' ? 'filled' : 'outlined'}
            />
          )}
        </Stack>

        {quotaLoading && (
          <Stack direction="row" alignItems="center" gap={1}>
            <CircularProgress size={18} />
            <Typography variant="body2" color="text.secondary">
              Loading quota settings…
            </Typography>
          </Stack>
        )}

        {quotaError && !quotaLoading && (
          <Alert severity="error">Failed to load quota settings.</Alert>
        )}

        {saveError && (
          <Alert severity="error" sx={{ mb: 1.5 }} onClose={() => setSaveError(null)}>
            {saveError}
          </Alert>
        )}

        {resetError && (
          <Alert severity="error" sx={{ mb: 1.5 }} onClose={() => setResetError(null)}>
            {resetError}
          </Alert>
        )}

        {quota && !quotaLoading && (
          <QuotaForm
            quota={quota}
            onSave={handleSave}
            saving={updateMutation.isPending}
            onReset={handleReset}
            resetting={deleteMutation.isPending}
          />
        )}
      </Box>

      <Box>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
          Provider usage (read-only)
        </Typography>

        {usageLoading && (
          <Stack direction="row" alignItems="center" gap={1}>
            <CircularProgress size={18} />
            <Typography variant="body2" color="text.secondary">
              Loading usage data…
            </Typography>
          </Stack>
        )}

        {!usageLoading && usage && <UsageTable usage={usage} />}
      </Box>
    </Stack>
  );
};
