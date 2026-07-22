import { DocumentType } from '@/features/document-types/interfaces/document-type.interface';
import { AIConfig } from '@/features/tenants/interfaces/ai-config.interface';
import { SSOConfig } from '@/features/tenants/interfaces/sso-config.interface';
import { TenantSettings } from '@/features/tenants/interfaces/tenant-settings.interface';
import { ChatStrategyEnum } from '@/features/tenants/enums/chat-strategy.enum';
import { MatchConfig } from '@/features/tenants/interfaces/match-config.interface';
import { ProviderFeatureFlags } from '@/features/tenants/interfaces/provider-feature-flags.interface';

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
}

export interface TenantForm extends Omit<Tenant, 'document_types' | 'integrations'> {
  document_types: string[];
  integrations: string[];
}
