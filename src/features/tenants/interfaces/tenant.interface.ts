import { SearchConfig } from './search-config.interface';
import { AIConfig } from './ai-config.interface';
import { EmbeddingsConfig } from './embeddings-config.interface';
import { PromptConfig } from './prompt-config.interface';
import { DocumentConfig } from './document-config.interface';
import { FeaturesState } from './features-state.interface';
import { Settings } from './settings.interface';

export interface Tenant {
  id: string;
  company_name: string;
  domain: string;
  embeddings_config: EmbeddingsConfig;
  search_config: SearchConfig;
  sso_config: null;
  salesforce_config: null;
  ai_config: AIConfig;
  prompt_config: PromptConfig;
  settings: Settings;
  document_config: DocumentConfig;
  features_state: FeaturesState;
  available_features: string[];
  custom_document_metadata: null;
}
