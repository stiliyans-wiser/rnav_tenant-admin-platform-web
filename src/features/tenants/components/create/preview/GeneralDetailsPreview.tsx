import { useFormContext } from 'react-hook-form';
import { Stack, Typography } from '@mui/material';
import { AudioConsole } from '@carbon/icons-react';
import { PreviewTenantStepLayout } from '@/features/tenants/components/create/layouts/PreviewTenantStepLayout';
import { CreateTenantPreviewProps } from '@/features/tenants/interfaces/create-tenant-preview-props.interface';

export const GeneralDetailsPreview = ({ onEdit }: CreateTenantPreviewProps) => {
  const { getValues } = useFormContext();
  const formValues = getValues();

  return (
    <PreviewTenantStepLayout
      stepTitle="General Details"
      stepIcon={<AudioConsole size={24} />}
      onEdit={onEdit}
    >
      <Stack direction="row" gap={3}>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Company name</Typography>
          <Typography variant="subtitle2">{formValues.company_name}</Typography>
        </Stack>

        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Domain name</Typography>
          <Typography variant="subtitle2">{formValues.domain}</Typography>
        </Stack>

        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Preferred currency</Typography>
          <Typography variant="subtitle2">
            {formValues.settings.preferred_currency}
          </Typography>
        </Stack>

        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Preferred timezone</Typography>
          <Typography variant="subtitle2">
            {formValues.settings.preferred_timezone}
          </Typography>
        </Stack>
      </Stack>
    </PreviewTenantStepLayout>
  );
};
