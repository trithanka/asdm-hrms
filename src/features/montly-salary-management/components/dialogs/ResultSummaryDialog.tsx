import {
    Button,
    Dialog,
    DialogContent,
    Typography,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface ResultSummaryDialogProps {
    open: boolean;
    onClose: () => void;
    counts: { success: number; failed: number };
}

export function ResultSummaryDialog({ open, onClose, counts }: ResultSummaryDialogProps) {
    const isFullSuccess = counts.failed === 0;
    const isPartial = counts.failed > 0 && counts.success > 0;

    const title = isFullSuccess
        ? "Perfect!"
        : isPartial
            ? "Partially Generated"
            : "Generation Failed";

    const message = isFullSuccess
        ? `Successfully generated salaries for all ${counts.success} employees.`
        : `Successfully generated: ${counts.success} | Failed: ${counts.failed}`;

    const iconColor = isFullSuccess
        ? "success.main"
        : isPartial
            ? "orange"
            : "error.main";

    return (
        <Dialog
            open={open} onClose={onClose}
            maxWidth="xs" fullWidth
            PaperProps={{ sx: { borderRadius: 4, p: 2, textAlign: "center" } }}
        >
            <DialogContent
                sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 4 }}
            >
                {isFullSuccess ? (
                    <CheckCircleOutlineIcon sx={{ fontSize: 80, color: iconColor, mb: 2 }} />
                ) : (
                    <ErrorOutlineIcon sx={{ fontSize: 80, color: iconColor, mb: 2 }} />
                )}

                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    {title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    {message}
                </Typography>

                <Button
                    onClick={onClose}
                    variant="contained"
                    fullWidth
                    sx={{
                        borderRadius: 2, py: 1.5,
                        textTransform: "none",
                        fontSize: "1rem", fontWeight: 600,
                    }}
                >
                    Close Summary
                </Button>
            </DialogContent>
        </Dialog>
    );
}
