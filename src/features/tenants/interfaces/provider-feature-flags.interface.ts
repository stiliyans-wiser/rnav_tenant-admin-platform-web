export interface ProviderFeatureFlags {
  linkedin_candidate_sourcing: boolean;
  candidate_provider_configs: boolean;
  job_position_provider_configs: boolean;
  kpmg_provider_flows: boolean;
}

export interface ProviderFeatureFlagAudit {
  id: string;
  account_id: string;
  changed_at: string;
  changed_by_user_id?: string | null;
  changed_by_name?: string | null;
  changed_by_email?: string | null;
  changed_fields: string[];
  old_value: Partial<ProviderFeatureFlags>;
  new_value: Partial<ProviderFeatureFlags>;
  source: string;
}

export const DEFAULT_PROVIDER_FEATURE_FLAGS: ProviderFeatureFlags = {
  linkedin_candidate_sourcing: false,
  candidate_provider_configs: false,
  job_position_provider_configs: false,
  kpmg_provider_flows: false,
};

export const providerFeatureFlagLabels: Record<keyof ProviderFeatureFlags, string> = {
  linkedin_candidate_sourcing: 'LinkedIn job candidate search',
  candidate_provider_configs: 'LinkedIn saved candidate searches',
  job_position_provider_configs: 'Job position provider configuration',
  kpmg_provider_flows: 'KPMG connector flows',
};

export const providerFeatureFlagDescriptions: Record<keyof ProviderFeatureFlags, string> = {
  linkedin_candidate_sourcing: 'Shows job-detail LinkedIn candidate search and allows job-scoped sourcing requests.',
  candidate_provider_configs: 'Allows power users to manage reusable LinkedIn candidate search presets.',
  job_position_provider_configs: 'Allows job-position provider presets for external job sourcing configuration.',
  kpmg_provider_flows: 'Allows KPMG-specific recruitment board provider and connector workflows.',
};
