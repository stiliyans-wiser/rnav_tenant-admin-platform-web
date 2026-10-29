'use client';

import { Alert, Box, Button, Chip, CircularProgress, Divider, Drawer, IconButton, Stack, Typography } from '@mui/material';
import { Close } from '@carbon/icons-react';
import { useGetDecisionReviewDetail } from '@/features/tenants/hooks/useDecisionReview';
import { DecisionReviewNote } from '@/features/tenants/interfaces/decision-review.interface';
import { attentionLabel, driftView, formatDelta, formatScore, mapReviewError, noteMatchLabel, orBlank, statusLabel, thumbsChipColor } from '@/features/tenants/utils/decisionReview';

interface DecisionReviewDrawerProps {
  tenantId: string;
  eventId: string | null;
  onClose: () => void;
}

const WRAP_SX = { whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' } as const;

const formatDate = (iso: string) => (iso ? new Date(iso).toLocaleString() : '-');

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <Stack gap={0.25}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2" component="div" sx={WRAP_SX}>
      {children}
    </Typography>
  </Stack>
);

const Notes = ({ title, notes, emptyText }: { title: string; notes: DecisionReviewNote[]; emptyText: string }) => (
  <Stack gap={1}>
    <Typography variant="subtitle2">{title}</Typography>
    {notes.length === 0 && (
      <Typography variant="body2" color="text.secondary">
        {emptyText}
      </Typography>
    )}
    {notes.map((n, i) => (
      <Box key={`${n.created_at}-${i}`} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 1.5 }}>
        <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap" mb={0.5}>
          <Chip
            size="small"
            variant="outlined"
            color={n.match === 'job' ? 'primary' : 'default'}
            label={noteMatchLabel(n.match)}
            title={n.match === 'job' ? 'Written for this job' : 'Matched by time window around the decision'}
          />
          <Typography variant="caption" color="text.secondary">
            {formatDate(n.created_at)} {n.author_email ? `· ${n.author_email}` : ''}
          </Typography>
        </Stack>
        <Typography variant="body2" sx={WRAP_SX}>
          {n.content}
        </Typography>
      </Box>
    ))}
  </Stack>
);

export const DecisionReviewDrawer = ({ tenantId, eventId, onClose }: DecisionReviewDrawerProps) => {
  const { data, isLoading, isError, error, refetch } = useGetDecisionReviewDetail(tenantId, eventId);
  const mapped = isError ? mapReviewError(error) : null;
  const cmp = data?.comparison;
  const drift = data ? driftView(cmp?.drift, cmp?.client_seen?.overall_score, cmp?.client_seen?.run_number) : null;
  const snap = data?.snapshot;
  const snapAvailable = !!cmp?.snapshot_available;

  return (
    <Drawer anchor="right" open={eventId !== null} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: 560 } } }}>
      <Stack p={3} gap={2.5} sx={{ minWidth: 0 }} role="region" aria-label="Decision details">
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Decision details</Typography>
          <IconButton aria-label="Close decision details" onClick={onClose}>
            <Close size={20} />
          </IconButton>
        </Stack>

        {isLoading && <CircularProgress size={24} aria-label="Loading decision details" />}

        {mapped && (
          <Alert
            severity={mapped.status === 409 ? 'warning' : 'error'}
            action={
              <Button color="inherit" size="small" onClick={() => refetch()}>
                Retry
              </Button>
            }
          >
            {mapped.message}
          </Alert>
        )}

        {data && drift && (
          <>
            <Stack gap={1}>
              <Typography variant="subtitle1">{orBlank(data.event.candidate_name)}</Typography>
              <Typography variant="body2" color="text.secondary">
                {orBlank(data.event.candidate_current_title)} · {data.event.job_title || 'Global decision (no job)'}
                {data.event.job_client ? ` · ${data.event.job_client}` : ''}
              </Typography>
              <Stack direction="row" gap={1} flexWrap="wrap">
                <Chip size="small" label={`${statusLabel(data.event.from_status)} → ${statusLabel(data.event.to_status)}`} />
                {data.event.attention && <Chip size="small" color="warning" label={attentionLabel(data.event.attention)} />}
                {data.event.is_cascade && <Chip size="small" variant="outlined" label="Cascade" />}
                {data.event.candidate_purged && <Chip size="small" variant="outlined" label="Candidate deleted" />}
              </Stack>
            </Stack>

            <Stack direction="row" gap={3} flexWrap="wrap">
              <Field label="Reason">{orBlank(data.event.reason_label || data.event.event_reason)}</Field>
              <Field label="Recruiter">{orBlank(data.event.actor_email)}</Field>
              <Field label="Decided">{formatDate(data.event.occurred_at)}</Field>
            </Stack>
            {(data.event.event_note || data.event.candidate_purged) && <Field label="Decision note">{orBlank(data.event.event_note)}</Field>}

            <Divider />

            <Stack gap={1.5}>
              <Typography variant="subtitle2">Snapshot vs now</Typography>
              {!snapAvailable && (
                <Alert severity="info">
                  {snap?.redacted
                    ? 'Snapshot details were redacted because the candidate was deleted.'
                    : snap?.missing
                    ? 'No match row existed when this decision was made, so no score snapshot was stored.'
                    : snap?.error
                    ? 'The score snapshot could not be recorded for this decision.'
                    : 'No score snapshot was stored for this decision (recorded before decision reasons were enabled).'}
                </Alert>
              )}
              <Stack direction="row" gap={4} flexWrap="wrap">
                <Stack gap={1}>
                  <Typography variant="caption" color="text.secondary">
                    At decision time (frozen)
                  </Typography>
                  <Field label="Score">{formatScore(snap?.overall_score)}</Field>
                  <Field label="Rank">{snap?.rank != null ? `${snap.rank}${snap.rank_total ? ` of ${snap.rank_total}` : ''}` : '-'}</Field>
                  <Field label="Run">{snap?.run?.number ?? data.event.run_number ?? '-'}</Field>
                  <Field label="Scoring version">{snap?.scoring_version ?? '-'}</Field>
                </Stack>
                <Stack gap={1}>
                  <Typography variant="caption" color="text.secondary">
                    Now (current match)
                  </Typography>
                  {data.current ? (
                    <>
                      <Field label="Score">{formatScore(data.current.overall_score)}</Field>
                      <Field label="Rank">
                        {data.current.rank != null ? `${data.current.rank}${data.current.rank_total ? ` of ${data.current.rank_total}` : ''}` : '-'}
                      </Field>
                      <Field label="Run">{data.current.run_number ?? '-'}</Field>
                      <Field label="Scoring version">{data.current.scoring_version ?? '-'}</Field>
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {data.event.candidate_purged ? 'Not available (candidate deleted).' : 'No current match row.'}
                    </Typography>
                  )}
                </Stack>
              </Stack>
              {cmp && snapAvailable && data.current && (
                <Typography variant="body2">
                  Score change: <strong>{formatDelta(cmp.score_delta)}</strong>
                  {cmp.run_changed ? ' · re-scored in a later run' : ''}
                  {cmp.scoring_version_changed ? ' · scoring version changed' : ''}
                </Typography>
              )}
              <Alert severity={drift.drifted ? 'warning' : 'info'} icon={false} role="status">
                <strong>{drift.drifted ? 'Drift: ' : 'Seen: '}</strong>
                {drift.text}
              </Alert>
              {snap?.truncated && <Typography variant="caption">Snapshot was shortened to fit the size limit.</Typography>}
              {snap?.redacted ? (
                <Field label="Explanation at decision time">Redacted (candidate deleted)</Field>
              ) : (
                snap?.explanation_summary && <Field label="Explanation at decision time">{snap.explanation_summary}</Field>
              )}
              {data.current?.explanation_summary && <Field label="Explanation now">{data.current.explanation_summary}</Field>}
            </Stack>

            <Divider />
            <Notes title="Candidate notes" notes={data.candidate_notes} emptyText="No notes tied to this decision." />
            <Notes title="Job notes" notes={data.job_notes} emptyText="No job notes around this decision." />

            <Divider />
            <Stack gap={1}>
              <Typography variant="subtitle2">Thumbs history</Typography>
              {data.thumbs.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No thumbs recorded for this candidate and job.
                </Typography>
              )}
              {data.thumbs.map((t, i) => (
                <Stack key={`${t.created_at}-${i}`} direction="row" gap={1} alignItems="baseline" flexWrap="wrap">
                  <Chip size="small" color={thumbsChipColor(t.feedback_type)} label={t.feedback_type.replace(/_/g, ' ')} />
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(t.created_at)} · {t.recruiter_email || 'unknown'}
                    {t.overall_score != null ? ` · score ${formatScore(t.overall_score)}` : ''}
                    {t.run_number != null ? ` · run ${t.run_number}` : ''}
                    {t.status_event_id === data.event.event_id ? ' · linked to this decision' : ''}
                  </Typography>
                  {t.explanation && <Typography variant="body2" sx={WRAP_SX}>{t.explanation}</Typography>}
                </Stack>
              ))}
            </Stack>
          </>
        )}
      </Stack>
    </Drawer>
  );
};
