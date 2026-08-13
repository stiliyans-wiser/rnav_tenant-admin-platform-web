export interface ConnectorConfig {
  source: string;
  enabled: boolean;
  enable_scheduling: boolean;
  sync_periods: string;
  settings: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface SyncRecord {
  account_id: string;
  source: string;
  last_sync_date: string | null;
  last_sync_success: boolean | null;
  last_result: Record<string, any>;
  last_error: string | null;
  created_at: string | null;
  sync_in_progress: boolean;
}

export interface SyncSummary {
  source: string;
  total_jobs: number;
  total_skipped: number;
  last_sync: {
    date: string | null;
    success: boolean | null;
    fetched: number;
    created: number;
    updated: number;
    duplicates: number;
    failed: number;
    skipped: number;
    diagnostics: Record<string, any>;
  };
  diagnostics: Record<string, any>;
  skip_reasons: Record<string, number>;
}

export interface SkipEvent {
  id?: string;
  source_job_id: string;
  source_url: string;
  title_from_slug: string;
  skip_reason: string;
  skip_count: number;
  first_seen_at: string;
  last_seen_at: string;
}

export interface SkipEventsResponse {
  items: SkipEvent[];
  total: number;
  page: number;
  page_size: number;
}

export interface CrawlerClientConfig {
  source: string;
  client_status: 'watched' | 'potential';
  platform_enabled: boolean;
  updated_at: string | null;
}

export interface ConnectorConfigUpdate {
  enabled?: boolean;
  enable_scheduling?: boolean;
  sync_periods?: string;
  settings?: Record<string, any>;
}
