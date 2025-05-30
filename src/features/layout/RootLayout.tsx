import { Box, Stack } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Topbar } from './components/navigation/Topbar';
import { SideNavbar } from './components/navigation/SideNavbar.tsx';

export const RootLayout = () => {
  return (
    <Stack sx={{ height: '100%', width: '100%', flexGrow: 1 }}>
      <Topbar />

      <Stack component="main" direction="row" sx={{ flex: 1, overflowY: 'auto' }}>
        <Box sx={{ width: 240 }}>
          <SideNavbar />
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <Outlet />
        </Box>
      </Stack>
    </Stack>
  );
}; 
