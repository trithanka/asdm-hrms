import { Box, Button, CircularProgress, Divider } from "@mui/material";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import UndoIcon from "@mui/icons-material/Undo";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import BoltIcon from "@mui/icons-material/Bolt";
import TableChartIcon from "@mui/icons-material/TableChart";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TimelineIcon from "@mui/icons-material/Timeline";
import { getPayrollActions } from "../utils/getPayrollActions";
import { Shortcut } from "@mui/icons-material";

interface SalaryActionBarProps {
    resolvedRoleId: number;
    isLoadingEmployees: boolean;
    generateSalaryMutation: { isPending: boolean };
    saveEmployeeDataMutation: { isPending: boolean };
    salarySlipGenerateMutation: { isPending: boolean };
    salaryTimelineMutation: { isPending: boolean };
    employeeList: any[];
    onExportExcel: () => void;
    onExportPdf: () => void;
    onSaveAll: () => void;
    onForwardToFinance?: () => void;
    onForwardToHR?: () => void;
    onBackToHR?: () => void;
    onBackToFinance?: () => void;
    onEnableSlip?: () => void;
    onTimeline: () => void;
    onSubmit: () => void;
}

export function SalaryActionBar({
    resolvedRoleId,
    isLoadingEmployees,
    generateSalaryMutation,
    saveEmployeeDataMutation,
    salarySlipGenerateMutation,
    salaryTimelineMutation,
    employeeList,
    onExportExcel,
    onExportPdf,
    onSaveAll,
    onForwardToFinance,
    onForwardToHR,
    onBackToHR,
    onBackToFinance,
    onEnableSlip,
    onTimeline,
    onSubmit,
}: SalaryActionBarProps) {
    const allGenerated = employeeList.every((emp: any) => emp.salaryStatus === "generated");

    // Get conditionally rendered actions
    const actions = getPayrollActions(employeeList, resolvedRoleId);
    const isHrRole = resolvedRoleId === 98;
    const isFinanceRole = resolvedRoleId === 36;
    const canEnableSlipFromRows = employeeList.some((emp: any) => {
        const status = String(emp?.salaryStatus ?? "").trim().toLowerCase();
        return emp?.stepTrack === 4 && status !== "generated";
    });

    return (
        <Box
            sx={{
                mt: 2.5,
                pt: 2,
                borderTop: "1px solid #edf2f7",
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "stretch", md: "center" },
                justifyContent: "space-between",
                gap: 1.25,
                width: "100%",
            }}
        >
            {/* Primary actions (left) */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
                {isHrRole && (
                    <Button
                        variant="outlined" color="primary" size="small"
                        onClick={onSaveAll}
                        disabled={saveEmployeeDataMutation.isPending || isLoadingEmployees || !actions.showSaveAll}
                        startIcon={saveEmployeeDataMutation.isPending ? (
                            <CircularProgress size={14} color="inherit" />
                        ) : (
                            <SaveOutlinedIcon fontSize="small" />
                        )}
                        sx={{ textTransform: "none", fontWeight: 600 }}
                    >
                        {saveEmployeeDataMutation.isPending ? "Saving..." : "Save"}
                    </Button>
                )}

                {/* Role-gated forward / revert */}
                {isHrRole && (
                    <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={onForwardToFinance ?? onSaveAll}
                        disabled={saveEmployeeDataMutation.isPending || isLoadingEmployees || !actions.showForwardToFinance}
                        startIcon={saveEmployeeDataMutation.isPending ? (
                            <CircularProgress size={14} color="inherit" />
                        ) : (
                            <Shortcut fontSize="small" />
                        )}
                        sx={{ textTransform: "none" }}
                    >
                        {saveEmployeeDataMutation.isPending ? "Sending..." : "To Finance"}
                    </Button>
                )}
                {isHrRole && (
                    <Button
                        variant="outlined"
                        color="warning"
                        size="small"
                        onClick={onBackToFinance}
                        disabled={saveEmployeeDataMutation.isPending || isLoadingEmployees || !actions.showRevertToFinance}
                        startIcon={<UndoIcon fontSize="small" />}
                        sx={{ textTransform: "none" }}
                    >
                        Back Finance
                    </Button>
                )}

                {isFinanceRole && (
                    <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={onForwardToHR}
                        disabled={saveEmployeeDataMutation.isPending || isLoadingEmployees || !actions.showForwardToHR}
                        startIcon={<Shortcut fontSize="small" />}
                        sx={{ textTransform: "none" }}
                    >
                        To HR
                    </Button>
                )}
                {isFinanceRole && (
                    <Button
                        variant="outlined"
                        color="warning"
                        size="small"
                        onClick={onBackToHR}
                        disabled={saveEmployeeDataMutation.isPending || isLoadingEmployees || !actions.showRevertToHR}
                        startIcon={<UndoIcon fontSize="small" />}
                        sx={{ textTransform: "none" }}
                    >
                        Back HR
                    </Button>
                )}


                {isHrRole && (
                    <Button
                        variant="contained" color="success" size="small"
                        onClick={onSubmit}
                        disabled={generateSalaryMutation.isPending || isLoadingEmployees || allGenerated || !actions.showGenerateSalary}
                        startIcon={generateSalaryMutation.isPending ? (
                            <CircularProgress size={16} color="inherit" />
                        ) : (
                            <BoltIcon fontSize="small" />
                        )}
                        sx={{ px: 3, fontWeight: 700, textTransform: "none" }}
                    >
                        {generateSalaryMutation.isPending
                            ? "Processing..."
                            : allGenerated
                                ? "Approved"
                                : "Generate"}
                    </Button>
                )}
                {isHrRole && (
                    <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={onEnableSlip}
                        disabled={
                            salarySlipGenerateMutation.isPending ||
                            isLoadingEmployees ||
                            !actions.showEnableSalarySlip ||
                            !canEnableSlipFromRows
                        }
                        startIcon={salarySlipGenerateMutation.isPending ? (
                            <CircularProgress size={14} color="inherit" />
                        ) : (
                            <CheckCircleOutlineIcon fontSize="small" />
                        )}
                        sx={{ textTransform: "none" }}
                    >
                        {salarySlipGenerateMutation.isPending ? "Enabling..." : "Enable Slip"}
                    </Button>
                )}
            </Box>

            {/* Secondary actions (right) */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center", justifyContent: { xs: "flex-start", md: "flex-end" } }}>
                <Button
                    variant="outlined" color="success" size="small"
                    onClick={onExportExcel} disabled={isLoadingEmployees}
                    startIcon={<TableChartIcon fontSize="small" />}
                    sx={{ textTransform: "none", minWidth: 90 }}
                >
                    XLS
                </Button>
                <Button
                    variant="outlined" color="secondary" size="small"
                    onClick={onExportPdf} disabled={isLoadingEmployees}
                    startIcon={<PictureAsPdfIcon fontSize="small" />}
                    sx={{ textTransform: "none", minWidth: 90 }}
                >
                    PDF
                </Button>

                <Divider orientation="vertical" flexItem sx={{ mx: 0.25 }} />

                <Button
                    variant="outlined" color="inherit" size="small"
                    onClick={onTimeline}
                    disabled={salaryTimelineMutation.isPending}
                    startIcon={
                        salaryTimelineMutation.isPending ? (
                            <CircularProgress size={14} color="inherit" />
                        ) : (
                            <TimelineIcon fontSize="small" />
                        )
                    }
                    sx={{ textTransform: "none", minWidth: 96 }}
                >
                    Track
                </Button>
            </Box>
        </Box>
    );
}
