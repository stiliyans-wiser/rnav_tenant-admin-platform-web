export interface CandidateProviderConfig {
  id: string;
  name: string;
  provider_type: string;
  auth_mode: string;
  filters: Record<string, any>;
  results_limit: number;
  is_default: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface CandidateImportSourceConfig {
  enabled_sources: string[];
}
