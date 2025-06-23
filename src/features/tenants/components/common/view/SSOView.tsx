import { IconButton, Stack, Typography } from '@mui/material';
import { CheckmarkFilled, Misuse } from '@carbon/icons-react';
import { SSOConfig } from '@/features/tenants/interfaces/sso-config.interface';

export interface SSOData {
  company_name: string;
  sso_config: SSOConfig;
}

interface SSOViewProps {
  data: SSOData;
}

export const SSOView = ({ data }: SSOViewProps) => {
  return (
    <Stack gap={4}>
      <Stack direction="row" gap={3}>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">SSO type</Typography>
          <Typography variant="subtitle2">{data.sso_config.type}</Typography>
        </Stack>

        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Enabled</Typography>
          <Typography variant="subtitle2">
            {data.sso_config.enabled ? (
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
          <Typography variant="subtitle2">{data.sso_config.tenant_id}</Typography>
        </Stack>

        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Client ID</Typography>
          <Typography variant="subtitle2">{data.sso_config.client_id}</Typography>
        </Stack>
      </Stack>

      <Stack direction="row" gap={3}>
        <Stack gap={1}>
          <Typography variant="caption">Client secret</Typography>
          <Typography variant="subtitle2" sx={{ wordBreak: 'break-all' }}>
            {data.sso_config.client_secret}
          </Typography>
        </Stack>
      </Stack>

      <Stack direction="row" gap={3}>
        <Stack gap={1}>
          <Typography variant="caption">Scopes</Typography>
          <Typography variant="subtitle2" sx={{ wordBreak: 'break-all' }}>
            {data.sso_config.scopes}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};
