'use client';

import { Avatar, Button, Menu, MenuItem, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { ThemeSwitcher } from '@/features/theming/components/ThemeSwitcher';
import { useAuth } from '@/features/auth/context/AuthContext';

export const ProfileDropdown = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { logout } = useAuth();

  const handleMenuOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  return (
    <>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', cursor: 'pointer' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }} onClick={e => handleMenuOpen(e)}>
          <Avatar sx={{ width: 28, height: 28, marginLeft: 2 }}>
            <Typography variant="body1">A</Typography>
          </Avatar>
          <Typography variant="body1" noWrap>
            Admin
          </Typography>
        </Stack>

        <Button variant="text" fullWidth sx={{ marginX: 1 }} onClick={handleLogout}>
          Logout
        </Button>
      </Stack>

      <Menu
        id="menu-profile"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem>
          <ThemeSwitcher />
        </MenuItem>
      </Menu>
    </>
  );
};
