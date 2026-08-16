export interface ProviderQuotaDefaults {
  max_daily_searches: number;
  max_results_per_search: number;
  monthly_credit_budget: number | null;
  providers_enabled: boolean;
  updated_by?: string | null;
  updated_at?: string | null;
}

export interface TenantProviderQuota extends ProviderQuotaDefaults {
  source: 'default' | 'override';
}

export interface ProviderUsageStat {
  provider_config_id: string;
  provider_name: string;
  searches_today: number;
  searches_this_month: number;
  results_this_month: number;
  quota_rejections_this_month: number;
  last_error: string | null;
  last_run_at: string | null;
}

export interface TenantProviderUsage {
  account_id: string;
  monthly_results_total: number;
  providers: ProviderUsageStat[];
}
