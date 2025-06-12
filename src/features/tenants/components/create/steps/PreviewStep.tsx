import { Button, Paper, Stack } from '@mui/material';
import { GeneralDetailsPreview } from '@/features/tenants/components/create/preview/GeneralDetailsPreview';
import { BrandAndThemingPreview } from '@/features/tenants/components/create/preview/BrandAndThemingPreview';
import { AIServicesPreview } from '@/features/tenants/components/create/preview/AIServicesPreview';
import { SSOPreview } from '@/features/tenants/components/create/preview/SSOPreview';
import { CreateTenantPreviewProps } from '@/features/tenants/interfaces/create-tenant-preview-props.interface';
import { DocumentsPreview } from '@/features/tenants/components/create/preview/DocumentsPreview';

interface PreviewStepProps extends CreateTenantPreviewProps {
  onNext: (hasError: boolean) => void;
  onBack: (hasError: boolean) => void;
}

export const PreviewStep = ({ onBack, onNext, onEdit }: PreviewStepProps) => {
  return (
    <Stack gap={2} sx={{ height: '100%' }}>
      <Stack gap={2} sx={{ overflow: 'auto' }}>
        <GeneralDetailsPreview onEdit={onEdit} />
        <BrandAndThemingPreview onEdit={onEdit} />
        <AIServicesPreview onEdit={onEdit} />
        <SSOPreview onEdit={onEdit} />
        <DocumentsPreview onEdit={onEdit} />
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
