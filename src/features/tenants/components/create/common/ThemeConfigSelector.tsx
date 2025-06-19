import { Stack, Typography } from '@mui/material';

interface ThemeConfigurationSelectorProps {
  icon: React.ReactNode;
  label: string;
}

export const ThemeConfigSelector = ({ icon, label }: ThemeConfigurationSelectorProps) => (
  <Stack direction="row" gap={1} sx={{ alignItems: 'center' }}>
    {icon}
    <Typography>{label}</Typography>
  </Stack>
);
