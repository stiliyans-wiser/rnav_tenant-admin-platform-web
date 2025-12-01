'use client';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Menu, MenuItem, Chip } from '@mui/material';
import { DocumentType } from '@/features/document-types/interfaces/document-type.interface';
import { useState } from 'react';
import { AddEditDocumentType } from '../create/AddEditDocumentType';
import { OverflowMenuVertical } from '@carbon/icons-react';
import { ConfirmDialog } from '@/features/common/components/dialogs/ConfirmDialog';
import { useDeleteDocumentType } from '@/features/document-types/hooks/useDeleteDocumentType';
import { CustomDrawer } from '@/features/common/components/drawers/CustomDrawer';

interface DocumentTypesTableProps {
  documentTypes: DocumentType[];
}

export const DocumentTypesTable: React.FC<DocumentTypesTableProps> = ({ documentTypes }) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType | undefined>();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const deleteDocumentType = useDeleteDocumentType();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, documentType: DocumentType) => {
    setAnchorEl(event.currentTarget);
    setSelectedDocumentType(documentType);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCloseEditDialog = () => setOpenEditDialog(false);
  const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

  const confirmDelete = () => {
    if (selectedDocumentType?.id) {
      deleteDocumentType.mutate(selectedDocumentType.id, {
        onSuccess: () => {
          setOpenDeleteDialog(false);
          setSelectedDocumentType(undefined);
        },
        onError: error => {
          console.error('Failed to delete document type:', error);
        },
      });
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="center">Metadata fields</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documentTypes.map(docType => (
              <TableRow key={docType.id}>
                <TableCell>{docType.name}</TableCell>
                <TableCell sx={{ maxWidth: 500 }}>{docType.description || '-'}</TableCell>
                <TableCell align="center">
                  <Chip label={docType.metadata_fields?.length || 0} color="primary" size="small" />
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={event => handleMenuOpen(event, docType)}>
                    <OverflowMenuVertical size={20} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            setOpenEditDialog(true);
            handleMenuClose();
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenDeleteDialog(true);
            handleMenuClose();
          }}
        >
          Delete
        </MenuItem>
      </Menu>

      <CustomDrawer title="Edit document type" open={openEditDialog} drawerSxProps={{ width: '40%' }} handleClose={handleCloseEditDialog}>
        <AddEditDocumentType documentType={selectedDocumentType} onClose={handleCloseEditDialog} />
      </CustomDrawer>

      <ConfirmDialog
        title={`Are you sure you want to delete document type ${selectedDocumentType?.name}?`}
        isOpen={openDeleteDialog}
        handleClose={handleCloseDeleteDialog}
        handleConfirm={confirmDelete}
      />
    </>
  );
};
