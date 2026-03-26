import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { SalarySheetTable } from "./SalarySheetTable";
import { BankTransferTable } from "./BankTransferTable";
import { TaxDeductionTable } from "./TaxDeductionTable";

interface SalaryTableRendererProps {
    selectedStructureType: string;
    isLoadingEmployees: boolean;
    employeeError: any;
    employeeData: any[];
    selectedMonth: string;
    selectedYear: number | "";
    resolvedRoleId: number;
    currentStepTrack: number | null;
    onDataChange: (data: any[]) => void;
}

export function SalaryTableRenderer({
    selectedStructureType,
    isLoadingEmployees,
    employeeError,
    employeeData,
    selectedMonth,
    selectedYear,
    resolvedRoleId,
    currentStepTrack,
    onDataChange,
}: SalaryTableRendererProps) {
    if (!selectedStructureType) {
        return (
            <Box
                sx={{
                    mt: 3, p: 4, textAlign: "center",
                    border: "2px dashed #e0e0e0",
                    borderRadius: 2, backgroundColor: "#fafafa",
                }}
            >
                <Typography variant="body1" color="text.secondary">
                    Please select a salary structure type to view the data
                </Typography>
            </Box>
        );
    }

    if (isLoadingEmployees) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3, p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (employeeError) {
        return (
            <Box sx={{ mt: 3 }}>
                <Alert severity="error">Failed to load employee data. Please try again.</Alert>
            </Box>
        );
    }

    if (!employeeData.length) {
        return (
            <Box
                sx={{
                    mt: 3, p: 4, textAlign: "center",
                    border: "2px dashed #e0e0e0",
                    borderRadius: 2, backgroundColor: "#fafafa",
                }}
            >
                <Typography variant="body1" color="text.secondary">
                    No employee data found for the selected criteria
                </Typography>
            </Box>
        );
    }

    const yearStr = selectedYear ? selectedYear.toString() : "";

    switch (selectedStructureType) {
        case "ASDM_NESC":
            return (
                <SalarySheetTable
                    data={employeeData as any}
                    onDataChange={onDataChange}
                    month={selectedMonth}
                    year={yearStr}
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
                    onDataChange={onDataChange}
                    month={selectedMonth}
                    year={yearStr}
                />
            );
    }
}
