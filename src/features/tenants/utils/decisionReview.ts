import type { DecisionReviewFilters, DecisionReviewQueryParams } from '../interfaces/decision-review.interface.ts';

export const REVIEW_PAGE_SIZES = [25, 50, 100];
export const DEFAULT_PAGE_SIZE = 50;
export const EXPORT_MAX_ROWS = 20000;

export const STATUS_OPTIONS: { id: string; label: string }[] = [
  { id: 'excluded', label: 'Excluded' },
  { id: 'on_hold', label: 'On hold' },
  { id: 'dropped', label: 'Dropped' },
  { id: 'approved', label: 'Approved' },
  { id: 'send_to_client', label: 'Sent to client' },
];

export const DEFAULT_RANGE_DAYS = 30;

const isoDay = (date: Date): string => date.toISOString().slice(0, 10);

export const defaultDateFrom = (now: Date = new Date()): string => isoDay(new Date(now.getTime() - DEFAULT_RANGE_DAYS * 86400000));

const BASE_FILTERS: DecisionReviewFilters = {
  statuses: ['excluded', 'on_hold', 'dropped'],
  dateFrom: '',
  dateTo: '',
  reasonCode: '',
  recruiter: '',
  jobId: '',
  scoreMin: '',
  scoreMax: '',
  includeCascade: false,
  needsAttention: false,
  sort: 'attention',
};

export const makeDefaultFilters = (now: Date = new Date()): DecisionReviewFilters => ({
  ...BASE_FILTERS,
  statuses: [...BASE_FILTERS.statuses],
  dateFrom: defaultDateFrom(now),
});

export const filtersEqual = (a: DecisionReviewFilters, b: DecisionReviewFilters): boolean =>
  JSON.stringify(buildFilterParams(a)) === JSON.stringify(buildFilterParams(b));

export const describeFilters = (f: DecisionReviewFilters): string => {
  const parts = [f.statuses.map(statusLabel).join(', ') || 'no status'];
  if (f.dateFrom || f.dateTo) parts.push(`${f.dateFrom || '...'} to ${f.dateTo || 'today'}`);
  else parts.push('all dates');
  if (f.reasonCode.trim()) parts.push(`reason ${f.reasonCode.trim()}`);
  if (f.recruiter.trim()) parts.push(`recruiter ${f.recruiter.trim()}`);
  if (f.jobId.trim()) parts.push('one job');
  if (parseScore(f.scoreMin) !== null || parseScore(f.scoreMax) !== null) parts.push(`score ${f.scoreMin.trim() || '0'}-${f.scoreMax.trim() || '100'}`);
  if (f.needsAttention) parts.push('needs attention only');
  if (f.includeCascade) parts.push('with cascade events');
  return parts.join(' · ');
};

const UUID_RE = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export const buildFilterParams = (filters: DecisionReviewFilters): DecisionReviewQueryParams => {
  const params: DecisionReviewQueryParams = { sort: filters.sort };
  if (filters.statuses.length) params.statuses = filters.statuses.join(',');
  if (filters.dateFrom) params.date_from = filters.dateFrom;
  if (filters.dateTo) params.date_to = filters.dateTo;
  if (filters.reasonCode.trim()) params.reason_code = filters.reasonCode.trim();
  if (filters.recruiter.trim()) params.recruiter = filters.recruiter.trim();
  if (filters.jobId.trim()) params.job_id = filters.jobId.trim();
  const min = parseScore(filters.scoreMin);
  const max = parseScore(filters.scoreMax);
  if (min !== null) params.score_min = min;
  if (max !== null) params.score_max = max;
  if (filters.includeCascade) params.include_cascade = true;
  if (filters.needsAttention) params.needs_attention = true;
  return params;
};

export const buildListParams = (filters: DecisionReviewFilters, page: number, pageSize: number): DecisionReviewQueryParams => ({
  ...buildFilterParams(filters),
  limit: pageSize,
  offset: Math.max(0, page) * pageSize,
});

export const buildExportParams = (filters: DecisionReviewFilters, format: 'xlsx' | 'csv'): DecisionReviewQueryParams => ({
  ...buildFilterParams(filters),
  format,
  max_rows: EXPORT_MAX_ROWS,
});

export const parseScore = (value: string): number | null => {
  const text = value.trim();
  if (!text) return null;
  const n = Number(text);
  return Number.isFinite(n) && n >= 0 && n <= 100 ? n : null;
};

export const validateFilters = (filters: DecisionReviewFilters): string | null => {
  if (!filters.statuses.length) return 'Select at least one status.';
  if (filters.dateFrom && filters.dateTo && filters.dateFrom > filters.dateTo) return 'The start date is after the end date.';
  if (filters.scoreMin.trim() && parseScore(filters.scoreMin) === null) return 'Min score must be a number from 0 to 100.';
  if (filters.scoreMax.trim() && parseScore(filters.scoreMax) === null) return 'Max score must be a number from 0 to 100.';
  const min = parseScore(filters.scoreMin);
  const max = parseScore(filters.scoreMax);
  if (min !== null && max !== null && min > max) return 'Min score is above max score.';
  if (filters.jobId.trim() && !UUID_RE.test(filters.jobId.trim())) return 'Job id must be a UUID.';
  return null;
};

export const formatScore = (score: number | null | undefined): string =>
  score === null || score === undefined || Number.isNaN(score) ? '-' : String(Math.round(score * 10) / 10);

export const formatScoreTransition = (then: number | null | undefined, now: number | null | undefined): string =>
  `${formatScore(then)} → ${formatScore(now)}`;

export const formatDelta = (delta: number | null | undefined): string => {
  if (delta === null || delta === undefined || Number.isNaN(delta)) return '-';
  const rounded = Math.round(delta * 10) / 10;
  return rounded > 0 ? `+${rounded}` : String(rounded);
};

export const ATTENTION_LABELS: Record<string, string> = {
  high_score_excluded: 'High score excluded',
  low_score_approved: 'Low score approved',
};

export const attentionLabel = (attention: string): string => ATTENTION_LABELS[attention] ?? '';

export const statusLabel = (id: string): string =>
  STATUS_OPTIONS.find(s => s.id === id)?.label ?? (id ? id.replace(/_/g, ' ').replace(/^./, c => c.toUpperCase()) : '-');

export interface DriftView {
  drifted: boolean;
  text: string;
}

export const driftView = (drift: boolean | null | undefined, seenScore?: number, seenRun?: number): DriftView => {
  if (drift === null || drift === undefined) return { drifted: false, text: 'Drift unknown (no client-seen values recorded)' };
  if (!drift) return { drifted: false, text: 'Recruiter saw the same score and run' };
  const seen = [seenScore !== undefined ? `score ${formatScore(seenScore)}` : null, seenRun !== undefined ? `run ${seenRun}` : null].filter(Boolean);
  return { drifted: true, text: `Recruiter saw different data${seen.length ? ` (${seen.join(', ')})` : ''}` };
};

export const noteMatchLabel = (match: string): string => (match === 'job' ? 'job' : 'window');

export interface ExportHeaders {
  rows: number | null;
  total: number | null;
  truncated: boolean;
}

const headerValue = (headers: unknown, name: string): string | undefined => {
  if (!headers || typeof headers !== 'object') return undefined;
  const h = headers as { get?: (n: string) => unknown } & Record<string, unknown>;
  const value = typeof h.get === 'function' ? h.get(name) : h[name.toLowerCase()];
  return value === undefined || value === null ? undefined : String(value);
};

const toCount = (value: string | undefined): number | null => {
  if (value === undefined || value.trim() === '') return null;
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 ? n : null;
};

export const parseExportHeaders = (headers: unknown): ExportHeaders => ({
  rows: toCount(headerValue(headers, 'x-export-rows')),
  total: toCount(headerValue(headers, 'x-export-total')),
  truncated: headerValue(headers, 'x-export-truncated')?.toLowerCase() === 'true',
});

export const exportNotice = ({ rows, total, truncated }: ExportHeaders): { severity: 'success' | 'warning'; text: string } => {
  if (truncated) {
    return {
      severity: 'warning',
      text: `Export truncated: ${rows ?? '?'} of ${total ?? '?'} rows. Narrow the filters (dates, reason, job) to export the rest.`,
    };
  }
  return { severity: 'success', text: rows === null ? 'Export downloaded.' : `Exported ${rows} rows.` };
};

export const exportFilename = (disposition: unknown, format: string): string => {
  const match = typeof disposition === 'string' ? /filename="?([^";]+)"?/i.exec(disposition) : null;
  return match ? match[1] : `decision_review.${format}`;
};

export const ERROR_MESSAGES: Record<string, string> = {
  account_not_found: 'This tenant no longer exists.',
  decision_event_not_found: 'This decision was not found. It may belong to another tenant.',
  tenant_db_unavailable: "This tenant has no database configured, so there is nothing to review.",
  decision_events_unavailable: 'This tenant database has no decision history yet. A deploy or migration is needed.',
};

export interface ReviewError {
  code: string | null;
  status: number | null;
  message: string;
}

export const mapReviewError = (error: unknown): ReviewError => {
  const response = (error as { response?: { status?: number; data?: { detail?: unknown } } } | null)?.response;
  const status = typeof response?.status === 'number' ? response.status : null;
  const detail = response?.data?.detail;
  const obj = typeof detail === 'object' && detail !== null ? (detail as { code?: unknown; message?: unknown }) : null;
  const code = typeof obj?.code === 'string' ? obj.code : null;
  if (code && ERROR_MESSAGES[code]) return { code, status, message: ERROR_MESSAGES[code] };
  if (status === 403) return { code, status, message: 'You do not have access to decision review.' };
  if (status === 422) {
    const text = typeof obj?.message === 'string' ? obj.message : 'The filters were rejected.';
    return { code, status, message: `Invalid filters: ${text}` };
  }
  if (response === undefined) return { code, status, message: 'Could not reach the server. Check your connection and retry.' };
  const text = typeof obj?.message === 'string' ? obj.message : typeof detail === 'string' ? detail : null;
  return { code, status, message: text ? `Request failed: ${text}` : 'Request failed. Try again.' };
};

export const isConflict = (error: ReviewError): boolean => error.status === 409;

export type ThumbsColor = 'success' | 'error' | 'default';

export const thumbsChipColor = (feedbackType: string): ThumbsColor =>
  feedbackType === 'thumbs_up' ? 'success' : feedbackType === 'thumbs_down' ? 'error' : 'default';

export const withParsedErrorBody = async <E>(error: E): Promise<E> => {
  const response = (error as { response?: { data?: unknown } } | null)?.response;
  const data = response?.data as { text?: () => Promise<string> } | undefined;
  if (!response || !data || typeof data.text !== 'function') return error;
  try {
    response.data = JSON.parse(await data.text());
  } catch {
    response.data = undefined;
  }
  return error;
};

export const EXPORT_URL_REVOKE_DELAY_MS = 1000;
