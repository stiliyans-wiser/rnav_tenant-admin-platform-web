'use client';

import { useState } from 'react';
import { IconButton, Menu, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { OverflowMenuVertical } from '@carbon/icons-react';
import { useDeleteUser } from '@/features/users/hooks/useDeleteUser';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ConfirmDialog } from '@/features/common/components/dialogs/ConfirmDialog';
import { User } from '@/features/users/interfaces/user.interface';

interface UsersTableProps {
  users: User[];
}

export const UsersTable: React.FC<UsersTableProps> = ({ users }: UsersTableProps) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { currentUser } = useAuth();
  const deleteUser = useDeleteUser();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const confirmDelete = () => {
    if (selectedUser?.id) {
      deleteUser.mutate(selectedUser.id, {
        onSuccess: () => {
          setOpenDeleteDialog(false);
          setSelectedUser(undefined);
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
              <TableCell>Email</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell align="center">
                  {currentUser?.sub !== user.email && (
                    <IconButton onClick={event => handleMenuOpen(event, user)}>
                      <OverflowMenuVertical size={20} />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            setOpenDeleteDialog(true);
            handleMenuClose();
          }}
        >
          Delete
        </MenuItem>
      </Menu>

      <ConfirmDialog
        title={`Are you sure you want to delete user ${selectedUser?.name}?`}
        isOpen={openDeleteDialog}
        handleClose={() => setOpenDeleteDialog(false)}
        handleConfirm={confirmDelete}
      />
    </>
  );
};
