import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

type LeaveBalanceSubmitDialogProps = {
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

export function LeaveBalanceSubmitDialog({
  open,
  isSubmitting,
  onClose,
  onSubmit,
}: LeaveBalanceSubmitDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Save All</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to save all valid leave balance details?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onSubmit} disabled={isSubmitting}>
          Save All
        </Button>
      </DialogActions>
    </Dialog>
  );
}
