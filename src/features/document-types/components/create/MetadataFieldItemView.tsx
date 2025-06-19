import { ColumnTypeEnum } from '@/features/document-types/enums/column-type.enum';
import { IconButton, Menu, MenuItem, Paper, Stack, Typography } from '@mui/material';
import { Edit, OverflowMenuVertical } from '@carbon/icons-react';
import { useState } from 'react';

interface MetadataFieldItemViewProps {
  field: {
    name: string;
    description: string;
    column_type: ColumnTypeEnum;
  };
  onEdit?: () => void;
  onDelete?: () => void;
  canEdit?: boolean;
}

export const MetadataFieldItemView = ({ field, onEdit, onDelete, canEdit = true }: MetadataFieldItemViewProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    onDelete?.();
    handleMenuClose();
  };

  const handleEdit = () => {
    if (canEdit) {
      onEdit?.();
    }
  };

  return (
    <>
      <Paper variant="outlined" sx={{ padding: 2, marginBottom: 2 }}>
        <Stack gap={1}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle2">{field.name}</Typography>
            <Stack direction="row" gap={1} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <IconButton
                color="secondary"
                onClick={handleEdit}
                disabled={!canEdit}
                title={!canEdit ? 'Please save or cancel the current editing field first' : 'Edit field'}
              >
                <Edit size={20} />
              </IconButton>
              <IconButton onClick={handleMenuOpen}>
                <OverflowMenuVertical size={20} />
              </IconButton>
            </Stack>
          </Stack>

          <Typography variant="caption">Description: {field.description}</Typography>
          <Typography variant="caption">Type: {field.column_type}</Typography>
        </Stack>
      </Paper>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </>
  );
};
