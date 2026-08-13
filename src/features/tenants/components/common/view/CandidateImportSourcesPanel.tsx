'use client';

import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { TrashCan, Edit, Add } from '@carbon/icons-react';
import { Tenant } from '@/features/tenants/interfaces/tenant.interface';
import { CandidateProviderConfig } from '@/features/tenants/interfaces/candidate-provider.interface';
import { useUpdateTenant } from '@/features/tenants/hooks/useUpdateTenant';
import {
  useGetCandidateProviders,
  useCreateCandidateProvider,
  useUpdateCandidateProvider,
  useDeleteCandidateProvider,
} from '@/features/tenants/hooks/useCandidateProviders';

interface CandidateImportSourcesPanelProps {
  tenantId: string;
  tenant: Tenant;
}

function ProviderPresetCard({
  provider,
  onEdit,
  onDelete,
  onToggleDefault,
  deleting: deletingId,
}: {
  provider: CandidateProviderConfig;
  onEdit: (provider: CandidateProviderConfig) => void;
  onDelete: (id: string) => void;
  onToggleDefault: (id: string, isDefault: boolean) => void;
  deleting: string | null;
}) {
  const isDeleting = deletingId === provider.id;

  return (
    <Card variant="outlined" sx={{ mb: 1 }}>
      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle2" fontWeight={600}>{provider.name}</Typography>
            <Chip label={provider.provider_type} size="small" variant="outlined" sx={{ fontSize: '0.7rem', height: 20 }} />
            <Chip label={provider.auth_mode} size="small" variant="outlined" sx={{ fontSize: '0.7rem', height: 20 }} />
            {provider.is_default && <Chip label="Default" color="primary" size="small" sx={{ fontSize: '0.7rem', height: 20 }} />}
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <FormControlLabel
              control={
                <Switch
                  checked={provider.is_default}
                  onChange={(_, checked) => onToggleDefault(provider.id, checked)}
                  size="small"
                />
              }
              label={<Typography variant="body2">Default</Typography>}
              labelPlacement="start"
              sx={{ mr: 0.5 }}
            />
            <IconButton size="small" onClick={() => onEdit(provider)}>
              <Edit size={16} />
            </IconButton>
            <IconButton size="small" onClick={() => onDelete(provider.id)} disabled={isDeleting}>
              {isDeleting ? <CircularProgress size={16} /> : <TrashCan size={16} />}
            </IconButton>
          </Stack>
        </Stack>
        {provider.results_limit > 0 && (
          <Typography variant="caption" color="text.secondary">Max results: {provider.results_limit}</Typography>
        )}
      </CardContent>
    </Card>
  );
}

function PresetDialog({
  open,
  onClose,
  onSave,
  saving,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<CandidateProviderConfig>) => void;
  saving: boolean;
  initial?: CandidateProviderConfig | null;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [authMode, setAuthMode] = useState(initial?.auth_mode ?? 'manual');
  const [credentialsRef, setCredentialsRef] = useState(initial?.credentials_ref ?? '');
  const [resultsLimit, setResultsLimit] = useState(String(initial?.results_limit ?? 25));
  const [filterKeywords, setFilterKeywords] = useState(
    initial?.filters?.keywords ? (Array.isArray(initial.filters.keywords) ? initial.filters.keywords.join(', ') : initial.filters.keywords) : '',
  );
  const [filterLocations, setFilterLocations] = useState(
    initial?.filters?.locations ? (Array.isArray(initial.filters.locations) ? initial.filters.locations.join(', ') : initial.filters.locations) : '',
  );

  const parseList = (raw: string) => raw.split(/[\n,;]+/).map(s => s.trim()).filter(Boolean);

  const handleSave = () => {
    const filters: Record<string, any> = {};
    const kw = parseList(filterKeywords);
    if (kw.length) filters.keywords = kw;
    const loc = parseList(filterLocations);
    if (loc.length) filters.locations = loc;

    onSave({
      name: name.trim() || 'Untitled Preset',
      auth_mode: authMode,
      ...(authMode === 'api_key' && credentialsRef.trim() ? { credentials_ref: credentialsRef.trim() } : {}),
      results_limit: Math.max(1, Math.min(100, Number.parseInt(resultsLimit, 10) || 25)),
      filters,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initial ? 'Edit Preset' : 'New LinkedIn Search Preset'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Preset Name" value={name} onChange={e => setName(e.target.value)} size="small" fullWidth autoFocus />
          <FormControl size="small" fullWidth>
            <InputLabel>Search Mode</InputLabel>
            <Select value={authMode} label="Search Mode" onChange={e => setAuthMode(e.target.value)}>
              <MenuItem value="manual">Manual (paste profiles)</MenuItem>
              <MenuItem value="api_key">Automated (Bright Data API)</MenuItem>
            </Select>
          </FormControl>
          {authMode === 'api_key' && (
            <TextField
              label="Bright Data API Key"
              value={credentialsRef}
              onChange={e => setCredentialsRef(e.target.value)}
              size="small"
              fullWidth
              type="password"
              helperText="Bright Data bearer token for LinkedIn Profiles Scraper"
            />
          )}
          <TextField label="Results Limit" type="number" value={resultsLimit} onChange={e => setResultsLimit(e.target.value)} size="small" inputProps={{ min: 1, max: 100 }} />
          <TextField label="Keywords" value={filterKeywords} onChange={e => setFilterKeywords(e.target.value)} size="small" multiline rows={2} helperText="Comma separated" />
          <TextField label="Locations" value={filterLocations} onChange={e => setFilterLocations(e.target.value)} size="small" multiline rows={2} helperText="Comma separated" />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={saving || !name.trim()} startIcon={saving ? <CircularProgress size={14} /> : undefined}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export const CandidateImportSourcesPanel = ({ tenantId, tenant }: CandidateImportSourcesPanelProps) => {
  const updateTenant = useUpdateTenant();
  const { data: providers, isLoading: providersLoading } = useGetCandidateProviders(tenantId);
  const createMutation = useCreateCandidateProvider(tenantId);
  const updateMutation = useUpdateCandidateProvider(tenantId);
  const deleteMutation = useDeleteCandidateProvider(tenantId);

  const [error, setError] = useState<string | null>(null);
  const [linkedinToggling, setLinkedinToggling] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<CandidateProviderConfig | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const linkedinEnabled = tenant.candidate_import_sources?.enabled_sources?.includes('linkedin') ?? false;
  const presetsEnabled = tenant.provider_feature_flags?.candidate_provider_configs ?? false;

  const handleLinkedinToggle = async () => {
    setLinkedinToggling(true);
    setError(null);
    try {
      const currentSources = tenant.candidate_import_sources?.enabled_sources ?? [];
      const nextSources = linkedinEnabled
        ? currentSources.filter(s => s !== 'linkedin')
        : [...currentSources, 'linkedin'];
      await updateTenant.mutateAsync({
        id: tenantId,
        tenant: { candidate_import_sources: { enabled_sources: nextSources } },
      });
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? 'Failed to toggle LinkedIn');
    } finally {
      setLinkedinToggling(false);
    }
  };

  const handleCreatePreset = async (data: Partial<CandidateProviderConfig>) => {
    setSaving(true);
    setError(null);
    try {
      await createMutation.mutateAsync({
        ...data,
        provider_type: 'linkedin',
      });
      setDialogOpen(false);
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? 'Failed to create preset');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePreset = async (data: Partial<CandidateProviderConfig>) => {
    if (!editingProvider) return;
    setSaving(true);
    setError(null);
    try {
      await updateMutation.mutateAsync({ providerId: editingProvider.id, body: data });
      setEditingProvider(null);
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? 'Failed to update preset');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePreset = async (id: string) => {
    if (!window.confirm('Delete this search preset?')) return;
    setDeletingId(id);
    setError(null);
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? 'Failed to delete preset');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleDefault = async (id: string, isDefault: boolean) => {
    setError(null);
    try {
      await updateMutation.mutateAsync({ providerId: id, body: { is_default: isDefault } });
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? 'Failed to update preset');
    }
  };

  return (
    <Stack>
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>LinkedIn</Typography>
              <Typography variant="body2" color="text.secondary">Enable LinkedIn as candidate import source</Typography>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={linkedinEnabled}
                  onChange={handleLinkedinToggle}
                  disabled={linkedinToggling}
                />
              }
              label={linkedinToggling ? <CircularProgress size={16} /> : undefined}
              labelPlacement="start"
              sx={{ mr: 0 }}
            />
          </Stack>
        </CardContent>
      </Card>

      {error && <Alert severity="error" sx={{ mb: 1.5 }} onClose={() => setError(null)}>{error}</Alert>}

      {presetsEnabled && (
        <Box>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="subtitle2" fontWeight={600}>LinkedIn Search Presets</Typography>
            <Button size="small" variant="outlined" startIcon={<Add size={16} />} onClick={() => { setEditingProvider(null); setDialogOpen(true); }}>
              Add Preset
            </Button>
          </Stack>

          {providersLoading && (
            <Stack alignItems="center" sx={{ py: 2 }}>
              <CircularProgress size={20} />
            </Stack>
          )}

          {!providersLoading && providers && providers.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
              No search presets configured.
            </Typography>
          )}

          {!providersLoading && providers?.map(provider => (
            <ProviderPresetCard
              key={provider.id}
              provider={provider}
              onEdit={p => { setEditingProvider(p); setDialogOpen(true); }}
              onDelete={handleDeletePreset}
              onToggleDefault={handleToggleDefault}
              deleting={deletingId}
            />
          ))}
        </Box>
      )}

      {!presetsEnabled && (
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          Enable &quot;LinkedIn saved candidate searches&quot; in Provider Feature Flags to manage search presets.
        </Typography>
      )}

      <PresetDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditingProvider(null); }}
        onSave={editingProvider ? handleUpdatePreset : handleCreatePreset}
        saving={saving}
        initial={editingProvider}
      />
    </Stack>
  );
};
