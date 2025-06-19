import { DocumentType } from '@/features/document-types/interfaces/document-type.interface';
import { TenantLogo } from '@/features/tenants/interfaces/tenant-logo.interface';
import { AIConfig } from '@/features/tenants/interfaces/ai-config.interface';
import { SSOConfig } from '@/features/tenants/interfaces/sso-config.interface';

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
  ai_config: AIConfig;
  sso_config: SSOConfig;
  document_types: DocumentType[];
}
