'use client';

import CssBaseline from '@mui/material/CssBaseline';
import { Box, Stack } from '@mui/material';
import { usePathname } from 'next/navigation';
import { Topbar } from '@/features/layout/components/navigation/Topbar';
import { SideNavbar } from '@/features/layout/components/navigation/SideNavbar';
import { ThemeProvider } from '@mui/material/styles';
import defaultTheme from '@/features/theming/defaultTheme';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <ThemeProvider theme={defaultTheme} {...({ forceThemeRerender: true } as any)} modeStorageKey="mui-mode">
      <CssBaseline />

      <Stack
        sx={{
          width: '100%',
          height: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        {isLoginPage ? (
          children
        ) : (
          <>
            <Topbar />
            <Stack direction="row" sx={{ flex: 1, overflowY: 'auto' }}>
              <Box sx={{ width: 280 }}>
                <SideNavbar />
              </Box>
              <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
            </Stack>
          </>
        )}
      </Stack>
    </ThemeProvider>
  );
}
