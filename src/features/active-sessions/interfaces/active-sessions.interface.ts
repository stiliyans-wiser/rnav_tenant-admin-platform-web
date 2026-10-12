// Types for GET /backoffice/sessions — authoritative contract confirmed by API engineer.

export interface ActiveSessionUser {
  user_id: string;
  email: string;
  name: string;
  role: string;
  session_count: number;
  last_activity: string; // ISO-8601 UTC
}

export interface TenantSessionSummary {
  account_id: string;
  company_name: string;
  active_users: number;
  total_sessions: number;
  // No tenant-level last_activity in the API response.
  // The table computes it client-side as max(users[*].last_activity).
  users: ActiveSessionUser[];
}

export interface PlatformSessionsResponse {
  tenants: TenantSessionSummary[];
  total_active_users: number;
  total_active_sessions: number;
}
