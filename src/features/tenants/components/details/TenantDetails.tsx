'use client';

import { Stack } from '@mui/material';
import { AudioConsole, Document, IbmCloudHyperProtectCryptoServices, SettingsServices } from '@carbon/icons-react';
import { Tenant } from '@/features/tenants/interfaces/tenant.interface';
import { TenantViewLayout } from '@/features/tenants/components/common/TenantViewLayout';
import { GeneralDetailsData, GeneralDetailsView } from '@/features/tenants/components/common/GeneralDetailsView';
import { BrandAndThemingData, BrandAndThemingView } from '@/features/tenants/components/common/BrandAndThemingView';
import { AIServicesData, AIServicesView } from '@/features/tenants/components/common/AIServicesView';
import { SSOData, SSOView } from '@/features/tenants/components/common/SSOView';
import { DocumentsData, DocumentsView } from '@/features/tenants/components/common/DocumentsView';

interface TenantDetailsProps {
  tenant: Tenant;
}

export const TenantDetails = ({ tenant }: TenantDetailsProps) => {
  const generalDetails: GeneralDetailsData = {
    company_name: tenant.company_name,
    domain: tenant.domain,
    settings: {
      preferred_currency: tenant.settings.preferred_currency,
      preferred_timezone: tenant.settings.preferred_timezone,
    },
  };

  const brandAndTheming: BrandAndThemingData = {
    settings: {
      theme: tenant.settings.theme,
      theme_color: tenant.settings.theme_color,
      default_theme_mode: tenant.settings.default_theme_mode,
      logos: {
        light: tenant.settings.logos.light,
        dark: tenant.settings.logos.dark,
      },
    }
  };

  const aiServices: AIServicesData = {
    ai_config: { ...tenant.ai_config }
  };

  const sso: SSOData = {
    sso_config: { ...tenant.sso_config }
  };

  const documentTypes: DocumentsData = {
    document_types: [...tenant.document_types]
  };

  return (
    <Stack gap={2}>
      <TenantViewLayout
        title="General Details"
        icon={<AudioConsole size={24} />}
      >
        <GeneralDetailsView data={generalDetails} />
      </TenantViewLayout>

      <TenantViewLayout
        title="Brand & Theming"
        icon={<AudioConsole size={24} />}
      >
        <BrandAndThemingView data={brandAndTheming} />
      </TenantViewLayout>

      <TenantViewLayout
        title="AI Services"
        icon={<SettingsServices size={24} />}
      >
        <AIServicesView data={aiServices} />
      </TenantViewLayout>

      <TenantViewLayout
        title="AI Services"
        icon={<IbmCloudHyperProtectCryptoServices size={24} />}
      >
        <SSOView data={sso} />
      </TenantViewLayout>

      <TenantViewLayout
        title="Documents"
        icon={<Document size={24} />}
      >
        <DocumentsView data={documentTypes} />
      </TenantViewLayout>
    </Stack>
  );
}; 
