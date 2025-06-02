'use client';

import CssBaseline from '@mui/material/CssBaseline';
import { Box, Stack } from '@mui/material';
import { Topbar } from '@/features/layout/components/navigation/Topbar';
import { SideNavbar } from '@/features/layout/components/navigation/SideNavbar';
import { ThemeProvider } from '@mui/material/styles';
import defaultTheme from '@/features/theming/default-theme';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

      <Stack sx={{ width: '100%', minHeight: '100vh' }}>
        <Topbar />

        <Stack direction="row" sx={{ flex: 1 }}>
          <Box sx={{ width: 280 }}>
            <SideNavbar />
          </Box>
          <Box sx={{ flex: 1 }}>
            {children}
          </Box>
        </Stack>

      </Stack>
    </ThemeProvider>
  );
}
