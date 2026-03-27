import { Box, Button, CircularProgress, Divider } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { getPayrollActions } from "../utils/getPayrollActions";

interface SalaryActionBarProps {
    resolvedRoleId: number;
    isLoadingEmployees: boolean;
    generateSalaryMutation: { isPending: boolean };
    saveEmployeeDataMutation: { isPending: boolean };
    salaryTimelineMutation: { isPending: boolean };
    employeeList: any[];
    onExportExcel: () => void;
    onExportPdf: () => void;
    onSaveAll: () => void;
    onTimeline: () => void;
    onSubmit: () => void;
}

export function SalaryActionBar({
    resolvedRoleId,
    isLoadingEmployees,
    generateSalaryMutation,
    saveEmployeeDataMutation,
    salaryTimelineMutation,
    employeeList,
    onExportExcel,
    onExportPdf,
    onSaveAll,
    onTimeline,
    onSubmit,
}: SalaryActionBarProps) {
    const allGenerated = employeeList.every((emp: any) => emp.salaryStatus === "generated");

    // Get conditionally rendered actions
    const actions = getPayrollActions(employeeList, resolvedRoleId);

    return (
        <Box
            sx={{
                mt: 2.5,
                pt: 2,
                borderTop: "1px solid #edf2f7",
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                alignItems: "center",
                justifyContent: "flex-end",
                width: "100%",
            }}
        >
            {/* Export */}
            <Button
                variant="outlined" color="success" size="small"
                onClick={onExportExcel} disabled={isLoadingEmployees}
                startIcon={<DownloadIcon />} sx={{ textTransform: "none" }}
            >
                XL Report
            </Button>
            <Button
                variant="outlined" color="secondary" size="small"
                onClick={onExportPdf} disabled={isLoadingEmployees}
                startIcon={<DownloadIcon />} sx={{ textTransform: "none" }}
            >
                PDF Report
            </Button>

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

            {/* Save All */}
            {actions.showSaveAll && (
                <>
                    <Button
                        variant="outlined" color="primary" size="small"
                        onClick={onSaveAll}
                        disabled={saveEmployeeDataMutation.isPending || isLoadingEmployees}
                        startIcon={
                            saveEmployeeDataMutation.isPending ? (
                                <CircularProgress size={14} color="inherit" />
                            ) : null
                        }
                        sx={{ textTransform: "none", fontWeight: 600 }}
                    >
                        {saveEmployeeDataMutation.isPending ? "Saving..." : "Save All"}
                    </Button>
                    <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                </>
            )}

            <Button
                variant="outlined" color="inherit" size="small"
                onClick={onTimeline}
                disabled={salaryTimelineMutation.isPending}
                startIcon={
                    salaryTimelineMutation.isPending ? (
                        <CircularProgress size={14} color="inherit" />
                    ) : null
                }
                sx={{ textTransform: "none" }}
            >
                Timelines
            </Button>

            {/* Role-gated forward / revert */}
            {actions.showForwardToFinance && (
                <Button variant="outlined" color="primary" size="small" sx={{ textTransform: "none" }}>
                    Forward to Finance
                </Button>
            )}
            {actions.showRevertToFinance && (
                <Button variant="outlined" color="warning" size="small" sx={{ textTransform: "none" }}>
                    Revert to Finance
                </Button>
            )}

            {actions.showForwardToHR && (
                <Button variant="outlined" color="primary" size="small" sx={{ textTransform: "none" }}>
                    Forward to HR
                </Button>
            )}
            {actions.showRevertToHR && (
                <Button variant="outlined" color="warning" size="small" sx={{ textTransform: "none" }}>
                    Revert to HR
                </Button>
            )}

            {actions.showEnableSalarySlip && (
                <Button variant="contained" color="secondary" size="small" sx={{ textTransform: "none" }}>
                    Enable Salary Slip
                </Button>
            )}

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

            {/* Generate Salary / Final Approve */}
            {actions.showGenerateSalary && (
                <Button
                    variant="contained" color="success" size="small"
                    onClick={onSubmit}
                    disabled={generateSalaryMutation.isPending || isLoadingEmployees || allGenerated}
                    startIcon={
                        generateSalaryMutation.isPending ? (
                            <CircularProgress size={16} color="inherit" />
                        ) : null
                    }
                    sx={{ px: 3, fontWeight: 700, textTransform: "none" }}
                >
                    {generateSalaryMutation.isPending
                        ? "Processing..."
                        : allGenerated
                            ? "Approved"
                            : "Generate Salary"}
                </Button>
            )}
        </Box>
    );
}
