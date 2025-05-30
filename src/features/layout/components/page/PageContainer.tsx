import { Box } from '@mui/system';

interface PageContainerProps {
  children: React.ReactNode;
}

export const PageContainer = ({ children }: PageContainerProps) => {
  return <Box sx={{ p: 3 }}>{children}</Box>;
};
