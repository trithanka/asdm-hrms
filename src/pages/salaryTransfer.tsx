import { useState } from "react";
import {
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Button,
    CircularProgress,
    Alert,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { SalarySheetTable } from "../features/montly-salary-management/components/SalarySheetTable";
import { BankTransferTable } from "../features/montly-salary-management/components/BankTransferTable";
import { TaxDeductionTable } from "../features/montly-salary-management/components/TaxDeductionTable";
import { useSalaryStructureTypes, useEmployeeList, useGenerateSalary } from "../features/montly-salary-management/hooks/useGetSalaryFile";
import { useExportSalaryReport } from "../features/montly-salary-management/hooks/useExportSalaryReport";

import toast from "react-hot-toast";
const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
];

// Generate years: current year, next year, and 2 previous years
const generateYears = () => {
    const currentYear = new Date().getFullYear();
    return [
        { value: currentYear - 2, label: (currentYear - 2).toString() },
        { value: currentYear - 1, label: (currentYear - 1).toString() },
        { value: currentYear, label: `${currentYear} (Current)` },
        { value: currentYear + 1, label: (currentYear + 1).toString() },
    ];
};

export const SalaryTransfer = () => {

    const [selectedStructureType, setSelectedStructureType] = useState<string>("");
    const [selectedMonth, setSelectedMonth] = useState<string>("");
    const [selectedYear, setSelectedYear] = useState<number>(
        new Date().getFullYear()
    );
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<number[]>([]);
    const [currentTableData, setCurrentTableData] = useState<any[]>([]);

    const years = generateYears();

    // Fetch salary structure types
    const { data: structureTypesData, isLoading: isLoadingTypes } = useSalaryStructureTypes();

    // Fetch employee list based on selected filters
    const { data: employeeListData, isLoading: isLoadingEmployees, error: employeeError } = useEmployeeList(
        selectedStructureType,
        selectedMonth,
        selectedYear.toString()
    );

    const generateSalaryMutation = useGenerateSalary();
    const { exportToExcel } = useExportSalaryReport();


    const handleSalaryDataChange = (updatedData: any[]) => {
        setCurrentTableData(updatedData);
    };

    const handleSelectionChange = (selectedIds: number[]) => {
        setSelectedEmployeeIds(selectedIds);
    };

    const handleExportReport = () => {
        // Use currentTableData if available (contains user edits), otherwise fall back to API data
        const employeeData = currentTableData.length > 0
            ? currentTableData
            : (employeeListData?.employeeList || []);

        if (employeeData.length === 0) {
            toast.error("No data available to export");
            return;
        }

        const fileName = exportToExcel(employeeData, {
            month: selectedMonth,
            year: selectedYear.toString(),
            structureType: selectedStructureType,
        });

        if (fileName) {
            toast.success(`Report downloaded: ${fileName}`);
        } else {
            toast.error("Failed to export report");
        }
    };

    const handleSubmit = async () => {
        // Use currentTableData if available (contains user edits), otherwise fall back to API data
        const employeeData = currentTableData.length > 0 ? currentTableData : (employeeListData?.employeeList || []);

        // If no employees selected, use all employees; otherwise use selected ones
        const employeesToSubmit = selectedEmployeeIds.length > 0
            ? employeeData.filter((emp: any) => {
                const empId = emp.pklSalaryBreakingAsdmNescEmployeeWiseId || emp.employeeId;
                return empId && selectedEmployeeIds.includes(empId);
            })
            : employeeData;

        if (employeesToSubmit.length === 0) {
            toast.error("No employees to submit");
            return;
        }

        // Prepare payload with edited values
        const generateEmployees = employeesToSubmit.map((emp: any) => ({
            employeeId: emp.employeeId,
            attendance: emp.attendance ?? 0,
            lwp: emp.lwpDays ?? 0,
            arear: emp.arrear ?? 0,
            incomeTax: emp.deductionIncomeTax ?? 0,
            otherDeduction: emp.ddvancesOtherDeductions ?? 0,
        }));

        const payload = {
            salaryStructureType: selectedStructureType,
            generateMonth: selectedMonth,
            generateYear: selectedYear.toString(),
            generateEmployees,
        };

        console.log("Payload being sent:", JSON.stringify(payload, null, 2));

        try {
            const response = await generateSalaryMutation.mutateAsync(payload);

            const successCount = response.sucessReport.successfullyGenerateCount;
            const failedCount = response.sucessReport.failedGenerateCount;

            if (failedCount > 0 && successCount === 0) {
                // All failed
                toast.error(
                    `Salary generation failed. Success: ${successCount} | Failed: ${failedCount}`,
                    { duration: 6000 }
                );
            } else if (failedCount > 0 && successCount > 0) {
                // Partial success
                toast.success(
                    `Success: ${successCount} | Failed: ${failedCount}`,
                    { duration: 5000 }
                );
                setSelectedEmployeeIds([]);
            } else {
                // Full success
                toast.success(
                    `Salary generated successfully. Success: ${successCount}`,
                    { duration: 4000 }
                );
                setSelectedEmployeeIds([]);
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message;
            toast.error(errorMessage || "Failed to generate salary. Please try again.");
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
                        onSelectionChange={handleSelectionChange}
                        month={selectedMonth}
                        year={selectedYear.toString()}
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
                        onSelectionChange={handleSelectionChange}
                        month={selectedMonth}
                        year={selectedYear.toString()}
                    />
                );
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                    flexWrap: "wrap",
                    gap: 2,
                }}
            >
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Manage Monthly Salary Transfer
                </Typography>

                <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap" }}>
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                        <InputLabel id="year-label">Year</InputLabel>
                        <Select
                            labelId="year-label"
                            id="year-select"
                            value={selectedYear}
                            label="Year"
                            onChange={(e) => setSelectedYear(e.target.value as number)}
                        >
                            {years.map((year) => (
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
                                <MenuItem key={month.value} value={month.value}>
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
            </Box>

            {/* Submit Button */}
            {selectedStructureType && selectedMonth && selectedYear && employeeListData?.employeeList && employeeListData.employeeList.length > 0 && (
                <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end", gap: 2, alignItems: "center" }}>
                    {selectedEmployeeIds.length > 0 && (
                        <Typography variant="body2" color="text.secondary">
                            {selectedEmployeeIds.length} employee(s) selected
                        </Typography>
                    )}
                    {selectedStructureType === "ASDM_NESC" && (
                        <Button
                            variant="outlined"
                            color="success"
                            onClick={handleExportReport}
                            disabled={isLoadingEmployees}
                            startIcon={<DownloadIcon />}
                        >
                            Download Report (XL)
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={generateSalaryMutation.isPending || isLoadingEmployees}
                        startIcon={generateSalaryMutation.isPending ? <CircularProgress size={20} /> : null}
                    >
                        {generateSalaryMutation.isPending
                            ? "Generating..."
                            : `Generate Salary ${selectedEmployeeIds.length > 0 ? `(${selectedEmployeeIds.length})` : "(All)"}`
                        }
                    </Button>
                </Box>
            )}

            {renderTable()}
        </Box>
    );
};