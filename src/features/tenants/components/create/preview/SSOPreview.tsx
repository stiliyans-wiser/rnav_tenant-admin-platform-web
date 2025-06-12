import { useFormContext } from 'react-hook-form';
import { IconButton, Stack, Typography } from '@mui/material';
import {
  CheckmarkFilled,
  IbmCloudHyperProtectCryptoServices,
  Misuse,
} from '@carbon/icons-react';
import { PreviewTenantStepLayout } from '@/features/tenants/components/create/layouts/PreviewTenantStepLayout';
import { CreateTenantPreviewProps } from '@/features/tenants/interfaces/create-tenant-preview-props.interface';

export const SSOPreview = ({ onEdit }: CreateTenantPreviewProps) => {
  const { getValues } = useFormContext();
  const formValues = getValues();

  return (
    <PreviewTenantStepLayout
      stepTitle="SSO"
      stepIcon={<IbmCloudHyperProtectCryptoServices size={24} />}
      onEdit={onEdit}
    >
      <Stack gap={4}>
        <Stack direction="row" gap={3}>
          <Stack gap={1} sx={{ flex: 1 }}>
            <Typography variant="caption">SSO type</Typography>
            <Typography variant="subtitle2">
              {formValues.sso_config.type}
            </Typography>
          </Stack>

          <Stack gap={1} sx={{ flex: 1 }}>
            <Typography variant="caption">Enabled</Typography>
            <Typography variant="subtitle2">
              {formValues.sso_config.enabled ? (
                <IconButton color="primary" sx={{ p: 0 }}>
                  <CheckmarkFilled />
                </IconButton>
              ) : (
                <IconButton color="error" sx={{ p: 0 }}>
                  <Misuse />
                </IconButton>
              )}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" gap={3}>
          <Stack gap={1} sx={{ flex: 1 }}>
            <Typography variant="caption">Tenant ID</Typography>
            <Typography variant="subtitle2">
              {formValues.sso_config.tenant_id}
            </Typography>
          </Stack>

          <Stack gap={1} sx={{ flex: 1 }}>
            <Typography variant="caption">Client ID</Typography>
            <Typography variant="subtitle2">
              {formValues.sso_config.client_id}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" gap={3}>
          <Stack gap={1}>
            <Typography variant="caption">Client secret</Typography>
            <Typography variant="subtitle2" sx={{ wordBreak: 'break-all' }}>
              {formValues.sso_config.client_secret}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" gap={3}>
          <Stack gap={1}>
            <Typography variant="caption">Scopes</Typography>
            <Typography variant="subtitle2" sx={{ wordBreak: 'break-all' }}>
              {formValues.sso_config.scopes}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </PreviewTenantStepLayout>
  );
};
