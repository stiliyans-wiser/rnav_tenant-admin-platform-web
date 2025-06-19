'use client';

import { Box, Divider, Link, Paper, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { useColorScheme } from '@mui/material';
import { ProfileDropdown } from './ProfileDropdown';
import { ThemeMode } from '@/features/theming/enums/theme-mode.enum';
import lightThemeLogo from '@/assets/logo-light-theme.png';
import darkThemeLogo from '@/assets/logo-dark-theme.png';

export const Topbar = () => {
  const { mode } = useColorScheme();
  const logo = mode === ThemeMode.LIGHT ? lightThemeLogo : darkThemeLogo;

  return (
    <Paper
      variant="outlined"
      square
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
      }}
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
          Productised AI Services - Back-office
        </Typography>
      </Stack>

      <Box sx={{ marginRight: 2 }}>
        <ProfileDropdown />
      </Box>
    </Paper>
  );
};
