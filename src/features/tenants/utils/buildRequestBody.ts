import { DocumentType } from '@/features/document-types/interfaces/document-type.interface';
import { TenantSettings } from '@/features/tenants/interfaces/tenant-settings.interface';
import { SSOConfig } from '@/features/tenants/interfaces/sso-config.interface';
import { DocumentsDataSourceEnum } from '@/features/tenants/enums/documents-data-source.enum';

export const parseScopes = (scopesValue: string): any => {
  try {
    const parsedValue = JSON.parse(scopesValue);

    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch (error) {
    return [];
  }
};

export const parseDocumentTypes = (documentTypesValue: string[]): DocumentType[] => {
  try {
    return documentTypesValue.map((item: string) => JSON.parse(item)) || [];
  } catch (error) {
    return [];
  }
};

export const buildSSOConfigRequestBody = (ssoData: SSOConfig): SSOConfig | null => {
  // If SSO is disabled and all fields are empty, return null
  if (!ssoData.enabled) {
    const isEmpty = !ssoData.type && !ssoData.tenant_id && !ssoData.client_id && !ssoData.client_secret && !ssoData.scopes;
    if (isEmpty) {
      return null;
    }
  }

  return {
    ...ssoData,
    scopes: parseScopes(ssoData.scopes),
  };
};

export const buildThemingRequestBody = (tenantSettings: TenantSettings): TenantSettings => {
  if (!tenantSettings.logos?.light) {
    delete tenantSettings.logos;
  } else {
    if (!tenantSettings.logos?.dark) {
      tenantSettings.logos.dark = { ...tenantSettings.logos.light };
    }
  }

  delete tenantSettings.has_dark_logo;

  return tenantSettings;
};

export const buildDocumentDataSourcesRequestBody = (dataSourceValues: string[]): string[] => {
  if (!dataSourceValues || !dataSourceValues.length) {
    return Object.values(DocumentsDataSourceEnum);
  }

  return dataSourceValues;
};
