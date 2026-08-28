export interface ProviderFeatureFlags {
  linkedin_candidate_sourcing: boolean;
  candidate_provider_configs: boolean;
  job_position_provider_configs: boolean;
  kpmg_provider_flows: boolean;
  a1_provider_flows: boolean;
  hlctech_provider_flows: boolean;
  jobs_bg_provider_flows: boolean;
  telus_digital_provider_flows: boolean;
  concentrix_provider_flows: boolean;
  avedo_provider_flows: boolean;
  dormakaba_provider_flows: boolean;
  gracher_provider_flows: boolean;
  solaredge_provider_flows: boolean;
  sutherland_provider_flows: boolean;
  postbank_provider_flows: boolean;
  commerzbank_provider_flows: boolean;
  ringcentral_provider_flows: boolean;
  cocacola_provider_flows: boolean;
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
  a1_provider_flows: false,
  hlctech_provider_flows: false,
  jobs_bg_provider_flows: false,
  telus_digital_provider_flows: false,
  concentrix_provider_flows: false,
  avedo_provider_flows: false,
  dormakaba_provider_flows: false,
  gracher_provider_flows: false,
  solaredge_provider_flows: false,
  sutherland_provider_flows: false,
  postbank_provider_flows: false,
  commerzbank_provider_flows: false,
  ringcentral_provider_flows: false,
  cocacola_provider_flows: false,
};

export const providerFeatureFlagLabels: Record<keyof ProviderFeatureFlags, string> = {
  linkedin_candidate_sourcing: 'LinkedIn job candidate search',
  candidate_provider_configs: 'LinkedIn saved candidate searches',
  job_position_provider_configs: 'Job position provider configuration',
  kpmg_provider_flows: 'KPMG connector flows',
  a1_provider_flows: 'A1 connector flows',
  hlctech_provider_flows: 'HLCTech connector flows',
  jobs_bg_provider_flows: 'Jobs.bg connector flows',
  telus_digital_provider_flows: 'Telus Digital connector flows',
  concentrix_provider_flows: 'Concentrix connector flows',
  avedo_provider_flows: 'Avedo connector flows',
  dormakaba_provider_flows: 'Dormakaba connector flows',
  gracher_provider_flows: 'Gracher connector flows',
  solaredge_provider_flows: 'SolarEdge connector flows',
  sutherland_provider_flows: 'Sutherland connector flows',
  postbank_provider_flows: 'Postbank connector flows',
  commerzbank_provider_flows: 'Commerzbank connector flows',
  ringcentral_provider_flows: 'RingCentral connector flows',
  cocacola_provider_flows: 'Coca-Cola connector flows',
};

export const providerFeatureFlagDescriptions: Record<keyof ProviderFeatureFlags, string> = {
  linkedin_candidate_sourcing: 'Shows job-detail LinkedIn candidate search and allows job-scoped sourcing requests.',
  candidate_provider_configs: 'Allows power users to manage reusable LinkedIn candidate search presets.',
  job_position_provider_configs: 'Allows job-position provider presets for external job sourcing configuration.',
  kpmg_provider_flows: 'Allows KPMG-specific recruitment board provider and connector workflows.',
  a1_provider_flows: 'Enables A1-specific provider and connector workflows for this tenant.',
  hlctech_provider_flows: 'Enables HLCTech-specific provider and connector workflows for this tenant.',
  jobs_bg_provider_flows: 'Enables Jobs.bg-specific provider and connector workflows for this tenant.',
  telus_digital_provider_flows: 'Enables the Telus Digital careers connector for this tenant.',
  concentrix_provider_flows: 'Enables the Concentrix careers connector for this tenant.',
  avedo_provider_flows: 'Enables the Avedo careers connector for this tenant.',
  dormakaba_provider_flows: 'Enables the Dormakaba careers connector for this tenant.',
  gracher_provider_flows: 'Enables the Gracher careers connector for this tenant.',
  solaredge_provider_flows: 'Enables the SolarEdge careers connector for this tenant.',
  sutherland_provider_flows: 'Enables the Sutherland careers connector for this tenant.',
  postbank_provider_flows: 'Enables the Postbank careers connector for this tenant.',
  commerzbank_provider_flows: 'Enables the Commerzbank careers connector for this tenant.',
  ringcentral_provider_flows: 'Enables the RingCentral (Workday) careers connector for this tenant.',
  cocacola_provider_flows: 'Enables the Coca-Cola (CCEP) careers connector for this tenant.',
};
