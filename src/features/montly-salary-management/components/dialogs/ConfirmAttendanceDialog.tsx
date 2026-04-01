import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

interface ConfirmAttendanceDialogProps {
    open: boolean;
    onClose: () => void;
    onProceed: () => void;
    counts: { skipped: number; valid: number };
}

export function ConfirmAttendanceDialog({
    open,
    onClose,
    onProceed,
    counts,
}: ConfirmAttendanceDialogProps) {
    const hasSkipped = counts.skipped > 0;

    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
            <DialogTitle
                sx={{ display: "flex", alignItems: "center", gap: 1.5, color: hasSkipped ? "warning.main" : "primary.main", fontWeight: 700 }}
            >
                <WarningAmberIcon fontSize="large" />
                {hasSkipped ? "Pending Attendance Data" : "Confirm Salary Generation"}
            </DialogTitle>
            <Divider />
            <DialogContent>
                {hasSkipped ? (
                    <>
                        <DialogContentText sx={{ color: "text.primary", fontSize: "1rem", mb: 2 }}>
                            We found <strong>{counts.skipped}</strong> employee(s) who don&apos;t have
                            attendance recorded for this period.
                        </DialogContentText>
                        <Alert severity="warning" sx={{ borderRadius: 2 }}>
                            Salaries will <strong>NOT</strong> be generated for records with zero or empty
                            attendance. Do you want to proceed with the remaining{" "}
                            <strong>{counts.valid}</strong> employee(s)?
                        </Alert>
                    </>
                ) : (
                    <DialogContentText sx={{ color: "text.primary", fontSize: "1rem" }}>
                        Do you want to generate salary for <strong>{counts.valid}</strong> employee(s)?
                    </DialogContentText>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button
                    onClick={onClose} variant="outlined" color="inherit"
                    sx={{ borderRadius: 2, textTransform: "none" }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={onProceed} variant="contained" color={hasSkipped ? "warning" : "primary"} autoFocus
                    sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
                >
                    Proceed to Generate
                </Button>
            </DialogActions>
        </Dialog>
    );
}
