import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    TextField,
} from "@mui/material";

interface BackToHrCommentDialogProps {
    open: boolean;
    onClose: () => void;
    onProceed: () => void;
    comment: string;
    onCommentChange: (v: string) => void;
    isLoading: boolean;
}

export function BackToHrCommentDialog({
    open,
    onClose,
    onProceed,
    comment,
    onCommentChange,
    isLoading,
}: BackToHrCommentDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
        >
            <DialogTitle sx={{ fontWeight: 700 }}>Back To HR</DialogTitle>
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
