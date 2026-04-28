'use client';

import { useState } from 'react';
import { Stack } from '@mui/material';
import { AudioConsole, Document, IbmCloudHyperProtectCryptoServices, SettingsServices } from '@carbon/icons-react';
import { Tenant } from '@/features/tenants/interfaces/tenant.interface';
import { TenantViewLayout } from '@/features/tenants/components/common/view/TenantViewLayout';
import { GeneralDetailsData, GeneralDetailsView } from '@/features/tenants/components/common/view/GeneralDetailsView';
import { BrandAndThemingData, BrandAndThemingView } from '@/features/tenants/components/common/view/BrandAndThemingView';
import { AIServicesData, AIServicesView } from '@/features/tenants/components/common/view/AIServicesView';
import { SSOData, SSOView } from '@/features/tenants/components/common/view/SSOView';
import { DocumentsData, DocumentsView } from '@/features/tenants/components/common/view/DocumentsView';
import { CustomDrawer } from '@/features/common/components/drawers/CustomDrawer';
import { EditTenant } from '@/features/tenants/components/edit/EditTenant';
import { DocumentType } from '@/features/document-types/interfaces/document-type.interface';
import { TenantSectionTitlesEnum } from '@/features/tenants/enums/tenant-section-titles.enum';

interface TenantDetailsProps {
  tenant: Tenant;
}

export const TenantDetails = ({ tenant }: TenantDetailsProps) => {
  const [currentSectionTitle, setCurrentSectionTitle] = useState<TenantSectionTitlesEnum>(null);
  const [editDrawerOpen, setEditDrawerOpen] = useState<boolean>(false);
  const [defaultValues, setDefaultValues] = useState<any>(null);

  const generalDetails: GeneralDetailsData = {
    company_name: tenant.company_name,
    domain: tenant.domain,
    integrations: tenant.integrations ? Object.keys(tenant.integrations) : [],
    settings: {
      ...tenant.settings,
      logos: {
        ...tenant.settings.logos,
      },
    },
    document_data_sources: tenant.document_data_sources,
    chat_strategy: tenant.chat_strategy,
  };

  const brandAndTheming: BrandAndThemingData = {
    company_name: tenant.company_name,
    settings: {
      ...tenant.settings,
      logos: {
        ...tenant.settings.logos,
      },
    },
  };

  const aiServices: AIServicesData = {
    company_name: tenant.company_name,
    ai_config: { ...tenant.ai_config },
    match_config: tenant.match_config ? { ...tenant.match_config } : { top_k: 50 },
  };

  const sso: SSOData = {
    company_name: tenant.company_name,
    sso_config: { ...tenant.sso_config },
  };

  const documentTypes: DocumentsData = {
    company_name: tenant.company_name,
    document_types: tenant.document_types?.map((doc: DocumentType) => JSON.stringify(doc)),
  };

  const openEditDrawer = (sectionTitle: TenantSectionTitlesEnum, data: any) => {
    setCurrentSectionTitle(sectionTitle);
    setDefaultValues(data);
    setEditDrawerOpen(true);
  };

  const handleCloseEditDrawer = () => {
    setCurrentSectionTitle(null);
    setDefaultValues(null);
    setEditDrawerOpen(false);
  };

  return (
    <>
      <Stack gap={2}>
        <TenantViewLayout
          title={TenantSectionTitlesEnum.GENERAL_DETAILS}
          icon={<AudioConsole size={24} />}
          onEdit={() => openEditDrawer(TenantSectionTitlesEnum.GENERAL_DETAILS, generalDetails)}
        >
          <GeneralDetailsView data={generalDetails} />
        </TenantViewLayout>

        <TenantViewLayout
          title={TenantSectionTitlesEnum.BRAND_AND_THEMING}
          icon={<AudioConsole size={24} />}
          onEdit={() => openEditDrawer(TenantSectionTitlesEnum.BRAND_AND_THEMING, brandAndTheming)}
        >
          <BrandAndThemingView data={brandAndTheming} />
        </TenantViewLayout>

        <TenantViewLayout
          title={TenantSectionTitlesEnum.AI_SERVICES}
          icon={<SettingsServices size={24} />}
          onEdit={() => openEditDrawer(TenantSectionTitlesEnum.AI_SERVICES, aiServices)}
        >
          <AIServicesView data={aiServices} />
        </TenantViewLayout>

        <TenantViewLayout
          title={TenantSectionTitlesEnum.SSO}
          icon={<IbmCloudHyperProtectCryptoServices size={24} />}
          onEdit={() => openEditDrawer(TenantSectionTitlesEnum.SSO, sso)}
        >
          <SSOView data={sso} />
        </TenantViewLayout>

        <TenantViewLayout
          title={TenantSectionTitlesEnum.DOCUMENTS}
          icon={<Document size={24} />}
          onEdit={() => openEditDrawer(TenantSectionTitlesEnum.DOCUMENTS, documentTypes)}
        >
          <DocumentsView data={documentTypes} />
        </TenantViewLayout>
      </Stack>

      <CustomDrawer open={editDrawerOpen} drawerSxProps={{ width: '40%' }} title={currentSectionTitle} handleClose={handleCloseEditDrawer}>
        <EditTenant title={currentSectionTitle} tenantId={tenant.id} defaultValues={defaultValues} handleClose={handleCloseEditDrawer} />
      </CustomDrawer>
    </>
  );
};
