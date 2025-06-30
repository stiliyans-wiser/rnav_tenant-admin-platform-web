import { Stack, Typography } from '@mui/material';
import { TenantSettings } from '@/features/tenants/interfaces/tenant-settings.interface';
import { DOCUMENT_DATA_SOURCE_LABELS } from '@/features/tenants/constants/messages.constants';

export interface GeneralDetailsData {
  company_name: string;
  domain: string;
  settings: TenantSettings;
  document_data_sources: string[];
}

interface GeneralDetailsViewProps {
  data: GeneralDetailsData;
}

export const GeneralDetailsView = ({ data }: GeneralDetailsViewProps) => {
  return (
    <Stack gap={4}>
      <Stack direction="row" gap={3}>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Company name</Typography>
          <Typography variant="subtitle2">{data.company_name}</Typography>
        </Stack>

        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Domain name</Typography>
          <Typography variant="subtitle2">{data.domain}</Typography>
        </Stack>

        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Preferred currency</Typography>
          <Typography variant="subtitle2">{data.settings.preferred_currency}</Typography>
        </Stack>

        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Preferred timezone</Typography>
          <Typography variant="subtitle2">{data.settings.preferred_timezone}</Typography>
        </Stack>
      </Stack>

      <Stack direction="row" gap={3}>
        <Stack gap={1} sx={{ flex: 1 }}>
          <Typography variant="caption">Selected document data sources</Typography>
          <Typography variant="subtitle2">
            {data.document_data_sources?.map(dataSource => DOCUMENT_DATA_SOURCE_LABELS[dataSource] || dataSource).join(', ')}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};
