'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Link,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { ChevronDown } from '@carbon/icons-react';
import { ConnectorConfig, SyncRecord, SyncSummary, SkipEventsResponse } from '@/features/tenants/interfaces/connector-config.interface';
import {
  useGetConnectorConfigs,
  useUpdateConnectorConfig,
  useTriggerConnectorRun,
  useGetConnectorSyncStatus,
} from '@/features/tenants/hooks/useConnectorConfigs';
import {
  getConnectorSyncSummary,
  getConnectorSkipEvents,
  getConnectorExpiredCount,
  cleanupConnectorExpired,
} from '@/features/tenants/api/tenantsApi';

const SOURCE_LABELS: Record<string, string> = {
  hcltech: 'HCLTech',
  a1: 'A1 Bulgaria',
  kpmg: 'KPMG',
  jobs_bg: 'jobs.bg',
};

const SOURCES = ['hcltech', 'a1', 'kpmg', 'jobs_bg'];

const SCHEDULE_OPTIONS: { label: string; value: string | null }[] = [
  { label: 'Disabled', value: null },
  { label: 'Every 15 min', value: '15min' },
  { label: 'Every 30 min', value: '30min' },
  { label: 'Hourly', value: '1h' },
  { label: 'Every 3h', value: '3h' },
  { label: 'Every 6h', value: '6h' },
  { label: 'Daily', value: '24h' },
  { label: 'Weekly', value: '1w' },
];

const SKIP_REASON_LABELS: Record<string, string> = {
  expired_page: 'Expired Page',
  no_title: 'No Title',
  weak_content: 'Weak Content',
  fetch_error: 'Fetch Error',
  non_bulgaria_location: 'Outside Bulgaria',
};

const DIAGNOSTIC_LABELS: Record<string, string> = {
  payloads_fetched: 'Payloads',
  raw_records_extracted: 'Raw records',
  source_urls_discovered: 'Source URLs',
  eligible_before_filters: 'Eligible before filters',
  post_date_filter: 'After date filter',
  post_filter: 'After filters',
  post_content_validation: 'After content validation',
  final_transformed: 'Ready for ingest',
  invalid_records: 'Invalid records',
  country_filtered: 'Country filtered',
  sync_mode: 'Sync mode',
  eligible_new_count: 'Eligible new',
  skipped_before_watermark: 'Skipped (before watermark)',
  skipped_missing_source_date: 'Skipped (no source date)',
  limit_applied: 'Limit applied',
};

const IMPORTANT_DIAGNOSTICS = [
  'payloads_fetched',
  'raw_records_extracted',
  'source_urls_discovered',
  'eligible_before_filters',
  'post_date_filter',
  'post_filter',
  'post_content_validation',
  'final_transformed',
  'invalid_records',
  'country_filtered',
  'sync_mode',
  'eligible_new_count',
  'skipped_before_watermark',
  'skipped_missing_source_date',
  'limit_applied',
];

function formatDateTime(value: string | null | undefined): string {
  if (!value) return 'Never';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function formatDiagnosticLabel(key: string): string {
  return DIAGNOSTIC_LABELS[key] ?? key.replace(/_/g, ' ');
}

type SortField = 'skip_count' | 'last_seen_at';
type SortOrder = 'asc' | 'desc';

function SyncHealthSection({ tenantId, source, syncRecord }: { tenantId: string; source: string; syncRecord: SyncRecord | undefined }) {
  const [expanded, setExpanded] = useState(false);
  const [summary, setSummary] = useState<SyncSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [skipEvents, setSkipEvents] = useState<SkipEventsResponse | null>(null);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [reasonFilter, setReasonFilter] = useState('');
  const [sortBy, setSortBy] = useState<SortField>('last_seen_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const fetchSummary = useCallback(async () => {
    setSummaryLoading(true);
    setSummaryError(null);
    try {
      const data = await getConnectorSyncSummary(tenantId, source);
      setSummary(data);
    } catch {
      setSummaryError('Failed to load sync summary');
    } finally {
      setSummaryLoading(false);
    }
  }, [tenantId, source]);

  const fetchSkipEvents = useCallback(async () => {
    setEventsLoading(true);
    setEventsError(null);
    try {
      const params: Record<string, string> = {
        page: String(page + 1),
        page_size: String(pageSize),
        sort_by: sortBy,
        sort_order: sortOrder,
      };
      if (reasonFilter) params.reason = reasonFilter;
      const data = await getConnectorSkipEvents(tenantId, source, params);
      setSkipEvents(data);
    } catch {
      setEventsError('Failed to load skip events');
    } finally {
      setEventsLoading(false);
    }
  }, [tenantId, source, page, sortBy, sortOrder, reasonFilter]);

  useEffect(() => {
    if (!expanded) return;
    fetchSummary();
  }, [expanded, syncRecord?.last_sync_date, fetchSummary]);

  useEffect(() => {
    if (!expanded) return;
    fetchSkipEvents();
  }, [expanded, page, sortBy, sortOrder, reasonFilter, fetchSkipEvents]);

  const handleSortChange = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setPage(0);
  };

  const availableReasons = summary ? Object.keys(summary.skip_reasons) : [];
  const diagnostics = summary?.diagnostics ?? summary?.last_sync.diagnostics ?? {};
  const diagnosticEntries = IMPORTANT_DIAGNOSTICS.filter(
    key => diagnostics[key] !== undefined && diagnostics[key] !== null && diagnostics[key] !== '',
  ).map(key => [key, diagnostics[key]] as const);

  return (
    <Accordion
      expanded={expanded}
      onChange={(_, isExpanded) => setExpanded(isExpanded)}
      variant="outlined"
      disableGutters
      sx={{ mt: 1.5, '&:before': { display: 'none' } }}
    >
      <AccordionSummary expandIcon={<ChevronDown size={20} />}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="body2" fontWeight={600}>
            Sync Health
          </Typography>
          {summary && summary.total_skipped > 0 && (
            <Chip label={`${summary.total_skipped} skipped`} color="warning" size="small" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
          )}
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        {summaryLoading && !summary && (
          <Stack spacing={1}>
            <Skeleton variant="rectangular" height={32} />
            <Skeleton variant="rectangular" height={24} width="60%" />
          </Stack>
        )}

        {summaryError && <Alert severity="error" sx={{ mb: 1 }}>{summaryError}</Alert>}

        {summary && (
          <Box>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
              <Chip label={`${summary.total_jobs} INGESTED`} color="success" size="small" />
              <Chip label={`${summary.total_skipped} SKIPPED`} color="warning" size="small" />
              <Chip label={`${summary.last_sync.fetched} TOTAL FETCHED`} size="small" variant="outlined" />
            </Stack>

            {diagnosticEntries.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                  Last run pipeline counts
                </Typography>
                <Stack direction="row" spacing={0.5} flexWrap="wrap">
                  {diagnosticEntries.map(([key, value]) => (
                    <Chip key={key} label={`${formatDiagnosticLabel(key)}: ${value}`} size="small" variant="outlined" sx={{ fontSize: '0.7rem', height: 20, mb: 0.5 }} />
                  ))}
                </Stack>
              </Box>
            )}

            {Object.keys(summary.skip_reasons).length > 0 && (
              <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ mb: 2 }}>
                {Object.entries(summary.skip_reasons).map(([reason, count]) => (
                  <Chip key={reason} label={`${count} ${SKIP_REASON_LABELS[reason] ?? reason}`} size="small" variant="outlined" sx={{ fontSize: '0.7rem', height: 20, mb: 0.5 }} />
                ))}
              </Stack>
            )}

            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Filter by reason:</Typography>
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <Select value={reasonFilter} onChange={e => { setReasonFilter(e.target.value); setPage(0); }} displayEmpty>
                  <MenuItem value="">All reasons</MenuItem>
                  {availableReasons.map(reason => (
                    <MenuItem key={reason} value={reason}>{SKIP_REASON_LABELS[reason] ?? reason}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            {eventsError && <Alert severity="error" sx={{ mb: 1 }}>{eventsError}</Alert>}

            <TableContainer>
              <Table size="small" sx={{ tableLayout: 'fixed' }}>
                <colgroup>
                  <col style={{ width: '30%' }} />
                  <col style={{ width: '25%' }} />
                  <col style={{ width: '20%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '13%' }} />
                </colgroup>
                <TableHead>
                  <TableRow>
                    <TableCell>Source URL</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell sortDirection={sortBy === 'skip_count' ? sortOrder : false}>
                      <TableSortLabel active={sortBy === 'skip_count'} direction={sortBy === 'skip_count' ? sortOrder : 'desc'} onClick={() => handleSortChange('skip_count')}>
                        Skip Count
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sortDirection={sortBy === 'last_seen_at' ? sortOrder : false}>
                      <TableSortLabel active={sortBy === 'last_seen_at'} direction={sortBy === 'last_seen_at' ? sortOrder : 'desc'} onClick={() => handleSortChange('last_seen_at')}>
                        Last Seen
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {eventsLoading && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3 }}><CircularProgress size={20} /></TableCell>
                    </TableRow>
                  )}
                  {!eventsLoading && skipEvents && skipEvents.items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                        <Typography variant="body2" color="text.secondary">No skip events found</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {!eventsLoading && skipEvents?.items.map(event => (
                    <TableRow key={`${event.source_job_id}-${event.skip_reason}`}>
                      <TableCell sx={{ maxWidth: 240 }}>
                        <Link href={event.source_url} target="_blank" rel="noopener noreferrer" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 240, fontSize: '0.8rem' }}>
                          {event.source_url}
                        </Link>
                      </TableCell>
                      <TableCell><Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{event.title_from_slug ?? '—'}</Typography></TableCell>
                      <TableCell><Chip label={SKIP_REASON_LABELS[event.skip_reason] ?? event.skip_reason} size="small" variant="outlined" sx={{ fontSize: '0.7rem', height: 20 }} /></TableCell>
                      <TableCell align="center"><Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{event.skip_count}</Typography></TableCell>
                      <TableCell><Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{formatDateTime(event.last_seen_at)}</Typography></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {skipEvents && skipEvents.total > pageSize && (
              <TablePagination component="div" count={skipEvents.total} page={page} onPageChange={(_, newPage) => setPage(newPage)} rowsPerPage={pageSize} rowsPerPageOptions={[pageSize]} />
            )}
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
}

function ProviderCard({
  tenantId,
  source,
  config,
  syncRecord,
  onConfigUpdated,
  onSyncUpdated,
}: {
  tenantId: string;
  source: string;
  config: ConnectorConfig | undefined;
  syncRecord: SyncRecord | undefined;
  onConfigUpdated: () => void;
  onSyncUpdated: () => void;
}) {
  const updateConfigMutation = useUpdateConnectorConfig(tenantId);
  const runMutation = useTriggerConnectorRun(tenantId);

  const [runningMode, setRunningMode] = useState<'full' | 'recent' | null>(null);
  const [cleaningUp, setCleaningUp] = useState(false);
  const [expiredCount, setExpiredCount] = useState<number | null>(null);
  const [patchError, setPatchError] = useState<string | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [runWarning, setRunWarning] = useState<string | null>(null);
  const [jobsLimitPerRunInput, setJobsLimitPerRunInput] = useState('');
  const [importWeeksInput, setImportWeeksInput] = useState('2');
  const [countriesInput, setCountriesInput] = useState('');
  const [partnerChannelsInput, setPartnerChannelsInput] = useState('');
  const [allowSitemapFallback, setAllowSitemapFallback] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchExpiredCount = useCallback(async () => {
    try {
      const data = await getConnectorExpiredCount(tenantId, source);
      setExpiredCount(data.count);
    } catch { /* ignore */ }
  }, [tenantId, source]);

  useEffect(() => { fetchExpiredCount(); }, [fetchExpiredCount, syncRecord?.last_sync_date]);

  useEffect(() => {
    const configuredLimit = config?.settings?.jobs_limit_per_run ?? config?.settings?.initial_jobs_to_acquire;
    setJobsLimitPerRunInput(configuredLimit == null ? '' : String(configuredLimit));
  }, [config?.settings?.jobs_limit_per_run, config?.settings?.initial_jobs_to_acquire]);

  useEffect(() => {
    const c = config?.settings?.countries;
    if (Array.isArray(c)) setCountriesInput(c.join(', '));
    else if (typeof c === 'string') setCountriesInput(c);
    else setCountriesInput('');
  }, [config?.settings?.countries]);

  useEffect(() => {
    const p = config?.settings?.partner_channel_ids;
    if (Array.isArray(p)) setPartnerChannelsInput(p.join(', '));
    else if (typeof p === 'string') setPartnerChannelsInput(p);
    else setPartnerChannelsInput('');
  }, [config?.settings?.partner_channel_ids]);

  useEffect(() => {
    setAllowSitemapFallback(Boolean(config?.settings?.allow_sitemap_fallback));
  }, [config?.settings?.allow_sitemap_fallback]);

  const parseTextList = (raw: string): string[] => raw.split(/[\n,;]+/).map(item => item.trim()).filter(Boolean);

  const normalizeCountryLabel = (country: string): string =>
    country.trim().toLowerCase().split(/\s+/).filter(Boolean).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');

  const patchConfig = async (patch: Record<string, any>) => {
    setPatchError(null);
    setSaving(true);
    try {
      await updateConfigMutation.mutateAsync({ source, body: patch });
      onConfigUpdated();
    } catch (err: any) {
      setPatchError(err?.response?.data?.detail ?? 'Failed to update config');
    } finally {
      setSaving(false);
    }
  };

  const saveDraftSettings = async () => {
    const nextSettings = { ...(config?.settings ?? {}) };

    const rawLimit = jobsLimitPerRunInput.trim();
    if (!rawLimit || rawLimit === '0') {
      delete nextSettings.jobs_limit_per_run;
      delete nextSettings.initial_jobs_to_acquire;
    } else {
      const parsedLimit = Number.parseInt(rawLimit, 10);
      if (!Number.isFinite(parsedLimit) || parsedLimit < 0) {
        setPatchError('Jobs limit must be 0 or a positive integer');
        return;
      }
      nextSettings.jobs_limit_per_run = parsedLimit;
      delete nextSettings.initial_jobs_to_acquire;
    }

    const parsedCountries = parseTextList(countriesInput).map(normalizeCountryLabel);
    if (parsedCountries.length === 0) delete nextSettings.countries;
    else nextSettings.countries = parsedCountries;

    if (source !== 'a1') {
      const parsedChannels = parseTextList(partnerChannelsInput);
      if (parsedChannels.length === 0) delete nextSettings.partner_channel_ids;
      else nextSettings.partner_channel_ids = parsedChannels;
    }

    if (source === 'hcltech') {
      if (allowSitemapFallback) nextSettings.allow_sitemap_fallback = true;
      else delete nextSettings.allow_sitemap_fallback;
    }

    await patchConfig({ settings: nextSettings });
  };

  const handleToggleEnabled = () => patchConfig({ enabled: !config?.enabled });

  const handleScheduleChange = (value: string | null) => {
    patchConfig({ sync_periods: value, enable_scheduling: value !== null });
  };

  const handleRunNow = async () => {
    setRunningMode('full');
    setRunError(null);
    setRunWarning(null);
    try {
      await runMutation.mutateAsync({ source });
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.detail ?? 'Run failed';
      if (status === 409) setRunWarning(msg);
      else setRunError(msg);
      setRunningMode(null);
    }
  };

  const handleImportRecent = async () => {
    const parsedWeeks = Number.parseInt(importWeeksInput.trim(), 10);
    const safeWeeks = Number.isFinite(parsedWeeks) ? Math.min(Math.max(parsedWeeks, 1), 12) : 2;
    setRunningMode('recent');
    setRunError(null);
    setRunWarning(null);
    try {
      await runMutation.mutateAsync({ source, params: { since_days: String(safeWeeks * 7) } });
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.detail ?? 'Run failed';
      if (status === 409) setRunWarning(msg);
      else setRunError(msg);
      setRunningMode(null);
    }
  };

  const handleCleanupExpired = async () => {
    if (!window.confirm(`Close ${expiredCount} expired jobs for ${SOURCE_LABELS[source] ?? source}?`)) return;
    setCleaningUp(true);
    setRunError(null);
    try {
      await cleanupConnectorExpired(tenantId, source);
      fetchExpiredCount();
    } catch (err: any) {
      setRunError(err?.response?.data?.detail ?? 'Cleanup failed');
    } finally {
      setCleaningUp(false);
    }
  };

  // Poll sync status when running
  useEffect(() => {
    if (runningMode === null) return;
    const dispatchedAt = Date.now();
    const interval = setInterval(async () => {
      if (Date.now() - dispatchedAt > 300_000) {
        setRunningMode(null);
        clearInterval(interval);
        return;
      }
      onSyncUpdated();
    }, 5000);
    return () => clearInterval(interval);
  }, [runningMode, onSyncUpdated]);

  useEffect(() => {
    if (runningMode === null) return;
    if (syncRecord?.last_sync_date && !syncRecord.sync_in_progress) {
      setRunningMode(null);
    }
  }, [syncRecord, runningMode]);

  const syncInProgress = Boolean(syncRecord?.sync_in_progress);
  const connectorBusy = runningMode !== null || syncInProgress || cleaningUp || saving;
  const currentSchedule = config?.sync_periods ?? null;

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle1" fontWeight={700}>{SOURCE_LABELS[source] ?? source}</Typography>
            {expiredCount !== null && expiredCount > 0 && (
              <Tooltip title={`${expiredCount} jobs missing in last sync`}>
                <Chip label={`${expiredCount} expired`} color="warning" size="small" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
              </Tooltip>
            )}
          </Stack>
          <FormControlLabel
            control={<Switch checked={config?.enabled ?? false} onChange={handleToggleEnabled} size="small" />}
            label="Enable"
            labelPlacement="start"
            sx={{ mr: 0 }}
          />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} sx={{ mb: 1.5 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body2" color="text.secondary">Scheduling:</Typography>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <Select value={currentSchedule ?? 'disabled'} onChange={e => handleScheduleChange(e.target.value === 'disabled' ? null : e.target.value)} displayEmpty>
                {SCHEDULE_OPTIONS.map(opt => (
                  <MenuItem key={opt.value ?? 'disabled'} value={opt.value ?? 'disabled'}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <TextField
            size="small"
            label="Jobs limit per run"
            type="number"
            value={jobsLimitPerRunInput}
            onChange={e => setJobsLimitPerRunInput(e.target.value)}
            inputProps={{ min: 0, step: 1 }}
            helperText="0 or empty = no limit"
            sx={{ minWidth: 220 }}
          />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} sx={{ mb: 1 }}>
          <TextField size="small" label="Countries" value={countriesInput} onChange={e => setCountriesInput(e.target.value)} helperText="Comma separated. Empty = Bulgaria." placeholder="Bulgaria" sx={{ minWidth: 220 }} />
          {source !== 'a1' && (
            <TextField size="small" label="Partner channel IDs" value={partnerChannelsInput} onChange={e => setPartnerChannelsInput(e.target.value)} helperText="Comma separated" sx={{ minWidth: 260 }} />
          )}
        </Stack>

        {source === 'hcltech' && (
          <FormControlLabel control={<Switch checked={allowSitemapFallback} onChange={e => setAllowSitemapFallback(e.target.checked)} size="small" />} label="Allow sitemap fallback" sx={{ mb: 1.5 }} />
        )}

        <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1.5 }}>
          <Button size="small" variant="contained" onClick={saveDraftSettings} disabled={connectorBusy} startIcon={saving ? <CircularProgress size={14} /> : undefined}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary">Last run: {formatDateTime(syncRecord?.last_sync_date)}</Typography>
            {syncRecord && (
              <>
                <Typography variant="body2" color="text.secondary">•</Typography>
                {syncInProgress ? (
                  <Chip label="RUNNING" color="info" size="small" />
                ) : syncRecord.last_sync_success ? (
                  <Chip label="OK" color="success" size="small" />
                ) : (
                  <Tooltip title={syncRecord.last_error ?? 'Unknown error'}>
                    <Chip label="ERROR" color="error" size="small" />
                  </Tooltip>
                )}
              </>
            )}
          </Stack>

          <Stack direction="row" spacing={1}>
            {expiredCount !== null && expiredCount > 0 && (
              <Button size="small" variant="outlined" color="warning" onClick={handleCleanupExpired} disabled={connectorBusy} startIcon={cleaningUp ? <CircularProgress size={14} /> : undefined}>
                {cleaningUp ? 'Closing...' : 'Close Expired'}
              </Button>
            )}
            <TextField
              size="small"
              type="number"
              label="Weeks"
              value={importWeeksInput}
              onChange={e => {
                const raw = e.target.value;
                if (raw === '') { setImportWeeksInput('2'); return; }
                const n = Number.parseInt(raw, 10);
                if (Number.isNaN(n)) return;
                setImportWeeksInput(String(Math.min(Math.max(n, 1), 12)));
              }}
              inputProps={{ min: 1, max: 12, step: 1 }}
              sx={{ width: 110 }}
              disabled={connectorBusy}
            />
            <Button size="small" variant="outlined" onClick={handleImportRecent} disabled={connectorBusy} startIcon={runningMode === 'recent' ? <CircularProgress size={14} /> : undefined} sx={{ whiteSpace: 'nowrap' }}>
              {runningMode === 'recent' ? 'Importing...' : `Import last ${importWeeksInput || '2'} weeks`}
            </Button>
            <Button size="small" variant="contained" onClick={handleRunNow} disabled={connectorBusy} startIcon={runningMode === 'full' ? <CircularProgress size={14} /> : undefined} sx={{ whiteSpace: 'nowrap' }}>
              {runningMode === 'full' ? 'Running...' : 'Run now'}
            </Button>
          </Stack>
        </Stack>

        {patchError && <Alert severity="error" sx={{ mt: 1 }} onClose={() => setPatchError(null)}>{patchError}</Alert>}
        {runWarning && <Alert severity="warning" sx={{ mt: 1 }} onClose={() => setRunWarning(null)}>{runWarning}</Alert>}
        {runError && <Alert severity="error" sx={{ mt: 1 }} onClose={() => setRunError(null)}>{runError}</Alert>}

        <SyncHealthSection tenantId={tenantId} source={source} syncRecord={syncRecord} />
      </CardContent>
    </Card>
  );
}

interface ConnectorConfigPanelProps {
  tenantId: string;
}

export const ConnectorConfigPanel = ({ tenantId }: ConnectorConfigPanelProps) => {
  const { data: configs, isLoading: configsLoading, isError: configsError, refetch: refetchConfigs } = useGetConnectorConfigs(tenantId);
  const { data: syncRecordsData, isLoading: syncLoading, refetch: refetchSync } = useGetConnectorSyncStatus(tenantId);

  useEffect(() => {
    const anyRunning = syncRecordsData?.some(r => r.sync_in_progress) ?? false;
    if (!anyRunning) return;
    const interval = setInterval(() => refetchSync(), 3000);
    return () => clearInterval(interval);
  }, [syncRecordsData, refetchSync]);

  const loading = configsLoading || syncLoading;

  if (loading) {
    return (
      <Stack alignItems="center" sx={{ py: 4 }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (configsError) {
    return <Alert severity="error">Failed to load connector configs.</Alert>;
  }

  return (
    <Stack>
      {SOURCES.map(source => (
        <ProviderCard
          key={source}
          tenantId={tenantId}
          source={source}
          config={configs?.find(c => c.source === source)}
          syncRecord={syncRecordsData?.find(r => r.source === source)}
          onConfigUpdated={() => refetchConfigs()}
          onSyncUpdated={() => refetchSync()}
        />
      ))}
    </Stack>
  );
};
