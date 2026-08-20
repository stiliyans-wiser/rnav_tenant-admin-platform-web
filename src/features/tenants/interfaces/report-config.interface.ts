export interface ReportConfig {
  report_cadence_enabled?: boolean;
  report_count?: number;
  report_period_days?: number;
  notification_recipients?: string[];
}

export const DEFAULT_REPORT_CONFIG: ReportConfig = {
  report_cadence_enabled: false,
  report_count: 3,
  report_period_days: 14,
  notification_recipients: [],
};
