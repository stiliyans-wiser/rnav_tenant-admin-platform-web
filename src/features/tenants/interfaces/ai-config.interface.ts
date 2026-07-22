export interface AIConfig {
  open_ai_type: string;
  open_ai_embedding_model: string;
  temperature: number;
  open_ai_key: string | null;
  open_ai_endpoint: string;
  open_ai_version: string;
  web_search: boolean;
  has_open_ai_key?: boolean;
  has_tavily_api_key?: boolean;
}
