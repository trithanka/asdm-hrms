import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from "@mui/material";

interface CommentStatusDialogProps {
    open: boolean;
    onClose: () => void;
    onProceed: () => void;
    comment: string;
    onCommentChange: (v: string) => void;
    status: "Pending" | "Rejected" | "Approved";
    onStatusChange: (v: "Pending" | "Rejected" | "Approved") => void;
    isLoading: boolean;
}

export function CommentStatusDialog({
    open,
    onClose,
    onProceed,
    comment,
    onCommentChange,
    status,
    onStatusChange,
    isLoading,
}: CommentStatusDialogProps) {
    return (
        <Dialog
            open={open} onClose={onClose}
            maxWidth="sm" fullWidth
            PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
        >
            <DialogTitle sx={{ fontWeight: 700 }}>Add Timeline Details</DialogTitle>
            <Divider />
            <DialogContent>
                <TextField
                    label="Comment"
                    multiline
                    minRows={1}
                    fullWidth
                    value={comment}
                    onChange={(e) => onCommentChange(e.target.value)}
                    placeholder="Enter your comment before generating salary"
                    sx={{ mt: 1.5 }}
                />
                <FormControl sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Status</Typography>
                    <RadioGroup
                        row
                        value={status}
                        onChange={(e) => onStatusChange(e.target.value as "Pending" | "Rejected" | "Approved")}
                    >
                        <FormControlLabel value="Pending" control={<Radio />} label="Pending" />
                        <FormControlLabel value="Rejected" control={<Radio />} label="Rejected" />
                        <FormControlLabel value="Approved" control={<Radio />} label="Approved" />
                    </RadioGroup>
                </FormControl>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} variant="outlined" color="inherit">
                    Cancel
                </Button>
                <Button onClick={onProceed} variant="contained" disabled={isLoading}>
                    Proceed to Generate
                </Button>
            </DialogActions>
        </Dialog>
    );
}
