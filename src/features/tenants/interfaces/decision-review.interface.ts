export interface DecisionReviewRow {
  event_id: string;
  occurred_at: string;
  tier: string;
  from_status: string;
  to_status: string;
  source: string;
  is_cascade: boolean;
  actor_email: string;
  actor_role: string;
  event_reason: string;
  event_note: string;
  reason_code: string;
  reason_codes?: string[];
  reason_label: string;
  reason_labels?: string[];
  reason_matching_error: boolean | null;
  run_number: number | null;
  job_id: string;
  job_title: string;
  job_client: string;
  candidate_id: string;
  candidate_name: string;
  candidate_current_title: string;
  candidate_purged: boolean;
  attention: string;
  decision_score: number | null;
  score_source: 'snapshot' | 'current' | 'none';
  snapshot_state: string;
  snapshot_overall_score: number | null;
  snapshot_rank: number | null;
  snapshot_rank_total: number | null;
  snapshot_scoring_version: number | null;
  snapshot_last_scored_at: string;
  snapshot_explanation_summary: string;
  snapshot_drift: boolean | null;
  current_overall_score: number | null;
  current_rank_in_job: number | null;
  current_scoring_version: number | null;
  current_last_scored_at: string;
  current_sub_scores: string;
  current_explanation_summary: string;
  thumbs_feedback: string;
  candidate_notes: string;
  job_notes: string;
}

export interface DecisionReviewList {
  items: DecisionReviewRow[];
  total: number;
  limit: number;
  offset: number;
  sort: DecisionReviewSort;
  high_score: number;
  low_score: number;
}

export type DecisionReviewSort = 'attention' | 'newest' | 'oldest';
export type DecisionReviewExportFormat = 'xlsx' | 'csv';

export interface DecisionReviewFilters {
  statuses: string[];
  dateFrom: string;
  dateTo: string;
  reasonCode: string;
  recruiter: string;
  jobId: string;
  scoreMin: string;
  scoreMax: string;
  includeCascade: boolean;
  needsAttention: boolean;
  sort: DecisionReviewSort;
}

export type DecisionReviewQueryParams = Record<string, string | number | boolean>;

export interface DecisionReviewNote {
  created_at: string;
  author_id: string;
  author_email: string;
  content: string;
  job_id: string | null;
  match: 'job' | 'window';
}

export interface DecisionReviewThumb {
  created_at: string;
  recruiter_id: string;
  recruiter_email: string;
  feedback_type: string;
  explanation: string;
  overall_score: number | null;
  run_number: number | null;
  status_event_id: string | null;
}

export interface DecisionReviewSkillItem {
  [key: string]: unknown;
}

export interface DecisionReviewSnapshot {
  overall_score?: number | null;
  rank?: number | null;
  rank_total?: number | null;
  scoring_version?: number | null;
  explanation_summary?: string;
  run?: { number?: number | null; at?: string | null } | null;
  drift?: boolean;
  client_seen?: { overall_score?: number; run_number?: number } | null;
  missing?: boolean;
  redacted?: boolean;
  error?: unknown;
  truncated?: boolean;
  skill_evidence?: { matched?: DecisionReviewSkillItem[]; missing?: DecisionReviewSkillItem[] };
}

export interface DecisionReviewCurrent {
  overall_score: number | null;
  rank: number | null;
  rank_total: number | null;
  scoring_version: number | null;
  last_scored_at: string;
  run_number: number | null;
  sub_scores: Record<string, unknown>;
  explanation_summary: string;
}

export interface DecisionReviewComparison {
  snapshot_available: boolean;
  match_exists: boolean;
  score_delta: number | null;
  rank_delta: number | null;
  scoring_version_changed: boolean | null;
  run_changed: boolean | null;
  drift: boolean | null;
  client_seen: { overall_score?: number; run_number?: number } | null;
}

export interface DecisionReviewDetail {
  event: DecisionReviewRow;
  cause_event_id: string | null;
  snapshot: DecisionReviewSnapshot | null;
  current: DecisionReviewCurrent | null;
  comparison: DecisionReviewComparison;
  candidate_notes: DecisionReviewNote[];
  job_notes: DecisionReviewNote[];
  thumbs: DecisionReviewThumb[];
}

export interface DecisionReviewExportResult {
  blob: Blob;
  filename: string;
}
