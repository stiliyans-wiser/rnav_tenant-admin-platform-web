// Types derived from plan PLAN_228 API contract for GET /backoffice/sessions.
// The API lands in parallel on branch feat/228-sessions in core42-pov-api.
// Assumptions noted at the end of this file.

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
  tenant_name: string;
  active_user_count: number;
  session_count: number;
  last_activity: string | null; // ISO-8601 UTC, null if no active sessions
  users: ActiveSessionUser[];
}

export interface PlatformSessionsResponse {
  tenants: TenantSessionSummary[];
  total_active_users: number;
  total_sessions: number;
}

/*
 * Contract assumptions (to be confirmed against the final API implementation):
 * - tenant_name is the human-readable account name from the Account MongoDB document.
 * - last_activity on TenantSessionSummary is the maximum last_activity across all users in that tenant.
 * - Tenants with zero active sessions are omitted from the tenants array (not included with count 0).
 * - users array inside each tenant contains only users with at least one active session.
 */
