import { Box, Typography } from '@mui/material';

export const Tenants = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Tenants
      </Typography>
      <Typography variant="body1">
        Manage your tenants in the Tenant Admin Platform.
      </Typography>
    </Box>
  );
};

export default Tenants; 