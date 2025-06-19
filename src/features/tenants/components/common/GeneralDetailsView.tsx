import { Stack, Typography } from '@mui/material';

export interface GeneralDetailsData {
  company_name: string;
  domain: string;
  settings: {
    preferred_currency: string;
    preferred_timezone: string;
  };
}

interface GeneralDetailsViewProps {
  data: GeneralDetailsData;
}

export const GeneralDetailsView = ({ data }: GeneralDetailsViewProps) => {
  return (
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
  );
};
