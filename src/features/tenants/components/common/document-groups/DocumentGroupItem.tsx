import React, { useState } from 'react';
import { Paper, Stack, Typography, IconButton, Menu, MenuItem, Chip } from '@mui/material';
import { Edit, OverflowMenuVertical } from '@carbon/icons-react';
import { DocumentGroup } from '@/features/tenants/interfaces/document-group.interface';

interface DocumentGroupItemProps {
  group: DocumentGroup;
  onEdit: (group: DocumentGroup) => void;
  onDelete: (group: DocumentGroup) => void;
}

export const DocumentGroupItem = ({ group, onEdit, onDelete }: DocumentGroupItemProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(group);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(group);
    handleMenuClose();
  };

  return (
    <>
      <Paper variant="outlined" sx={{ padding: 2, marginBottom: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Stack gap={1} sx={{ height: '100%' }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle2">{group.name}</Typography>

            <Stack direction="row" gap={1} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <IconButton color="secondary" onClick={handleEdit} title="Edit group">
                <Edit size={20} />
              </IconButton>

              <IconButton onClick={handleMenuOpen}>
                <OverflowMenuVertical size={20} />
              </IconButton>
            </Stack>
          </Stack>

          <Typography variant="caption" sx={{ flex: 1 }}>
            {group.description}
          </Typography>

          {group.metadata && group.metadata.length > 0 && (
            <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
              {group.metadata.map((field, fieldIndex) => (
                <Chip key={fieldIndex} label={field.name} size="small" variant="filled" />
              ))}
            </Stack>
          )}
        </Stack>
      </Paper>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </>
  );
};
