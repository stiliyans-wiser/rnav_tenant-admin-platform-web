import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';

interface Props {
  isOpen?: boolean;
  title: string;
  handleClose: () => void;
  handleConfirm: () => void;
}

export const ConfirmDialog = ({ isOpen = false, title, handleClose, handleConfirm }: Props) => {
  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogActions>
        <Button color="primary" variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <Button color="primary" variant="contained" onClick={handleConfirm}>
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};
