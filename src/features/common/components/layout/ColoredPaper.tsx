import { Paper, styled, alpha } from '@mui/material';

export const ColoredPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.dark, 0.12),
}));
