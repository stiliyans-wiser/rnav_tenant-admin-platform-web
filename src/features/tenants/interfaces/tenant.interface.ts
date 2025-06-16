import { DocumentType } from '@/features/document-types/interfaces/document-type.interface';
import { TenantLogo } from '@/features/tenants/interfaces/tenant-logo.interface';

export interface Tenant {
  id?: string;
  company_name: string;
  domain: string;
  settings: {
    preferred_currency: string;
    preferred_timezone: string;
    theme: string;
    theme_color: string;
    default_theme_mode: string;
    logos: {
      light?: TenantLogo;
      dark?: TenantLogo;
    };
    has_dark_logo?: boolean;
  };
  ai_config: {
    open_ai_type: string;
    open_ai_embedding_model: string;
    temperature: number;
    open_ai_key: string;
    open_ai_endpoint: string;
    open_ai_version: string;
    web_search: boolean;
  };
  sso_config: {
    type: string;
    enabled: boolean;
    tenant_id: string;
    client_id: string;
    client_secret: string;
    scopes: string;
  };
  document_types: DocumentType[];
}
