import { AIConfig } from '@/features/tenants/interfaces/ai-config.interface';
import { MatchConfig } from '@/features/tenants/interfaces/match-config.interface';

export interface AdminConfig {
  theme_modes: string[];
  document_column_types: string[];
  ai_providers: string[];
  embedding_types: string[];
  theme_colors: string[];
  sso_providers: string[];
  themes: string[];
  document_data_sources: string[];
  chat_strategy: string[];
  integrations: string[];
  time_periods: string[];
  ai_defaults?: Partial<AIConfig> & Pick<Partial<MatchConfig>, 'top_k'>;
}
