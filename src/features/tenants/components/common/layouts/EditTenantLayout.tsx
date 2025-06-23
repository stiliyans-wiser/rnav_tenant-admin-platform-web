import { Button, Divider, Stack } from '@mui/material';

interface EditTenantProps {
  children: React.ReactNode;
  isSaveButtonDisabled: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export const EditTenantLayout = ({ children, isSaveButtonDisabled, onSave, onCancel }: EditTenantProps) => {
  return (
    <Stack sx={{ justifyContent: 'space-between', flex: 1 }}>
      <Stack>{children}</Stack>

      <Stack>
        <Divider sx={{ marginY: 3 }} />
        <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="contained" type="button" disabled={isSaveButtonDisabled} onClick={onSave}>
            Save
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};
