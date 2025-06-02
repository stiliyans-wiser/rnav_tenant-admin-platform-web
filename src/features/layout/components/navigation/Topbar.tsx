'use client';

import { Box, Divider, Link, Paper, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { ProfileDropdown } from './ProfileDropdown';
import logo from '@/assets/logo.png';

export const Topbar = () => {
  return (
    <Paper
      variant="outlined"
      square
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}
      data-testid="topbar"
    >
      <Stack direction="row" sx={{ alignItems: 'center' }}>
        <Link data-testid="topbarLogo" component="div">
          <Typography variant="h2" sx={{ paddingX: 3 }}>
            <Image src={logo} alt="Logo" width={104} height={32} />
          </Typography>
        </Link>

        <Divider orientation="vertical" variant="middle" flexItem />

        <Typography variant="body1" sx={{ paddingLeft: 2 }}>
          Tenant Admin Platform
        </Typography>
      </Stack>

      <Box sx={{ marginRight: 2 }}>
        <ProfileDropdown />
      </Box>
    </Paper>
  );
}; 