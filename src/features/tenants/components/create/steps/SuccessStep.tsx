import { useFormContext } from 'react-hook-form';
import Image from 'next/image';
import { Alert, AlertTitle, Button, Divider, Paper, Stack, Typography } from '@mui/material';
import { CheckmarkOutline, Launch, OrderDetails } from '@carbon/icons-react';
import { SuccessInfoRow } from '@/features/tenants/components/create/common/SuccessInfoRow';
import lightThemeLogo from '@/assets/logo-light-theme.png';

export const SuccessStep = () => {
  const { getValues } = useFormContext();
  const formValues = getValues();

  const logoData = formValues.settings.logos?.light;
  const logoDataSrc = logoData ? `data:${logoData.file_type};base64,${logoData.content_base64}` : lightThemeLogo;

  const createdDate = new Date().toLocaleString();

  const goToTenantDomain = () => {
    const domain = formValues.domain;
    const url = domain.startsWith('http') ? domain : `http://${domain}`;
    window.open(url, '_blank');
  };

  return (
    <Paper variant="outlined" sx={{ height: '100%' }}>
      <Stack sx={{ height: '100%', overflow: 'auto' }}>
        <Alert severity="success" icon={<CheckmarkOutline size={22} />} sx={{ paddingX: 3, paddingY: 2 }}>
          <AlertTitle>Tenant successfully created</AlertTitle>
          Your tenant is set up and ready to use
        </Alert>

        <Stack sx={{ p: 3, justifyContent: 'space-between', flex: 1 }}>
          <Stack gap={3}>
            <Stack direction="row" gap={1} sx={{ alignItems: 'center' }}>
              <OrderDetails size={24} />
              <Typography variant="h6">Tenant Details</Typography>
            </Stack>

            <SuccessInfoRow label="Logo" value={<Image width={120} height={60} src={logoDataSrc} alt="Logo" />} />
            <SuccessInfoRow label="Company name" value={formValues.company_name} />
            <SuccessInfoRow label="Tenant ID" value={formValues.sso_config.tenant_id} />
            <SuccessInfoRow
              label="Domain"
              value={
                <Stack direction="row" gap={2} sx={{ cursor: 'pointer' }} onClick={goToTenantDomain}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {formValues.domain}
                  </Typography>
                  <Launch size={24} />
                </Stack>
              }
            />
            <SuccessInfoRow label="Initial users" value="1" />
            <SuccessInfoRow label="Date created" value={createdDate} />
          </Stack>

          <Stack gap={2}>
            <Divider />
            <Button
              variant="contained"
              startIcon={<Launch size={24} />}
              sx={{
                justifyContent: 'flex-start',
              }}
              onClick={goToTenantDomain}
            >
              Visit tenant portal
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};
