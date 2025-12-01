import React from 'react';
import { Button, Paper, Stack } from '@mui/material';
import { TenantPreviewProps } from '@/features/tenants/interfaces/tenant-preview-props.interface';
import { useFormContext } from 'react-hook-form';
import { GeneralDetailsData, GeneralDetailsView } from '@/features/tenants/components/common/view/GeneralDetailsView';
import { TenantViewLayout } from '@/features/tenants/components/common/view/TenantViewLayout';
import { AudioConsole, Document, IbmCloudHyperProtectCryptoServices, SettingsServices, VisualRecognition } from '@carbon/icons-react';
import { BrandAndThemingData, BrandAndThemingView } from '@/features/tenants/components/common/view/BrandAndThemingView';
import { AIServicesData, AIServicesView } from '@/features/tenants/components/common/view/AIServicesView';
import { SSOData, SSOView } from '@/features/tenants/components/common/view/SSOView';
import { DocumentsData, DocumentsView } from '@/features/tenants/components/common/view/DocumentsView';
import { TenantSectionTitlesEnum } from '@/features/tenants/enums/tenant-section-titles.enum';

interface PreviewStepProps extends TenantPreviewProps {
  onNext: (hasError: boolean) => void;
  onBack: (hasError: boolean) => void;
}

export const PreviewStep = ({ onBack, onNext, onEdit }: PreviewStepProps) => {
  const { getValues } = useFormContext();

  const generalDetailsFormValues = getValues() as GeneralDetailsData;
  const brandAndThemingFormValues = getValues() as BrandAndThemingData;
  const aiServicesFormValues = getValues() as AIServicesData;
  const ssoFormValues = getValues() as SSOData;
  const documentTypes: DocumentsData = getValues() as DocumentsData;

  return (
    <Stack gap={2} sx={{ height: '100%' }}>
      <Stack gap={2} sx={{ overflow: 'auto' }}>
        <TenantViewLayout
          title={TenantSectionTitlesEnum.GENERAL_DETAILS}
          icon={<AudioConsole size={24} />}
          onEdit={() => onEdit(TenantSectionTitlesEnum.GENERAL_DETAILS)}
        >
          <GeneralDetailsView data={generalDetailsFormValues} />
        </TenantViewLayout>

        <TenantViewLayout
          title={TenantSectionTitlesEnum.BRAND_AND_THEMING}
          icon={<VisualRecognition size={24} />}
          onEdit={() => onEdit(TenantSectionTitlesEnum.BRAND_AND_THEMING)}
        >
          <BrandAndThemingView data={brandAndThemingFormValues} />
        </TenantViewLayout>

        <TenantViewLayout
          title={TenantSectionTitlesEnum.AI_SERVICES}
          icon={<SettingsServices size={24} />}
          onEdit={() => onEdit(TenantSectionTitlesEnum.AI_SERVICES)}
        >
          <AIServicesView data={aiServicesFormValues} />
        </TenantViewLayout>

        <TenantViewLayout
          title={TenantSectionTitlesEnum.SSO}
          icon={<IbmCloudHyperProtectCryptoServices size={24} />}
          onEdit={() => onEdit(TenantSectionTitlesEnum.SSO)}
        >
          <SSOView data={ssoFormValues} />
        </TenantViewLayout>

        <TenantViewLayout
          title={TenantSectionTitlesEnum.DOCUMENTS}
          icon={<Document size={24} />}
          onEdit={() => onEdit(TenantSectionTitlesEnum.DOCUMENTS)}
        >
          <DocumentsView data={documentTypes} />
        </TenantViewLayout>
      </Stack>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
          <Button disabled onClick={() => onBack(false)}>
            Back
          </Button>

          <Button variant="contained" onClick={() => onNext(false)}>
            Create tenant
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
};
