'use client';

import { useState, useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { PageContainer } from '@/features/layout/components/page/PageContainer';
import PageHeader from '@/features/layout/components/page/PageHeader';
import { useGetProviderQuotaDefaults, useUpdateProviderQuotaDefaults } from '@/features/tenants/hooks/useProviderQuota';
import { ProviderQuotaDefaults } from '@/features/tenants/interfaces/provider-quota.interface';

function QuotaDefaultsForm({
  defaults,
  onSave,
  saving,
}: {
  defaults: ProviderQuotaDefaults;
  onSave: (values: Partial<ProviderQuotaDefaults>) => void;
  saving: boolean;
}) {
  const [maxDaily, setMaxDaily] = useState(String(defaults.max_daily_searches));
  const [maxResults, setMaxResults] = useState(String(defaults.max_results_per_search));
  const [monthlyBudget, setMonthlyBudget] = useState(
    defaults.monthly_credit_budget != null ? String(defaults.monthly_credit_budget) : '',
  );
  const [providersEnabled, setProvidersEnabled] = useState(defaults.providers_enabled);

  useEffect(() => {
    setMaxDaily(String(defaults.max_daily_searches));
    setMaxResults(String(defaults.max_results_per_search));
    setMonthlyBudget(defaults.monthly_credit_budget != null ? String(defaults.monthly_credit_budget) : '');
    setProvidersEnabled(defaults.providers_enabled);
  }, [defaults]);

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
              Providers enabled (default)
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Default provider kill-switch applied to tenants without an explicit override
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

      <Box>
        <Button
          variant="contained"
          size="small"
          onClick={handleSave}
          disabled={saving}
          startIcon={saving ? <CircularProgress size={14} /> : undefined}
        >
          {saving ? 'Saving…' : 'Save defaults'}
        </Button>
      </Box>

      {defaults.updated_at && (
        <Typography variant="caption" color="text.secondary">
          Last updated:{' '}
          {(() => {
            const parsed = new Date(defaults.updated_at!);
            return Number.isNaN(parsed.getTime()) ? defaults.updated_at : parsed.toLocaleString();
          })()}
          {defaults.updated_by ? ` by ${defaults.updated_by}` : ''}
        </Typography>
      )}
    </Stack>
  );
}

export default function ProviderQuotaDefaultsPage() {
  const { data: defaults, isLoading, isError } = useGetProviderQuotaDefaults();
  const updateMutation = useUpdateProviderQuotaDefaults();
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async (values: Partial<ProviderQuotaDefaults>) => {
    setSaveError(null);
    setSaveSuccess(false);
    try {
      await updateMutation.mutateAsync(values);
      setSaveSuccess(true);
    } catch (err: any) {
      setSaveError(err?.response?.data?.detail ?? 'Failed to save platform defaults');
    }
  };

  return (
    <PageContainer>
      <PageHeader titleKey="Default Provider Quotas" />

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        These are the platform-wide default quota ceilings applied to every tenant that does not have an explicit
        per-tenant override. Editing these values immediately affects all tenants on defaults.
      </Typography>

      {isLoading && (
        <Stack direction="row" alignItems="center" gap={1}>
          <CircularProgress size={20} />
          <Typography variant="body2" color="text.secondary">
            Loading defaults…
          </Typography>
        </Stack>
      )}

      {isError && !isLoading && (
        <Alert severity="error">Failed to load platform default quota settings.</Alert>
      )}

      {saveError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setSaveError(null)}>
          {saveError}
        </Alert>
      )}

      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSaveSuccess(false)}>
          Platform default quotas saved successfully.
        </Alert>
      )}

      {defaults && !isLoading && (
        <Paper variant="outlined" sx={{ p: 3, maxWidth: 720 }}>
          <QuotaDefaultsForm defaults={defaults} onSave={handleSave} saving={updateMutation.isPending} />
        </Paper>
      )}
    </PageContainer>
  );
}
