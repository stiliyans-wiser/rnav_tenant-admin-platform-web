import React from 'react';
import { Stack, Typography, Button, Paper } from '@mui/material';
import { GroupObjectsNew, Add } from '@carbon/icons-react';

interface EmptyDocumentGroupsStateProps {
  onAddGroup: () => void;
  showCreateButton?: boolean;
}

export const EmptyDocumentGroupsState = ({ onAddGroup, showCreateButton }: EmptyDocumentGroupsStateProps) => {
  return (
    <Stack spacing={3} sx={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Paper variant="outlined" sx={{ p: 4 }}>
        <Stack spacing={1} sx={{ alignItems: 'center' }}>
          <GroupObjectsNew size={48} />

          <Typography variant="h6">No Groups Added</Typography>

          <Typography variant="body1" color="text.secondary">
            Start Adding Groups Types
          </Typography>
        </Stack>
      </Paper>

      {showCreateButton && (
        <Button variant="contained" color="secondary" startIcon={<Add size={16} />} onClick={onAddGroup}>
          Create Group Type
        </Button>
      )}
    </Stack>
  );
};
