import { Stack, Typography } from '@mui/material';

interface SuccessInfoRowProps {
  label: string;
  value: any;
}

export const SuccessInfoRow = ({ label, value }: SuccessInfoRowProps) => (
  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
    <Typography variant="caption">{label}</Typography>
    <Typography variant="body1" component="div" sx={{ fontWeight: 600 }}>
      {value}
    </Typography>
  </Stack>
);
