import { useState, useMemo } from "react";
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
import { formatFyMaster } from "../utils/formatter";

import toast from "react-hot-toast";
import { useEffect } from "react";
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

export const SalaryTransfer = () => {

    const [selectedStructureType, setSelectedStructureType] = useState<string>("ASDM_NESC");
    const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString());
    const [selectedYear, setSelectedYear] = useState<number | "">("");
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<number[]>([]);
    const [currentTableData, setCurrentTableData] = useState<any[]>([]);

    // Fetch salary structure types and fyMaster
    const { data: structureTypesData, isLoading: isLoadingTypes } = useSalaryStructureTypes();

    // Format financial years from fyMaster data
    const formattedYears = useMemo(() => {
        if (!structureTypesData?.data?.fyMaster) return [];
        return formatFyMaster(structureTypesData.data.fyMaster);
    }, [structureTypesData]);

    // Fetch employee list based on selected filters
    // Send pklSalaryFinancialYearId as string instead of year
    const { data: employeeListData, isLoading: isLoadingEmployees, error: employeeError } = useEmployeeList(
        selectedStructureType,
        selectedMonth,
        selectedYear ? selectedYear.toString() : undefined
    );

    const generateSalaryMutation = useGenerateSalary();
    const { exportToExcel } = useExportSalaryReport();

    // Set default enabled financial year
    useEffect(() => {
        if (structureTypesData?.data?.fyMaster && selectedYear === "") {
            // Find all enabled financial years
            const enabledYears = structureTypesData.data.fyMaster.filter(fy => fy.bEnabled === 1);
            if (enabledYears.length > 0) {
                // Pick the latest one (highest ID is usually the most recent configuration)
                const latestFy = [...enabledYears].sort((a, b) => b.pklSalaryFinancialYearId - a.pklSalaryFinancialYearId)[0];
                setSelectedYear(latestFy.pklSalaryFinancialYearId);
            }
        }
    }, [structureTypesData, selectedYear]);


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
        // Send null instead of 0 when no value is set
        const generateEmployees = employeesToSubmit.map((emp: any) => ({
            employeeId: emp.employeeId,
            attendance: emp.attendance ?? null,
            lwp: emp.lwpDays ?? null,
            arear: emp.arrear ?? null,
            incomeTax: emp.deductionIncomeTax ?? null,
            otherDeduction: emp.ddvancesOtherDeductions ?? null,
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
                        year={selectedYear ? selectedYear.toString() : ""}
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

                    {/* Actions Group */}
                    {selectedStructureType && selectedMonth && selectedYear !== "" && (
                        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                            {selectedEmployeeIds.length > 0 && (
                                <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                                    {selectedEmployeeIds.length} selected
                                </Typography>
                            )}
                            {selectedStructureType === "ASDM_NESC" && employeeListData?.employeeList && employeeListData.employeeList.length > 0 && (
                                <Button
                                    variant="outlined"
                                    color="success"
                                    size="small"
                                    onClick={handleExportReport}
                                    disabled={isLoadingEmployees}
                                    startIcon={<DownloadIcon />}
                                >
                                    Download Report (XL)
                                </Button>
                            )}
                            {employeeListData?.employeeList && employeeListData.employeeList.length > 0 && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={handleSubmit}
                                    disabled={generateSalaryMutation.isPending || isLoadingEmployees}
                                    startIcon={generateSalaryMutation.isPending ? <CircularProgress size={20} /> : null}
                                >
                                    {generateSalaryMutation.isPending
                                        ? "Generating..."
                                        : `Generate Salary ${selectedEmployeeIds.length > 0 ? `(${selectedEmployeeIds.length})` : "(All)"}`
                                    }
                                </Button>
                            )}
                        </Box>
                    )}
                </Box>
            </Box>
            <Box sx={{ flex: 1, overflow: "auto", minHeight: 0 }}>
                {renderTable()}
            </Box>
        </Box>
    );
};