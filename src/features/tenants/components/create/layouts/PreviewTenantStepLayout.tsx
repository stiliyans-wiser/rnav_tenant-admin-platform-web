import { Button, Paper, Stack, Typography } from '@mui/material';
import { Edit } from '@carbon/icons-react';
import { CreateTenantPreviewProps } from '@/features/tenants/interfaces/create-tenant-preview-props.interface';

interface PreviewTenantStepLayoutProps extends CreateTenantPreviewProps {
  stepTitle: string;
  stepIcon: React.ReactNode;
  children: React.ReactNode;
}

export const PreviewTenantStepLayout = ({
  onEdit,
  stepTitle,
  stepIcon,
  children,
}: PreviewTenantStepLayoutProps) => {
  return (
    <Paper variant="outlined" sx={{ height: '100%', p: 3 }}>
      <Stack gap={2} sx={{ height: '100%', justifyContent: 'space-between' }}>
        <Stack
          direction="row"
          sx={{ alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Stack direction="row" gap={1} sx={{ alignItems: 'center' }}>
            {stepIcon}
            <Typography variant="h6">{stepTitle}</Typography>
          </Stack>

          <Button
            startIcon={<Edit size={20} />}
            onClick={() => onEdit(stepTitle)}
          >
            Edit
          </Button>
        </Stack>

        <Stack>{children}</Stack>
      </Stack>
    </Paper>
  );
};
