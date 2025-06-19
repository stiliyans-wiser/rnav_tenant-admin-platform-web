'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Menu, MenuItem } from '@mui/material';
import { OverflowMenuVertical } from '@carbon/icons-react';
import { Tenant } from '@/features/tenants/interfaces/tenant.interface';
import { ConfirmDialog } from '@/features/common/components/dialogs/ConfirmDialog';
import { useDeleteTenant } from '@/features/tenants/hooks/useDeleteTenant';
import { useRouter } from 'next/navigation';

interface TenantsTableProps {
  tenants: Tenant[];
}

export const TenantsTable: React.FC<TenantsTableProps> = ({ tenants }) => {
  const [selectedTenant, setSelectedTenant] = useState<Tenant>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  const deleteTenant = useDeleteTenant();
  const router = useRouter();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, tenant: Tenant) => {
    setSelectedTenant(tenant);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
    handleMenuClose();
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleViewDetails = () => {
    if (selectedTenant?.id) {
      router.push(`/tenants/${selectedTenant.id}`);
    }

    handleMenuClose();
  };

  const confirmDelete = () => {
    if (selectedTenant?.id) {
      deleteTenant.mutate(selectedTenant.id, {
        onSuccess: () => {
          setOpenDeleteDialog(false);
          setSelectedTenant(null);
        },
        onError: error => {
          console.error('Failed to delete tenant:', error);
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
              <TableCell>Company Name</TableCell>
              <TableCell>Domain</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tenants.map(tenant => (
              <TableRow key={tenant.id}>
                <TableCell>{tenant.company_name}</TableCell>
                <TableCell>{tenant.domain}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={event => handleMenuOpen(event, tenant)}>
                    <OverflowMenuVertical size={20} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleViewDetails}>Details</MenuItem>
        <MenuItem onClick={handleOpenDeleteDialog}>Delete</MenuItem>
      </Menu>

      <ConfirmDialog
        title={`Are you sure you want to delete ${selectedTenant?.company_name}?`}
        isOpen={openDeleteDialog}
        handleClose={handleCloseDeleteDialog}
        handleConfirm={confirmDelete}
      />
    </>
  );
};
