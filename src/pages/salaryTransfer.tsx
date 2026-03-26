import { useState, useMemo } from "react";
import {
    Box,
    Typography,
    FormControl,
    FormControlLabel,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Button,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Divider,
    Radio,
    RadioGroup,
    TextField,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { SalarySheetTable } from "../features/montly-salary-management/components/SalarySheetTable";
import { BankTransferTable } from "../features/montly-salary-management/components/BankTransferTable";
import { TaxDeductionTable } from "../features/montly-salary-management/components/TaxDeductionTable";
import { useSalaryStructureTypes, useEmployeeList, useGenerateSalary } from "../features/montly-salary-management/hooks/useGetSalaryFile";
import { useExportSalaryReport } from "../features/montly-salary-management/hooks/useExportSalaryReport";
import { formatFyMaster } from "../utils/formatter";

import toast from "react-hot-toast";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "react-auth-kit";
import { getRoleIdFromToken } from "../utils/auth";
const months = [
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
];

export const SalaryTransfer = () => {
    const navigate = useNavigate();
    const authUser = useAuthUser();

    const [selectedStructureType, setSelectedStructureType] = useState<string>("ASDM_NESC");
    const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString());
    const [selectedYear, setSelectedYear] = useState<number | "">("");
    const [currentTableData, setCurrentTableData] = useState<any[]>([]);

    // Dialog states
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [commentDialogOpen, setCommentDialogOpen] = useState(false);
    const [resultDialogOpen, setResultDialogOpen] = useState(false);
    const [counts, setCounts] = useState({ skipped: 0, valid: 0 });
    const [resultCounts, setResultCounts] = useState({ success: 0, failed: 0 });
    const [generationQueue, setGenerationQueue] = useState<any[]>([]);
    const [timelineComment, setTimelineComment] = useState("");
    const [timelineStatus, setTimelineStatus] = useState<"Pending" | "Rejected" | "Approved">("Pending");

    // Fetch salary structure types and fyMaster
    const { data: structureTypesData, isLoading: isLoadingTypes } = useSalaryStructureTypes();

    // Format financial years from fyMaster data
    const formattedYears = useMemo(() => {
        if (!structureTypesData?.data?.fyMaster) return [];
        return formatFyMaster(structureTypesData.data.fyMaster);
    }, [structureTypesData]);

    // Resolve numeric structure type ID from the selected type string
    const structureTypeId = structureTypesData?.data?.salaryStructureTypes?.find(
        (s) => s.type === selectedStructureType
    )?.id;

    // Fetch employee list based on selected filters
    // Send pklSalaryFinancialYearId as string instead of year
    const { data: employeeListData, isLoading: isLoadingEmployees, error: employeeError } = useEmployeeList(
        structureTypeId !== undefined ? structureTypeId.toString() : selectedStructureType,
        selectedMonth,
        selectedYear ? selectedYear.toString() : undefined
    );

    const generateSalaryMutation = useGenerateSalary();
    const { exportToExcel, exportToPdf } = useExportSalaryReport();

    // Resolve roleId for permission control in the salary sheet
    const resolvedRoleId = (() => {
        // 1. Try JWT token first (most reliable)
        const tokenRoleId = getRoleIdFromToken();
        if (tokenRoleId !== null && Number.isFinite(tokenRoleId) && tokenRoleId > 0) {
            return tokenRoleId;
        }

        // 2. Fallback: try react-auth-kit state
        const authState: any = authUser();
        const fallbackId = Number(
            authState?.roleId ??
            authState?.fklRoleId ??
            authState?.roleID ??
            authState?.RoleId ??
            authState?.role_id ??
            0
        );

        return fallbackId;
    })();

    // stepTrack for the currently selected FY/month — lives on each employee row, read the first to get the process step
    const currentStepTrack: number | null = employeeListData?.employeeList?.[0]?.stepTrack ?? null;

    const resolveTrackStep = () => {
        // Source of truth: roleId from JWT token so it survives refresh.
        const tokenRoleId = getRoleIdFromToken();
        if (tokenRoleId === 98) return 1;
        if (tokenRoleId === 36) return 2;

        // Fallback for non-standard token payloads.
        const authState: any = authUser();
        const roleId = Number(
            authState?.roleId ??
            authState?.fklRoleId ??
            authState?.roleID ??
            authState?.RoleId
        );

        if (roleId === 98) return 1;
        if (roleId === 36) return 2;
        return 3;
    };

    // Set default financial year based on current date (with safe fallback)
    useEffect(() => {
        if (structureTypesData?.data?.fyMaster && selectedYear === "") {
            const enabledYears = structureTypesData.data.fyMaster.filter((fy) => fy.bEnabled === 1);
            if (enabledYears.length === 0) return;

            const now = new Date();
            const currentMonth = now.getMonth() + 1; // 1-12
            const currentYear = now.getFullYear();
            const currentFyStartYear = currentMonth < 4 ? currentYear - 1 : currentYear;

            const getScore = (val: number) => (val < 4 ? val + 12 : val);
            const currentMonthScore = getScore(currentMonth);

            const sameFyConfigs = enabledYears.filter((fy) => Number(fy.vsFy) === currentFyStartYear);

            if (sameFyConfigs.length > 0) {
                // If multiple configs exist for same FY, choose the most recent effective start month.
                const bestMatch = [...sameFyConfigs]
                    .filter((fy) => getScore(fy.iStartMonth) <= currentMonthScore)
                    .sort((a, b) => getScore(b.iStartMonth) - getScore(a.iStartMonth))[0]
                    || [...sameFyConfigs].sort((a, b) => b.pklSalaryFinancialYearId - a.pklSalaryFinancialYearId)[0];

                setSelectedYear(bestMatch.pklSalaryFinancialYearId);
                return;
            }

            // Fallback: pick latest enabled config.
            const latestFy = [...enabledYears].sort((a, b) => b.pklSalaryFinancialYearId - a.pklSalaryFinancialYearId)[0];
            setSelectedYear(latestFy.pklSalaryFinancialYearId);
        }
    }, [structureTypesData, selectedYear]);


    const handleSalaryDataChange = (updatedData: any[]) => {
        setCurrentTableData(updatedData);
    };

    // Determine available months for the selected FY configuration
    const isMonthDisabled = (monthValue: string) => {
        if (!structureTypesData?.data?.fyMaster || selectedYear === "") return false;

        const selectedFyConfig = structureTypesData.data.fyMaster.find(
            fy => fy.pklSalaryFinancialYearId === selectedYear
        );
        if (!selectedFyConfig) return false;

        const allSameYearConfigs = structureTypesData.data.fyMaster.filter(
            fy => fy.vsFy === selectedFyConfig.vsFy
        );
        if (allSameYearConfigs.length <= 1) return false;

        const m = parseInt(monthValue);
        const getScore = (val: number) => (val < 4 ? val + 12 : val);
        const mScore = getScore(m);
        const selectedStartScore = getScore(selectedFyConfig.iStartMonth);

        // A month is disabled if it's before the current FY start
        if (mScore < selectedStartScore) return true;

        // Or if there's another config that starts after the current one but before/at this month
        return allSameYearConfigs.some(other => {
            if (other.pklSalaryFinancialYearId === selectedYear) return false;
            const oScore = getScore(other.iStartMonth);
            return oScore > selectedStartScore && oScore <= mScore;
        });
    };

    // Auto-select valid month if current selection becomes disabled
    useEffect(() => {
        if (selectedYear !== "" && isMonthDisabled(selectedMonth)) {
            const firstValidMonth = months.find(m => !isMonthDisabled(m.value));
            if (firstValidMonth) {
                setSelectedMonth(firstValidMonth.value);
            }
        }
    }, [selectedYear, selectedMonth, structureTypesData]);


    const handleExportReport = () => {
        // Use currentTableData if available (contains user edits), otherwise fall back to API data
        const employeeData = currentTableData.length > 0
            ? currentTableData
            : (employeeListData?.employeeList || []);

        if (employeeData.length === 0) {
            toast.error("No data available to export");
            return;
        }

        const selectedYearLabel = formattedYears.find(fy => fy.value === selectedYear)?.label || (selectedYear ? selectedYear.toString() : "");

        const fileName = exportToExcel(employeeData, {
            month: selectedMonth,
            year: selectedYearLabel,
            structureType: selectedStructureType,
        });

        if (fileName) {
            toast.success(`Report downloaded: ${fileName}`);
        } else {
            toast.error("Failed to export report");
        }
    };

    const handleExportPdfReport = async () => {
        const employeeData = currentTableData.length > 0
            ? currentTableData
            : (employeeListData?.employeeList || []);

        if (employeeData.length === 0) {
            toast.error("No data available to export");
            return;
        }

        const selectedYearLabel = formattedYears.find(fy => fy.value === selectedYear)?.label || (selectedYear ? selectedYear.toString() : "");

        const fileName = await exportToPdf(employeeData, {
            month: selectedMonth,
            year: selectedYearLabel,
            structureType: selectedStructureType,
        });

        if (fileName) {
            toast.success(`Report downloaded: ${fileName}`);
        } else {
            toast.error("Failed to export PDF report");
        }
    };

    const runGeneration = async (employeesToProcess: any[]) => {
        const generateEmployees = employeesToProcess.map((emp: any) => ({
            fullName: emp.fullName ?? "",
            employeeId: emp.employeeId,
            attendance: emp.attendance ?? null,
            lwp: emp.lwpDays ?? null,
            arear: emp.arrear ?? null,
            incomeTax: emp.deductionIncomeTax ?? null,
            otherDeduction: emp.ddvancesOtherDeductions ?? null,
            isHold: emp.hold ? 1 : 0,
        }));

        const structureTypeId = structureTypesData?.data?.salaryStructureTypes?.find(
            (s) => s.type === selectedStructureType
        )?.id ?? selectedStructureType;

        const payload = {
            salaryStructureType: structureTypeId,
            generateMonth: selectedMonth,
            generateYear: selectedYear.toString(),
            trackStep: resolveTrackStep(),
            generateEmployees,
        };

        try {
            const response = await generateSalaryMutation.mutateAsync(payload);
            const successCount = response.sucessReport.successfullyGenerateCount;
            const failedCount = response.sucessReport.failedGenerateCount;

            setResultCounts({ success: successCount, failed: failedCount });
            setResultDialogOpen(true);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message;
            toast.error(errorMessage || "Failed to generate salary. Please try again.");
        }
    };

    const openCommentDialog = (employeesToProcess: any[]) => {
        if (!employeesToProcess?.length) {
            toast.error("No employees with valid attendance found.");
            return;
        }

        setGenerationQueue(employeesToProcess);
        setTimelineComment("");
        setTimelineStatus("Pending");
        setCommentDialogOpen(true);
    };

    const handleConfirmCommentAndGenerate = async () => {
        if (!timelineComment.trim()) {
            toast.error("Please add a comment before proceeding.");
            return;
        }

        setCommentDialogOpen(false);
        await runGeneration(generationQueue);
        setGenerationQueue([]);
    };

    const handleSubmit = async () => {
        const employeeData = currentTableData.length > 0 ? currentTableData : (employeeListData?.employeeList || []);
        if (employeeData.length === 0) {
            toast.error("No employees to submit");
            return;
        }

        const validEmployees = employeeData.filter((emp: any) => emp.attendance !== null && emp.attendance !== undefined && emp.attendance > 0);
        const skipped = employeeData.length - validEmployees.length;

        if (validEmployees.length === 0) {
            toast.error("No employees with valid attendance found.");
            return;
        }

        if (skipped > 0) {
            setCounts({ skipped, valid: validEmployees.length });
            setConfirmDialogOpen(true);
        } else {
            openCommentDialog(validEmployees);
        }
    };

    const renderTable = () => {
        if (!selectedStructureType) {
            return (
                <Box
                    sx={{
                        mt: 3,
                        p: 4,
                        textAlign: "center",
                        border: "2px dashed #e0e0e0",
                        borderRadius: 2,
                        backgroundColor: "#fafafa",
                    }}
                >
                    <Typography variant="body1" color="text.secondary">
                        Please select a salary structure type to view the data
                    </Typography>
                </Box>
            );
        }

        // Show loading state
        if (isLoadingEmployees) {
            return (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3, p: 4 }}>
                    <CircularProgress />
                </Box>
            );
        }

        // Show error state
        if (employeeError) {
            return (
                <Box sx={{ mt: 3 }}>
                    <Alert severity="error">
                        Failed to load employee data. Please try again.
                    </Alert>
                </Box>
            );
        }

        // Get employee data from API
        const employeeData = employeeListData?.employeeList || [];


        // Show empty state
        if (employeeData.length === 0) {
            return (
                <Box
                    sx={{
                        mt: 3,
                        p: 4,
                        textAlign: "center",
                        border: "2px dashed #e0e0e0",
                        borderRadius: 2,
                        backgroundColor: "#fafafa",
                    }}
                >
                    <Typography variant="body1" color="text.secondary">
                        No employee data found for the selected criteria
                    </Typography>
                </Box>
            );
        }

        // Render different tables based on selected structure type
        switch (selectedStructureType) {
            case "ASDM_NESC":
                return (
                    <SalarySheetTable
                        data={employeeData as any}
                        onDataChange={handleSalaryDataChange}
                        month={selectedMonth}
                        year={selectedYear ? selectedYear.toString() : ""}
                        roleId={resolvedRoleId}
                        stepTrack={currentStepTrack}
                    />
                );

            case "Casual":
                return <BankTransferTable data={employeeData as any} />;

            case "Part_Time":
            case "AMD":
                return <TaxDeductionTable data={employeeData as any} />;

            default:
                return (
                    <SalarySheetTable
                        data={employeeData as any}
                        onDataChange={handleSalaryDataChange}
                        month={selectedMonth}
                        year={selectedYear ? selectedYear.toString() : ""}
                    />
                );
        }
    };

    return (
        <Box sx={{ height: "100%", overflow: "hidden", display: "flex", flexDirection: "column", pt: 1 }}>
            <Box sx={{ mb: 0, flexShrink: 0 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "primary.main" }}>
                        Employee Wise Payroll
                    </Typography>
                </Stack>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 2,
                        backgroundColor: "white",
                        p: 2,
                        mb: 3,
                        borderRadius: 2,
                        boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                        border: "1px solid #edf2f7",
                    }}
                >
                    {/* Filters Group */}
                    <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap" }}>
                        <FormControl size="small" sx={{ minWidth: 160 }}>
                            <InputLabel id="year-label">Financial Year</InputLabel>
                            <Select
                                labelId="year-label"
                                id="year-select"
                                value={selectedYear}
                                label="Financial Year"
                                onChange={(e) => setSelectedYear(e.target.value as number)}
                                disabled={isLoadingTypes || formattedYears.length === 0}
                            >
                                {formattedYears.map((year) => (
                                    <MenuItem key={year.value} value={year.value}>
                                        {year.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 140 }}>
                            <InputLabel id="month-label">Month</InputLabel>
                            <Select
                                labelId="month-label"
                                id="month-select"
                                value={selectedMonth}
                                label="Month"
                                onChange={(e) => setSelectedMonth(e.target.value)}
                            >
                                {months.map((month) => (
                                    <MenuItem
                                        key={month.value}
                                        value={month.value}
                                        disabled={isMonthDisabled(month.value)}
                                        sx={{
                                            display: isMonthDisabled(month.value) ? 'none' : 'flex'
                                        }}
                                    >
                                        {month.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 180 }}>
                            <InputLabel id="structure-type-label">Salary Structure</InputLabel>
                            <Select
                                labelId="structure-type-label"
                                id="structure-type-select"
                                value={selectedStructureType}
                                label="Salary Structure"
                                onChange={(e) => setSelectedStructureType(e.target.value)}
                                disabled={isLoadingTypes}
                            >
                                {structureTypesData?.data?.salaryStructureTypes?.map((type) => (
                                    <MenuItem key={type.type} value={type.type}>
                                        {type.type.replace(/_/g, " ")}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>

                    {/* Stage Indicator moved to top right */}
                    {selectedStructureType && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
                            <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                Current Stage:
                            </Typography>
                            <Box sx={{
                                px: 1.5, py: 0.5, borderRadius: 10,
                                bgcolor: currentStepTrack === 4 ? '#e8f5e9' :
                                    currentStepTrack === 3 ? '#e3f2fd' :
                                        currentStepTrack === 2 ? '#fff3e0' : '#f5f5f5',
                                color: currentStepTrack === 4 ? '#2e7d32' :
                                    currentStepTrack === 3 ? '#1976d2' :
                                        currentStepTrack === 2 ? '#ed6c02' : '#757575',
                                fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase'
                            }}>
                                {currentStepTrack === 1 || currentStepTrack === null ? "Preparation" :
                                    currentStepTrack === 2 ? "Finance Verification" :
                                        currentStepTrack === 3 ? "Generate Salary" :
                                            currentStepTrack === 4 ? "Completed" : `Step ${currentStepTrack}`}
                            </Box>
                        </Box>
                    )}

                    {/* Second Row: Extensive Action Buttons (Now inside the same card) */}
                    {selectedStructureType && employeeListData?.employeeList && employeeListData.employeeList.length > 0 && (
                        <Box sx={{
                            mt: 2.5, pt: 2, borderTop: '1px solid #edf2f7',
                            display: "flex", flexWrap: "wrap", gap: 1,
                            alignItems: "center", justifyContent: "flex-end",
                            width: '100%'
                        }}>
                            <Button
                                variant="outlined" color="success" size="small"
                                onClick={handleExportReport} disabled={isLoadingEmployees}
                                startIcon={<DownloadIcon />} sx={{ textTransform: 'none' }}
                            >
                                XL Report
                            </Button>
                            <Button
                                variant="outlined" color="secondary" size="small"
                                onClick={handleExportPdfReport} disabled={isLoadingEmployees}
                                startIcon={<DownloadIcon />} sx={{ textTransform: 'none' }}
                            >
                                PDF Report
                            </Button>

                            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                            {/* Workflow Buttons */}
                            <Button
                                variant="outlined" color="inherit" size="small"
                                onClick={() => navigate("/salary-transfer/timelines")}
                                sx={{ textTransform: 'none' }}
                            >
                                Timelines
                            </Button>
                            <Button variant="outlined" color="primary" size="small" sx={{ textTransform: 'none' }}>
                                Forward to Finance
                            </Button>
                            <Button variant="outlined" color="primary" size="small" sx={{ textTransform: 'none' }}>
                                Forward to HR
                            </Button>
                            <Button variant="outlined" color="warning" size="small" sx={{ textTransform: 'none' }}>
                                Revert to HR
                            </Button>
                            <Button variant="outlined" color="warning" size="small" sx={{ textTransform: 'none' }}>
                                Revert to Finance
                            </Button>
                            <Button variant="contained" color="secondary" size="small" sx={{ textTransform: 'none' }}>
                                Enable Salary Slip
                            </Button>

                            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                            {/* Final Approve (Generate Salary) */}
                            <Button
                                variant="contained" color="success" size="small"
                                onClick={handleSubmit}
                                disabled={
                                    generateSalaryMutation.isPending ||
                                    isLoadingEmployees ||
                                    employeeListData.employeeList.every((emp: any) => emp.salaryStatus === "generated")
                                }
                                startIcon={generateSalaryMutation.isPending ? <CircularProgress size={16} color="inherit" /> : null}
                                sx={{ px: 3, fontWeight: 700, textTransform: 'none' }}
                            >
                                {generateSalaryMutation.isPending
                                    ? "Processing..."
                                    : employeeListData.employeeList.every((emp: any) => emp.salaryStatus === "generated")
                                        ? "Approved"
                                        : "Generate Salary"
                                }
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>
            <Box sx={{ flex: 1, overflow: "auto", minHeight: 0 }}>
                {renderTable()}
            </Box>

            {/* Confirmation Dialog */}
            <Dialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'warning.main', fontWeight: 700 }}>
                    <WarningAmberIcon fontSize="large" />
                    Pending Attendance Data
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <DialogContentText sx={{ color: 'text.primary', fontSize: '1rem', mb: 2 }}>
                        We found <strong>{counts.skipped}</strong> employee(s) who don't have attendance recorded for this period.
                    </DialogContentText>
                    <Alert severity="warning" sx={{ borderRadius: 2 }}>
                        Salaries will <strong>NOT</strong> be generated for records with zero or empty attendance.
                        Do you want to proceed with the remaining <strong>{counts.valid}</strong> employee(s)?
                    </Alert>
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button
                        onClick={() => setConfirmDialogOpen(false)}
                        variant="outlined"
                        color="inherit"
                        sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                        Back to Edit
                    </Button>
                    <Button
                        onClick={() => {
                            setConfirmDialogOpen(false);
                            const employeeData = currentTableData.length > 0 ? currentTableData : (employeeListData?.employeeList || []);
                            const validEmployees = employeeData.filter((emp: any) => emp.attendance !== null && emp.attendance !== undefined && emp.attendance > 0);
                            openCommentDialog(validEmployees);
                        }}
                        variant="contained"
                        color="warning"
                        sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
                        autoFocus
                    >
                        Proceed to Generate
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Comment & Status Dialog */}
            <Dialog
                open={commentDialogOpen}
                onClose={() => setCommentDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
            >
                <DialogTitle sx={{ fontWeight: 700 }}>
                    Add Timeline Details
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <TextField
                        label="Comment"
                        multiline
                        minRows={1}
                        fullWidth
                        value={timelineComment}
                        onChange={(e) => setTimelineComment(e.target.value)}
                        placeholder="Enter your comment before generating salary"
                        sx={{ mt: 1.5 }}
                    />
                    <FormControl sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Status
                        </Typography>
                        <RadioGroup
                            row
                            value={timelineStatus}
                            onChange={(e) => setTimelineStatus(e.target.value as "Pending" | "Rejected" | "Approved")}
                        >
                            <FormControlLabel value="Pending" control={<Radio />} label="Pending" />
                            <FormControlLabel value="Rejected" control={<Radio />} label="Rejected" />
                            <FormControlLabel value="Approved" control={<Radio />} label="Approved" />
                        </RadioGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={() => setCommentDialogOpen(false)}
                        variant="outlined"
                        color="inherit"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmCommentAndGenerate}
                        variant="contained"
                        disabled={generateSalaryMutation.isPending}
                    >
                        Proceed to Generate
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Result Summary Dialog */}
            <Dialog
                open={resultDialogOpen}
                onClose={() => setResultDialogOpen(false)}
                maxWidth="xs"
                fullWidth
                PaperProps={{ sx: { borderRadius: 4, p: 2, textAlign: 'center' } }}
            >
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                    {resultCounts.failed > 0 ? (
                        <ErrorOutlineIcon sx={{ fontSize: 80, color: resultCounts.success > 0 ? 'orange' : 'error.main', mb: 2 }} />
                    ) : (
                        <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                    )}

                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                        {resultCounts.failed === 0 ? "Perfect!" : (resultCounts.success > 0 ? "Partially Generated" : "Generation Failed")}
                    </Typography>

                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        {resultCounts.failed === 0
                            ? `Successfully generated salaries for all ${resultCounts.success} employees.`
                            : `Successfully generated: ${resultCounts.success} | Failed: ${resultCounts.failed}`
                        }
                    </Typography>

                    <Button
                        onClick={() => setResultDialogOpen(false)}
                        variant="contained"
                        fullWidth
                        sx={{ borderRadius: 2, py: 1.5, textTransform: 'none', fontSize: '1rem', fontWeight: 600 }}
                    >
                        Close Summary
                    </Button>
                </DialogContent>
            </Dialog>
        </Box>
    );
};
