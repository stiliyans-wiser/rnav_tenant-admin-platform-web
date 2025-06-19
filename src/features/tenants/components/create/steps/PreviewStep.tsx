import { Button, Paper, Stack } from '@mui/material';
import { TenantPreviewProps } from '@/features/tenants/interfaces/tenant-preview-props.interface';
import { useFormContext } from 'react-hook-form';
import { GeneralDetailsData, GeneralDetailsView } from '@/features/tenants/components/common/GeneralDetailsView';
import { TenantViewLayout } from '@/features/tenants/components/common/TenantViewLayout';
import {
  AudioConsole, Document,
  IbmCloudHyperProtectCryptoServices,
  SettingsServices,
  VisualRecognition,
} from '@carbon/icons-react';
import { BrandAndThemingData, BrandAndThemingView } from '@/features/tenants/components/common/BrandAndThemingView';
import { AIServicesData, AIServicesView } from '@/features/tenants/components/common/AIServicesView';
import { SSOData, SSOView } from '@/features/tenants/components/common/SSOView';
import { DocumentsData, DocumentsView } from '@/features/tenants/components/common/DocumentsView';
import React from 'react';
import { useCreateTenantContext } from '@/features/tenants/contexts/CreateTenantContext';

interface PreviewStepProps extends TenantPreviewProps {
  onNext: (hasError: boolean) => void;
  onBack: (hasError: boolean) => void;
}

export const PreviewStep = ({ onBack, onNext, onEdit }: PreviewStepProps) => {
  const { getValues } = useFormContext();

  const { selectedDocumentTypes } = useCreateTenantContext();
  const documentTypes = {
    document_types: selectedDocumentTypes,
  } as DocumentsData;

  const generalDetailsFormValues = getValues() as GeneralDetailsData;
  const brandAndThemingFormValues = getValues() as BrandAndThemingData;
  const aiServicesFormValues = getValues() as AIServicesData;
  const ssoFormValues = getValues() as SSOData;

  return (
    <Stack gap={2} sx={{ height: '100%' }}>
      <Stack gap={2} sx={{ overflow: 'auto' }}>
        <TenantViewLayout
          title="General Details"
          icon={<AudioConsole size={24} />}
          hasEditButton={true}
          onEdit={() => onEdit('General Details')}
        >
          <GeneralDetailsView data={generalDetailsFormValues} />
        </TenantViewLayout>

        <TenantViewLayout
          title="Brand & Theming"
          icon={<VisualRecognition size={24} />}
          hasEditButton={true}
          onEdit={() => onEdit('Brand & Theming')}
        >
          <BrandAndThemingView data={brandAndThemingFormValues} />
        </TenantViewLayout>

        <TenantViewLayout
          title="AI Services"
          icon={<SettingsServices size={24} />}
          hasEditButton={true}
          onEdit={() => onEdit('AI Services')}
        >
          <AIServicesView data={aiServicesFormValues} />
        </TenantViewLayout>

        <TenantViewLayout
          title="SSO"
          icon={<IbmCloudHyperProtectCryptoServices size={24} />}
          hasEditButton={true}
          onEdit={() => onEdit('SSO')}
        >
          <SSOView data={ssoFormValues} />
        </TenantViewLayout>

        <TenantViewLayout
          title="Documents"
          icon={<Document size={24} />}
          hasEditButton={true}
          onEdit={() => onEdit('Documents')}
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
