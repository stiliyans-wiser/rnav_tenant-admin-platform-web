import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Close } from '@carbon/icons-react';

interface Props {
  title: string;
  handleClose: () => void;
  children: React.ReactNode;
}

export const CustomDialog = ({ title, handleClose, children }: Props) => {
  return (
    <Dialog open={true} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {title}
        <IconButton aria-label="close" onClick={handleClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};
