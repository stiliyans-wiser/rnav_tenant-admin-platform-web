'use client';

import React, { useState } from 'react';
import { signOut } from 'next-auth/react';
import { Avatar, Button, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { getUserInitials } from '@/features/layout/utils/userInitialsUtil';
import { ThemeSwitcher } from '@/features/theming/components/ThemeSwitcher';

export const ProfileDropdown = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { currentUser } = useAuth();

  const initials = getUserInitials(currentUser?.name);

  const handleMenuOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
    handleMenuClose();
  };

  return (
    <>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', cursor: 'pointer' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }} onClick={e => handleMenuOpen(e)}>
          <Avatar sx={{ width: 28, height: 28, marginLeft: 2 }}>
            <Typography variant="body1">{initials}</Typography>
          </Avatar>
          <Typography variant="body1" noWrap>
            {currentUser?.name}
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
