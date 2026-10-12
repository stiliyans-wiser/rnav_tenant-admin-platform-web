// Types for GET /backoffice/sessions — authoritative contract from API commit 02874bc4.

export interface ActiveSessionUser {
  user_id: string;
  email: string;
  name: string;
  role: string;
  session_count: number;
  last_activity: string; // ISO-8601 UTC
}

export interface TenantSessionSummary {
  tenant_id: string;
  tenant_name: string; // never null — API falls back to account_id string
  active_user_count: number;
  session_count: number;
  last_activity: string | null; // ISO-8601 UTC, max across users; null if no sessions
  users: ActiveSessionUser[];
}

export interface PlatformSessionsResponse {
  tenants: TenantSessionSummary[];
  total_active_users: number;
  total_sessions: number;
}
