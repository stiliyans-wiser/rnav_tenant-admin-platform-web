'use client';

import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  FormControlLabel,
  MenuItem,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useExportDecisionReview, useGetDecisionReviewList } from '@/features/tenants/hooks/useDecisionReview';
import { DecisionReviewDrawer } from '@/features/tenants/components/common/view/DecisionReviewDrawer';
import { DecisionReviewExportFormat, DecisionReviewFilters, DecisionReviewSort } from '@/features/tenants/interfaces/decision-review.interface';
import {
  DEFAULT_PAGE_SIZE,
  EXPORT_URL_REVOKE_DELAY_MS,
  REVIEW_PAGE_SIZES,
  STATUS_OPTIONS,
  attentionLabel,
  describeFilters,
  driftView,
  filtersEqual,
  exportNotice,
  formatScore,
  formatUtcDate,
  orBlank,
  reasonsText,
  thenView,
  isConflict,
  makeDefaultFilters,
  mapReviewError,
  statusLabel,
  validateFilters,
} from '@/features/tenants/utils/decisionReview';

interface DecisionReviewPanelProps {
  tenantId: string;
}

type Notice = { severity: 'success' | 'warning' | 'error'; text: string };

const SORT_OPTIONS: { id: DecisionReviewSort; label: string }[] = [
  { id: 'attention', label: 'Needs attention first' },
  { id: 'newest', label: 'Newest first' },
  { id: 'oldest', label: 'Oldest first' },
];

const saveBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), EXPORT_URL_REVOKE_DELAY_MS);
};

export const DecisionReviewPanel = ({ tenantId }: DecisionReviewPanelProps) => {
  const [initial] = useState(() => makeDefaultFilters());
  const [draft, setDraft] = useState<DecisionReviewFilters>(initial);
  const [applied, setApplied] = useState<DecisionReviewFilters>(initial);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [selected, setSelected] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  const validation = useMemo(() => validateFilters(draft), [draft]);
  const list = useGetDecisionReviewList(tenantId, applied, page, pageSize);
  const exporter = useExportDecisionReview(tenantId);
  const listError = list.isError ? mapReviewError(list.error) : null;

  const update = (patch: Partial<DecisionReviewFilters>) => setDraft(prev => ({ ...prev, ...patch }));

  const apply = () => {
    if (validation) return;
    setPage(0);
    setApplied(draft);
  };

  const reset = () => {
    const defaults = makeDefaultFilters();
    setDraft(defaults);
    setApplied(defaults);
    setPage(0);
  };

  const pendingEdits = !filtersEqual(draft, applied);

  const runExport = async (format: DecisionReviewExportFormat) => {
    try {
      const result = await exporter.mutateAsync({ filters: applied, format });
      saveBlob(result.blob, result.filename);
      setNotice(exportNotice(result.headers));
    } catch (error) {
      setNotice({ severity: 'error', text: mapReviewError(error).message });
    }
  };

  const data = list.data;
  const total = data?.total ?? 0;

  return (
    <Stack gap={2}>
      <Typography variant="caption" color="text.secondary">
        Read-only review of recruiter decisions for this tenant. Access is logged. The export contains candidate names and notes.
      </Typography>

      <Stack direction="row" gap={2} flexWrap="wrap" alignItems="flex-start" component="form" onSubmit={e => { e.preventDefault(); apply(); }}>
        <TextField
          select
          size="small"
          label="Statuses"
          sx={{ minWidth: 200 }}
          value={draft.statuses}
          onChange={e => update({ statuses: typeof e.target.value === 'string' ? e.target.value.split(',') : (e.target.value as string[]) })}
          slotProps={{
            select: { multiple: true, renderValue: v => (v as string[]).map(statusLabel).join(', ') },
          }}
        >
          {STATUS_OPTIONS.map(s => (
            <MenuItem key={s.id} value={s.id}>
              <Checkbox checked={draft.statuses.includes(s.id)} size="small" />
              {s.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField size="small" type="date" label="From (UTC)" value={draft.dateFrom} onChange={e => update({ dateFrom: e.target.value })} slotProps={{ inputLabel: { shrink: true } }} />
        <TextField size="small" type="date" label="To (UTC)" value={draft.dateTo} onChange={e => update({ dateTo: e.target.value })} slotProps={{ inputLabel: { shrink: true } }} />
        <TextField size="small" label="Reason codes (any of, comma separated)" value={draft.reasonCode} onChange={e => update({ reasonCode: e.target.value })} sx={{ width: 260 }} />
        <TextField size="small" label="Recruiter (email or id)" value={draft.recruiter} onChange={e => update({ recruiter: e.target.value })} sx={{ width: 200 }} />
        <TextField size="small" label="Job id" value={draft.jobId} onChange={e => update({ jobId: e.target.value })} sx={{ width: 280 }} />
        <TextField size="small" label="Score min" value={draft.scoreMin} onChange={e => update({ scoreMin: e.target.value })} sx={{ width: 100 }} />
        <TextField size="small" label="Score max" value={draft.scoreMax} onChange={e => update({ scoreMax: e.target.value })} sx={{ width: 100 }} />
        <TextField select size="small" label="Sort" value={draft.sort} onChange={e => update({ sort: e.target.value as DecisionReviewSort })} sx={{ minWidth: 180 }}>
          {SORT_OPTIONS.map(s => (
            <MenuItem key={s.id} value={s.id}>
              {s.label}
            </MenuItem>
          ))}
        </TextField>
        <FormControlLabel
          control={<Checkbox size="small" checked={draft.needsAttention} onChange={(_, v) => update({ needsAttention: v })} />}
          label="Needs attention only"
        />
        <FormControlLabel
          control={<Checkbox size="small" checked={draft.includeCascade} onChange={(_, v) => update({ includeCascade: v })} />}
          label="Include cascade events"
        />
        <Stack direction="row" gap={1}>
          <Button type="submit" variant="contained" disabled={!!validation || list.isFetching}>
            Apply filters
          </Button>
          <Button variant="outlined" onClick={reset}>
            Reset
          </Button>
        </Stack>
      </Stack>
      {validation && (
        <Typography variant="caption" color="error" role="alert">
          {validation}
        </Typography>
      )}

      <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
        <Typography variant="body2" aria-live="polite">
          {list.isLoading ? 'Loading decisions...' : listError ? '' : `${total} decision${total === 1 ? '' : 's'}`}
        </Typography>
        {list.isFetching && !list.isLoading && <CircularProgress size={14} aria-label="Refreshing" />}
        <Box flexGrow={1} />
        <Button variant="outlined" size="small" disabled={exporter.isPending || !total || pendingEdits} onClick={() => runExport('xlsx')}>
          {exporter.isPending ? 'Exporting...' : 'Export XLSX'}
        </Button>
        <Button variant="outlined" size="small" disabled={exporter.isPending || !total || pendingEdits} onClick={() => runExport('csv')}>
          Export CSV
        </Button>
      </Stack>

      <Typography variant="caption" color="text.secondary">
        Export uses the applied filters: {describeFilters(applied)}.{pendingEdits ? ' You have unapplied edits. Apply them to export.' : ''}
      </Typography>

      {listError && (
        <Alert
          severity={isConflict(listError) ? 'warning' : 'error'}
          action={
            <Button color="inherit" size="small" onClick={() => list.refetch()}>
              Retry
            </Button>
          }
        >
          {listError.message}
        </Alert>
      )}

      {!listError && list.isLoading && <CircularProgress size={20} aria-label="Loading decisions" />}

      {!listError && data && data.items.length === 0 && (
        <Alert severity="info">No decisions match these filters.</Alert>
      )}

      {!listError && data && data.items.length > 0 && (
        <>
          <TableContainer sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
            <Table size="small" aria-label="Decision review">
              <TableHead>
                <TableRow>
                  <TableCell>Candidate</TableCell>
                  <TableCell>Job</TableCell>
                  <TableCell>Decision</TableCell>
                  <TableCell>Score then → now</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Attention</TableCell>
                  <TableCell>Recruiter</TableCell>
                  <TableCell>Date (UTC)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.items.map(row => {
                  const drift = driftView(row.snapshot_drift);
                  const then = thenView(row);
                  return (
                    <TableRow
                      key={row.event_id}
                      hover
                      tabIndex={0}
                      role="button"
                      aria-label={`Open decision for ${row.candidate_purged ? 'a deleted candidate' : row.candidate_name || 'candidate'}`}
                      onClick={() => setSelected(row.event_id)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelected(row.event_id);
                        }
                      }}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>
                        <Typography variant="body2">{orBlank(row.candidate_name)}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {orBlank(row.candidate_current_title)}
                        </Typography>
                        {row.candidate_purged && <Chip size="small" variant="outlined" label="Candidate deleted" sx={{ ml: 0.5 }} />}
                      </TableCell>
                      <TableCell>{orBlank(row.job_title)}</TableCell>
                      <TableCell>
                        <Chip size="small" label={statusLabel(row.to_status)} />
                        {row.is_cascade && <Chip size="small" variant="outlined" label="Cascade" sx={{ ml: 0.5 }} />}
                      </TableCell>
                      <TableCell>
                        <span title={then.tooltip}>
                          {then.text}
                          {then.marker && ` ${then.marker}`}
                        </span>
                        {' \u2192 '}
                        {formatScore(row.current_overall_score)}
                        {row.snapshot_drift && (
                          <Chip size="small" color="warning" label="Drift" title={drift.text} sx={{ ml: 0.5 }} />
                        )}
                      </TableCell>
                      <TableCell>{orBlank(reasonsText(row))}</TableCell>
                      <TableCell>
                        {row.attention ? (
                          <Chip
                            size="small"
                            color="warning"
                            label={attentionLabel(row.attention)}
                            title={`Score ${formatScore(row.decision_score)}`}
                          />
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>{orBlank(row.actor_email)}</TableCell>
                      <TableCell>{formatUtcDate(row.occurred_at)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={total}
            page={page}
            rowsPerPage={pageSize}
            rowsPerPageOptions={REVIEW_PAGE_SIZES}
            onPageChange={(_, p) => setPage(p)}
            onRowsPerPageChange={e => {
              setPageSize(Number(e.target.value));
              setPage(0);
            }}
          />
        </>
      )}

      <DecisionReviewDrawer tenantId={tenantId} eventId={selected} onClose={() => setSelected(null)} />

      <Snackbar open={notice !== null} autoHideDuration={10000} onClose={() => setNotice(null)}>
        <Alert severity={notice?.severity ?? 'error'} onClose={() => setNotice(null)}>
          {notice?.text}
        </Alert>
      </Snackbar>
    </Stack>
  );
};
