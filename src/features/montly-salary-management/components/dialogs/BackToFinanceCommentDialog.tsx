import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    TextField,
} from "@mui/material";

interface BackToFinanceCommentDialogProps {
    open: boolean;
    onClose: () => void;
    onProceed: () => void;
    comment: string;
    onCommentChange: (v: string) => void;
    isLoading: boolean;
}

export function BackToFinanceCommentDialog({
    open,
    onClose,
    onProceed,
    comment,
    onCommentChange,
    isLoading,
}: BackToFinanceCommentDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
        >
            <DialogTitle sx={{ fontWeight: 700 }}>Back To Finance</DialogTitle>
            <Divider />
            <DialogContent>
                <TextField
                    label="Comment"
                    multiline
                    minRows={2}
                    fullWidth
                    value={comment}
                    onChange={(e) => onCommentChange(e.target.value)}
                    placeholder="Enter reason/comment"
                    sx={{ mt: 1.5 }}
                />
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} variant="outlined" color="inherit">
                    Cancel
                </Button>
                <Button onClick={onProceed} variant="contained" color="warning" disabled={isLoading}>
                    Send Back
                </Button>
            </DialogActions>
        </Dialog>
    );
}
