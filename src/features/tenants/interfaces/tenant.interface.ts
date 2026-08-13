import { DocumentType } from '@/features/document-types/interfaces/document-type.interface';
import { AIConfig } from '@/features/tenants/interfaces/ai-config.interface';
import { SSOConfig } from '@/features/tenants/interfaces/sso-config.interface';
import { TenantSettings } from '@/features/tenants/interfaces/tenant-settings.interface';
import { ChatStrategyEnum } from '@/features/tenants/enums/chat-strategy.enum';
import { MatchConfig } from '@/features/tenants/interfaces/match-config.interface';
import { ProviderFeatureFlags } from '@/features/tenants/interfaces/provider-feature-flags.interface';
import { ExtractionConfig } from '@/features/tenants/interfaces/extraction-config.interface';
import { TalentAutomationConfig } from '@/features/tenants/interfaces/talent-automation-config.interface';
import { AutoReplacementConfig } from '@/features/tenants/interfaces/auto-replacement-config.interface';
import { ScoringTemplate } from '@/features/tenants/interfaces/scoring-template.interface';
import { CandidateImportSourceConfig } from '@/features/tenants/interfaces/candidate-provider.interface';

export interface Tenant {
  id?: string;
  company_name: string;
  domain: string;
  integrations: Record<string, any>;
  settings: TenantSettings;
  ai_config: AIConfig;
  sso_config: SSOConfig | null;
  document_types: DocumentType[];
  document_data_sources: string[];
  chat_strategy: ChatStrategyEnum;
  match_config?: MatchConfig;
  provider_feature_flags?: ProviderFeatureFlags;
  extraction_config?: ExtractionConfig;
  talent_automation_config?: TalentAutomationConfig;
  auto_replacement_config?: AutoReplacementConfig;
  scoring_templates?: ScoringTemplate[];
  candidate_import_sources?: CandidateImportSourceConfig;
}

export interface TenantForm extends Omit<Tenant, 'document_types' | 'integrations'> {
  document_types: string[];
  integrations: string[];
}
