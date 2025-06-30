import { DocumentType } from '@/features/document-types/interfaces/document-type.interface';
import { AIConfig } from '@/features/tenants/interfaces/ai-config.interface';
import { SSOConfig } from '@/features/tenants/interfaces/sso-config.interface';
import { TenantSettings } from '@/features/tenants/interfaces/tenant-settings.interface';

export interface Tenant {
  id?: string;
  company_name: string;
  domain: string;
  settings: TenantSettings;
  ai_config: AIConfig;
  sso_config: SSOConfig | null;
  document_types: DocumentType[];
  document_data_sources: string[];
}

export interface TenantForm extends Omit<Tenant, 'document_types'> {
  document_types: string[];
}
