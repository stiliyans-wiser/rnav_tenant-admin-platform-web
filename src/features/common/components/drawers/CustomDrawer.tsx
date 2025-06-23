import React from 'react';
import { Drawer, IconButton, Typography, Stack, Box, Divider } from '@mui/material';
import { Close } from '@carbon/icons-react';

interface CustomDrawerProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  handleClose: () => void;
  drawerSxProps?: object;
}

export const CustomDrawer = ({ open, title, children, handleClose, drawerSxProps }: CustomDrawerProps) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: { ...drawerSxProps },
        },
      }}
    >
      <Stack sx={{ height: '100%', padding: 4 }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6">{title}</Typography>
          <IconButton edge="start" color="inherit" onClick={handleClose}>
            <Close />
          </IconButton>
        </Stack>

        <Divider sx={{ marginY: 3 }} />

        <Box sx={{ flex: 1, overflow: 'auto' }}>{children}</Box>
      </Stack>
    </Drawer>
  );
};
