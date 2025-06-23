import { Paper, Stack, Typography, Button } from '@mui/material';
import { Edit } from '@carbon/icons-react';
import React from 'react';

interface TenantViewLayoutProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onEdit?: () => void;
}

export const TenantViewLayout = ({ title, icon, children, onEdit }: TenantViewLayoutProps) => {
  return (
    <Paper variant="outlined" sx={{ height: '100%', p: 3 }}>
      <Stack gap={2} sx={{ height: '100%', justifyContent: 'space-between' }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" gap={1} sx={{ alignItems: 'center' }}>
            {icon}
            <Typography variant="h6">{title}</Typography>
          </Stack>

          <Button startIcon={<Edit size={20} />} onClick={onEdit}>
            Edit
          </Button>
        </Stack>

        <Stack>{children}</Stack>
      </Stack>
    </Paper>
  );
};
