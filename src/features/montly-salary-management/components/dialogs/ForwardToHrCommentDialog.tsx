import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    TextField,
} from "@mui/material";

interface ForwardToHrCommentDialogProps {
    open: boolean;
    onClose: () => void;
    onProceed: () => void;
    comment: string;
    onCommentChange: (v: string) => void;
    isLoading: boolean;
}

export function ForwardToHrCommentDialog({
    open,
    onClose,
    onProceed,
    comment,
    onCommentChange,
    isLoading,
}: ForwardToHrCommentDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
        >
            <DialogTitle sx={{ fontWeight: 700 }}>Forward To HR</DialogTitle>
            <Divider />
            <DialogContent>
                <TextField
                    label="Comment"
                    multiline
                    minRows={2}
                    fullWidth
                    value={comment}
                    onChange={(e) => onCommentChange(e.target.value)}
                    placeholder="Enter comment"
                    sx={{ mt: 1.5 }}
                />
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} variant="outlined" color="inherit">
                    Cancel
                </Button>
                <Button onClick={onProceed} variant="contained" color="primary" disabled={isLoading}>
                    Forward
                </Button>
            </DialogActions>
        </Dialog>
    );
}
