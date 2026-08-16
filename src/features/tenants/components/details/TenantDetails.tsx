'use client';

import { useState } from 'react';
import { Stack } from '@mui/material';
import { AudioConsole, Document, IbmCloudHyperProtectCryptoServices, SettingsServices } from '@carbon/icons-react';
import { Tenant } from '@/features/tenants/interfaces/tenant.interface';
import { TenantViewLayout } from '@/features/tenants/components/common/view/TenantViewLayout';
import { GeneralDetailsData, GeneralDetailsView } from '@/features/tenants/components/common/view/GeneralDetailsView';
import { BrandAndThemingData, BrandAndThemingView } from '@/features/tenants/components/common/view/BrandAndThemingView';
import { AIServicesData, AIServicesView } from '@/features/tenants/components/common/view/AIServicesView';
import { ProviderFeatureFlagsData, ProviderFeatureFlagsView } from '@/features/tenants/components/common/view/ProviderFeatureFlagsView';
import { SSOData, SSOView } from '@/features/tenants/components/common/view/SSOView';
import { DocumentsData, DocumentsView } from '@/features/tenants/components/common/view/DocumentsView';
import { ExtractionData, ExtractionView } from '@/features/tenants/components/common/view/ExtractionView';
import { UIConfigData, UIConfigView } from '@/features/tenants/components/common/view/UIConfigView';
import { TalentAutomationData, TalentAutomationView } from '@/features/tenants/components/common/view/TalentAutomationView';
import { MatchingControlsData, MatchingControlsView } from '@/features/tenants/components/common/view/MatchingControlsView';
import { AutoReplacementData, AutoReplacementView } from '@/features/tenants/components/common/view/AutoReplacementView';
import { ScoringTemplatesPanel } from '@/features/tenants/components/common/view/ScoringTemplatesPanel';
import { ConnectorConfigPanel } from '@/features/tenants/components/common/view/ConnectorConfigPanel';
import { CrawlerSettingsPanel } from '@/features/tenants/components/common/view/CrawlerSettingsPanel';
import { CandidateImportSourcesPanel } from '@/features/tenants/components/common/view/CandidateImportSourcesPanel';
import { ProviderQuotasPanel } from '@/features/tenants/components/common/view/ProviderQuotasPanel';
import { CustomDrawer } from '@/features/common/components/drawers/CustomDrawer';
import { EditTenant } from '@/features/tenants/components/edit/EditTenant';
import { DocumentType } from '@/features/document-types/interfaces/document-type.interface';
import { TenantSectionTitlesEnum } from '@/features/tenants/enums/tenant-section-titles.enum';
import { DEFAULT_PROVIDER_FEATURE_FLAGS } from '@/features/tenants/interfaces/provider-feature-flags.interface';
import { useGetTenantProviderFeatureFlagAudit } from '@/features/tenants/hooks/useGetTenantProviderFeatureFlagAudit';

interface TenantDetailsProps {
  tenant: Tenant;
}

export const TenantDetails = ({ tenant }: TenantDetailsProps) => {
  const [currentSectionTitle, setCurrentSectionTitle] = useState<TenantSectionTitlesEnum>(null);
  const [editDrawerOpen, setEditDrawerOpen] = useState<boolean>(false);
  const [defaultValues, setDefaultValues] = useState<any>(null);
  const { data: providerFeatureFlagAudit, isLoading: isProviderFeatureFlagAuditLoading } = useGetTenantProviderFeatureFlagAudit(tenant.id);

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

  const providerFeatureFlags: ProviderFeatureFlagsData = {
    company_name: tenant.company_name,
    provider_feature_flags: {
      ...DEFAULT_PROVIDER_FEATURE_FLAGS,
      ...tenant.provider_feature_flags,
    },
    audit: providerFeatureFlagAudit,
    auditLoading: isProviderFeatureFlagAuditLoading,
  };

  const sso: SSOData = {
    company_name: tenant.company_name,
    sso_config: { ...tenant.sso_config },
  };

  const documentTypes: DocumentsData = {
    company_name: tenant.company_name,
    document_types: tenant.document_types?.map((doc: DocumentType) => JSON.stringify(doc)),
  };

  const extraction: ExtractionData = {
    company_name: tenant.company_name,
    extraction_config: tenant.extraction_config,
  };

  const uiConfig: UIConfigData = {
    company_name: tenant.company_name,
    match_config: tenant.match_config,
  };

  const talentAutomation: TalentAutomationData = {
    company_name: tenant.company_name,
    talent_automation_config: tenant.talent_automation_config,
  };

  const matchingControls: MatchingControlsData = {
    company_name: tenant.company_name,
    match_config: tenant.match_config,
  };

  const autoReplacement: AutoReplacementData = {
    company_name: tenant.company_name,
    auto_replacement_config: tenant.auto_replacement_config,
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
          title={TenantSectionTitlesEnum.PROVIDER_FEATURE_FLAGS}
          icon={<SettingsServices size={24} />}
          onEdit={() => openEditDrawer(TenantSectionTitlesEnum.PROVIDER_FEATURE_FLAGS, providerFeatureFlags)}
        >
          <ProviderFeatureFlagsView data={providerFeatureFlags} />
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

        <TenantViewLayout
          title={TenantSectionTitlesEnum.MATCHING_CONTROLS}
          icon={<SettingsServices size={24} />}
          onEdit={() => openEditDrawer(TenantSectionTitlesEnum.MATCHING_CONTROLS, matchingControls)}
        >
          <MatchingControlsView data={matchingControls} />
        </TenantViewLayout>

        <TenantViewLayout
          title={TenantSectionTitlesEnum.EXTRACTION}
          icon={<SettingsServices size={24} />}
          onEdit={() => openEditDrawer(TenantSectionTitlesEnum.EXTRACTION, extraction)}
        >
          <ExtractionView data={extraction} />
        </TenantViewLayout>

        <TenantViewLayout
          title={TenantSectionTitlesEnum.UI_CONFIG}
          icon={<SettingsServices size={24} />}
          onEdit={() => openEditDrawer(TenantSectionTitlesEnum.UI_CONFIG, uiConfig)}
        >
          <UIConfigView data={uiConfig} />
        </TenantViewLayout>

        <TenantViewLayout
          title={TenantSectionTitlesEnum.TALENT_AUTOMATION}
          icon={<SettingsServices size={24} />}
          onEdit={() => openEditDrawer(TenantSectionTitlesEnum.TALENT_AUTOMATION, talentAutomation)}
        >
          <TalentAutomationView data={talentAutomation} />
        </TenantViewLayout>

        <TenantViewLayout
          title={TenantSectionTitlesEnum.AUTO_REPLACEMENT}
          icon={<SettingsServices size={24} />}
          onEdit={() => openEditDrawer(TenantSectionTitlesEnum.AUTO_REPLACEMENT, autoReplacement)}
        >
          <AutoReplacementView data={autoReplacement} />
        </TenantViewLayout>

        <TenantViewLayout
          title={TenantSectionTitlesEnum.SCORING_TEMPLATES}
          icon={<SettingsServices size={24} />}
        >
          <ScoringTemplatesPanel tenantId={tenant.id!} />
        </TenantViewLayout>

        <TenantViewLayout
          title={TenantSectionTitlesEnum.CONNECTOR_SETTINGS}
          icon={<SettingsServices size={24} />}
        >
          <ConnectorConfigPanel tenantId={tenant.id!} />
        </TenantViewLayout>

        <TenantViewLayout
          title={TenantSectionTitlesEnum.CLIENT_PIPELINE}
          icon={<SettingsServices size={24} />}
        >
          <CrawlerSettingsPanel tenantId={tenant.id!} />
        </TenantViewLayout>

        <TenantViewLayout
          title={TenantSectionTitlesEnum.CANDIDATE_IMPORT_SOURCES}
          icon={<SettingsServices size={24} />}
        >
          <CandidateImportSourcesPanel tenantId={tenant.id!} tenant={tenant} />
        </TenantViewLayout>

        <TenantViewLayout
          title={TenantSectionTitlesEnum.PROVIDER_QUOTAS}
          icon={<SettingsServices size={24} />}
        >
          <ProviderQuotasPanel tenantId={tenant.id!} />
        </TenantViewLayout>
      </Stack>

      <CustomDrawer open={editDrawerOpen} drawerSxProps={{ width: '40%' }} title={currentSectionTitle} handleClose={handleCloseEditDrawer}>
        <EditTenant title={currentSectionTitle} tenantId={tenant.id} defaultValues={defaultValues} handleClose={handleCloseEditDrawer} />
      </CustomDrawer>
    </>
  );
};
