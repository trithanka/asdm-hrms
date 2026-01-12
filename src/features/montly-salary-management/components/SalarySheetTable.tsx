import { useState, useEffect } from "react";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    IconButton,
    CircularProgress,
} from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { generateSalarySlip } from "../utils/generateSalarySlip";
import { useSalarySlip } from "../hooks/useGetSalaryFile";
import toast from "react-hot-toast";

export interface SalarySheetData {
    employeeId: number;
    pklSalaryBreakingAsdmNescEmployeeWiseId: number | null;
    fullName: string;
    designationName: string;
    designationCategory: string;
    attendance: number | null;
    lwpDays: number | null;
    basicPay: number;
    incrementPercentage: number;
    incrementPercentValueFy: number | null;
    fullSalary: number | null;
    salary: number | null;
    houseRent: number;
    houseRentPercentValue: number | null;
    mobileInternet: number;
    newsPaperMagazine: number;
    conveyanceAllowances: number;
    educationAllowance: number;
    arrear: number | null;
    totalSalary: number | null;
    deductionOfPtax: number;
    deductionIncomeTax: number | null;
    ddvancesOtherDeductions: number | null;
    totalDeduction: number | null;
    netAmount: number | null;
    salaryStatus: string;
    workingDays?: number;
}

interface SalarySheetTableProps {
    data: SalarySheetData[];
    onDataChange?: (updatedData: SalarySheetData[]) => void;
    month?: string;
    year?: string;
}

export const SalarySheetTable = ({ data, onDataChange, month = "", year = "" }: SalarySheetTableProps) => {
    const [tableData, setTableData] = useState<SalarySheetData[]>(data);
    const [generatingId, setGeneratingId] = useState<number | null>(null);

    const salarySlipMutation = useSalarySlip();

    const recalculateRow = (row: SalarySheetData) => {
        // If already generated, return as is (do not recalculate)
        if (row.salaryStatus === "generated") return row;

        // Find original values from the 'data' prop (API data) as base
        const originalRow = data.find(r => (r.pklSalaryBreakingAsdmNescEmployeeWiseId || r.employeeId) === (row.pklSalaryBreakingAsdmNescEmployeeWiseId || row.employeeId));
        if (!originalRow) return row;

        const workingDays = Number((originalRow as any).workingDays || row.workingDays || 30);
        const attendance = Number(row.attendance ?? 0);

        // Base monthly values from the original row (masters)
        const baseBasicPay = Number(originalRow.basicPay || 0);
        const incrementPercentage = Number(originalRow.incrementPercentage || 0);

        // Use fullSalary from row if it exists (it's often pre-calculated by backend with last FY logic)
        // fall back to calculating from basic + increment
        let fullSalary = Number(row.fullSalary || originalRow.fullSalary || 0);
        if (!fullSalary) {
            const incrementAmount = (baseBasicPay * incrementPercentage) / 100;
            fullSalary = baseBasicPay + incrementAmount;
        }

        // formulas from user
        const salary = (fullSalary / workingDays) * attendance;

        const houseRentPercent = Number(row.houseRent || originalRow.houseRent || 0);
        const houseRentAmount = (salary * houseRentPercent) / 100;

        const baseMobile = Number(originalRow.mobileInternet || 0);
        const mobileInternet = (baseMobile / workingDays) * attendance;

        const baseNews = Number(originalRow.newsPaperMagazine || 0);
        const newsPaperMagazine = (baseNews / workingDays) * attendance;

        const baseConv = Number(originalRow.conveyanceAllowances || 0);
        const conveyanceAllowances = (baseConv / workingDays) * attendance;

        const baseEdu = Number(originalRow.educationAllowance || 0);
        const educationAllowance = (baseEdu / workingDays) * attendance;

        const arrear = Number(row.arrear || 0);
        const totalSalary = salary + houseRentAmount + mobileInternet + newsPaperMagazine + conveyanceAllowances + educationAllowance + arrear;

        const pTax = Number(row.deductionOfPtax || 0);
        const incTax = Number(row.deductionIncomeTax || 0);
        const otherDed = Number(row.ddvancesOtherDeductions || 0);

        const totalDeduction = pTax + incTax + otherDed;
        const netAmount = totalSalary - totalDeduction;

        const incrementPercentValueFy = (baseBasicPay * incrementPercentage) / 100;

        return {
            ...row,
            incrementPercentValueFy,
            salary,
            houseRentPercentValue: houseRentAmount,
            mobileInternet,
            newsPaperMagazine,
            conveyanceAllowances,
            educationAllowance,
            totalSalary,
            totalDeduction,
            netAmount
        };
    };

    // Update table data when month/year changes or data arrives
    useEffect(() => {
        if (data.length > 0) {
            const calculatedData = data.map(row => recalculateRow(row));
            setTableData(calculatedData);
        }
    }, [data, month, year]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        id: number | null,
        field: keyof SalarySheetData
    ) => {
        const { value } = e.target;
        const updatedData = tableData.map((row, idx) => {
            const rowId = row.pklSalaryBreakingAsdmNescEmployeeWiseId ?? row.employeeId;
            const matchId = id ?? rowId;

            if (rowId === matchId || (id === null && idx === tableData.indexOf(row))) {
                return {
                    ...row,
                    [field]:
                        field === "attendance" ||
                            field === "lwpDays" ||
                            field === "arrear" ||
                            field === "deductionOfPtax" ||
                            field === "deductionIncomeTax" ||
                            field === "ddvancesOtherDeductions"
                            ? (value === "" || value === null || value === undefined ? null : (isNaN(parseFloat(value)) ? null : parseFloat(value)))
                            : value,
                };
            }
            return row;
        });

        // Apply calculations to the changed row
        const recalculatedData = updatedData.map((row) => {
            const rowIdVal = row.pklSalaryBreakingAsdmNescEmployeeWiseId ?? row.employeeId;
            const matchIdVal = id ?? rowIdVal;
            if (rowIdVal === matchIdVal) {
                return recalculateRow(row);
            }
            return row;
        });

        setTableData(recalculatedData);
        if (onDataChange) {
            onDataChange(recalculatedData);
        }
    };


    const formatValue = (value: number | null | undefined) => {
        if (value === null || value === undefined) return "0.00";
        return value.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const handleGenerateReceipt = async (row: SalarySheetData) => {
        if (!month || !year) {
            toast.error("Please select month and year first");
            return;
        }

        const rowId = row.pklSalaryBreakingAsdmNescEmployeeWiseId || row.employeeId;
        setGeneratingId(rowId);

        try {
            const response = await salarySlipMutation.mutateAsync({
                employeeId: row.employeeId.toString(),
                generateMonth: month,
                generateYear: year.toString(),
            });

            if (response.status === "success" && response.data && response.data.length > 0) {
                generateSalarySlip(response.data[0]);
                toast.success("Salary slip generated successfully");
            } else {
                toast.error(response.message || "Failed to generate salary slip");
            }
        } catch (error: any) {
            console.error("Error generating salary slip:", error);
            toast.error(error?.response?.data?.message || "Failed to generate salary slip");
        } finally {
            setGeneratingId(null);
        }
    };

    return (
        <TableContainer
            component={Paper}
            sx={{
                mt: 3,
                overflowX: "auto",
                overflowY: "auto",
                maxHeight: "calc(100vh - 280px)",
                width: "100%",
                maxWidth: "100%",
                position: "relative"
            }}
        >
            <Table sx={{ minWidth: 1600 }} size="small" stickyHeader>
                <TableHead>
                    <TableRow sx={{ userSelect: "none" }}>
                        <TableCell
                            sx={{
                                fontWeight: 700,
                                fontSize: "0.75rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                border: "1px solid #ddd",
                                position: "sticky",
                                left: 0,
                                zIndex: 11,
                                bgcolor: "#f5f5f5",
                                textAlign: "center",
                                minWidth: 60,
                            }}
                        >
                            Status
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: 700,
                                fontSize: "0.75rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                border: "1px solid #ddd",
                                userSelect: "none",
                                position: "sticky",
                                left: 48,
                                zIndex: 11,
                                bgcolor: "#f5f5f5",
                                minWidth: 150,
                            }}
                        >
                            Name
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: 700,
                                fontSize: "0.75rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                border: "1px solid #ddd",
                                userSelect: "none",
                                minWidth: 150,
                            }}
                        >
                            Designation/Category
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", border: "1px solid #ddd", backgroundColor: "#e3f2fd", userSelect: "none", textAlign: "center", minWidth: 100 }}>
                            Attendance
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", border: "1px solid #ddd", backgroundColor: "#e3f2fd", userSelect: "none", textAlign: "center", minWidth: 100 }}>
                            LWP Days
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", border: "1px solid #ddd", backgroundColor: "#fff3e0", userSelect: "none", textAlign: "right", minWidth: 110 }}>
                            Basic Pay
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: 700,
                                fontSize: "0.75rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                border: "1px solid #ddd",
                                backgroundColor: "#ff9800",
                                color: "white",
                                userSelect: "none",
                                textAlign: "right",
                                minWidth: 120,
                            }}
                        >
                            Incr ({tableData[0]?.incrementPercentage || 0}%)
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", border: "1px solid #ddd", backgroundColor: "#fff3e0", userSelect: "none", textAlign: "right", minWidth: 110 }}>
                            Salary
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", border: "1px solid #ddd", backgroundColor: "#ede7f6", userSelect: "none", textAlign: "right", minWidth: 110 }}>
                            HRA ({tableData[0]?.houseRent || 0}%)
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", border: "1px solid #ddd", backgroundColor: "#ede7f6", userSelect: "none", textAlign: "right", minWidth: 120 }}>
                            Mob/Int
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", border: "1px solid #ddd", backgroundColor: "#ede7f6", userSelect: "none", textAlign: "right", minWidth: 120 }}>
                            News/Mag
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", border: "1px solid #ddd", backgroundColor: "#ede7f6", userSelect: "none", textAlign: "right", minWidth: 140 }}>
                            Conv. Allw
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", border: "1px solid #ddd", backgroundColor: "#ede7f6", userSelect: "none", textAlign: "right", minWidth: 140 }}>
                            Edu. Allw
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", border: "1px solid #ddd", backgroundColor: "#c8e6c9", userSelect: "none", textAlign: "right", minWidth: 100 }}>
                            Arrear
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: 700,
                                fontSize: "0.75rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                border: "1px solid #ddd",
                                backgroundColor: "#4caf50",
                                color: "white",
                                userSelect: "none",
                                textAlign: "right",
                                minWidth: 120,
                            }}
                        >
                            Total Pay
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: 700,
                                fontSize: "0.75rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                border: "1px solid #ddd",
                                backgroundColor: "#fff9c4",
                                userSelect: "none",
                                textAlign: "right",
                                minWidth: 120,
                            }}
                        >
                            P-Tax
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: 700,
                                fontSize: "0.75rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                border: "1px solid #ddd",
                                backgroundColor: "#fff9c4",
                                userSelect: "none",
                                textAlign: "right",
                                minWidth: 120,
                            }}
                        >
                            Inc Tax
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: 700,
                                fontSize: "0.75rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                border: "1px solid #ddd",
                                backgroundColor: "#fff9c4",
                                userSelect: "none",
                                textAlign: "right",
                                minWidth: 140,
                            }}
                        >
                            Adv/Oth Ded
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: 700,
                                fontSize: "0.75rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                border: "1px solid #ddd",
                                backgroundColor: "#fbc02d",
                                color: "white",
                                userSelect: "none",
                                textAlign: "right",
                                minWidth: 130,
                            }}
                        >
                            Total Ded
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: 700,
                                fontSize: "0.75rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                border: "1px solid #ddd",
                                backgroundColor: "#00796b",
                                color: "white",
                                userSelect: "none",
                                textAlign: "right",
                                minWidth: 130,
                            }}
                        >
                            Net Amount
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: 700,
                                fontSize: "0.75rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                border: "1px solid #ddd",
                                userSelect: "none",
                                textAlign: "center",
                                minWidth: 100,
                            }}
                        >
                            Acn
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tableData.map((row) => {
                        const rowId = row.pklSalaryBreakingAsdmNescEmployeeWiseId || row.employeeId;
                        return (
                            <TableRow key={rowId} hover>
                                <TableCell
                                    sx={{
                                        border: "1px solid #ddd",
                                        position: "sticky",
                                        left: 0,
                                        bgcolor: "white",
                                        zIndex: 11,
                                        textAlign: "center"
                                    }}
                                >
                                    {row.salaryStatus === "generated" ? (
                                        <CheckCircleIcon fontSize="small" sx={{ color: 'success.main' }} />
                                    ) : (
                                        <ReportProblemIcon fontSize="small" sx={{ color: 'warning.main' }} />
                                    )}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #ddd",
                                        position: "sticky",
                                        left: 60,
                                        zIndex: 11,
                                        bgcolor: "white",
                                        minWidth: 150,
                                    }}
                                >
                                    {row.fullName}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #ddd"
                                    }}
                                >
                                    {row.designationCategory}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", p: 0.5 }}>
                                    <TextField
                                        size="small"
                                        type="number"
                                        value={row.attendance ?? ""}
                                        onChange={(e) => handleChange(e, rowId, "attendance")}
                                        inputProps={{ min: 0, max: 31 }}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                fontSize: "0.875rem",
                                            },
                                            "& input": {
                                                textAlign: "center",
                                                padding: "4px 8px",
                                            },
                                        }}
                                    />
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", p: 0.5 }}>
                                    <TextField
                                        size="small"
                                        type="number"
                                        value={row.lwpDays ?? ""}
                                        onChange={(e) => handleChange(e, rowId, "lwpDays")}
                                        inputProps={{ min: 0 }}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                fontSize: "0.875rem",
                                            },
                                            "& input": {
                                                textAlign: "center",
                                                padding: "4px 8px",
                                            },
                                        }}
                                    />
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd", textAlign: "right", bgcolor: "#fff8f1" }}>
                                    {formatValue(row.basicPay)}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #ddd",
                                        textAlign: "right",
                                        backgroundColor: "#fff3e0",
                                    }}
                                >
                                    {formatValue(row.incrementPercentValueFy)}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd", textAlign: "right", bgcolor: "#fff8f1" }}>
                                    {formatValue(row.salary)}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd", textAlign: "right", bgcolor: "#f5f3ff" }}>
                                    {formatValue(row.houseRentPercentValue)}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd", textAlign: "right", bgcolor: "#f5f3ff" }}>
                                    {formatValue(row.mobileInternet)}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd", textAlign: "right", bgcolor: "#f5f3ff" }}>
                                    {formatValue(row.newsPaperMagazine)}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd", textAlign: "right", bgcolor: "#f5f3ff" }}>
                                    {formatValue(row.conveyanceAllowances)}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd", textAlign: "right", bgcolor: "#f5f3ff" }}>
                                    {formatValue(row.educationAllowance)}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd", textAlign: "right", p: 0.5 }}>
                                    <TextField
                                        size="small"
                                        type="number"
                                        value={row.arrear ?? ""}
                                        onChange={(e) => handleChange(e, rowId, "arrear")}
                                        inputProps={{ min: 0 }}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                fontSize: "0.875rem",
                                            },
                                            "& input": {
                                                textAlign: "right",
                                                padding: "4px 8px",
                                            },
                                        }}
                                    />
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #ddd",
                                        textAlign: "right",
                                        fontWeight: 600,
                                        backgroundColor: "#f1f8e9",
                                    }}
                                >
                                    {formatValue(row.totalSalary)}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #ddd",
                                        textAlign: "right",
                                        backgroundColor: "#fffde7",
                                    }}
                                >
                                    {formatValue(row.deductionOfPtax)}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #ddd",
                                        textAlign: "right",
                                        backgroundColor: "#fffde7",
                                        p: 0.5,
                                    }}
                                >
                                    <TextField
                                        size="small"
                                        type="number"
                                        value={row.deductionIncomeTax ?? ""}
                                        onChange={(e) => handleChange(e, rowId, "deductionIncomeTax")}
                                        inputProps={{ min: 0 }}
                                        sx={{
                                            backgroundColor: "#fffde7",
                                            "& .MuiOutlinedInput-root": {
                                                fontSize: "0.875rem",
                                            },
                                            "& input": {
                                                textAlign: "right",
                                                padding: "4px 8px",
                                            },
                                        }}
                                    />
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #ddd",
                                        textAlign: "right",
                                        backgroundColor: "#fffde7",
                                        p: 0.5,
                                    }}
                                >
                                    <TextField
                                        size="small"
                                        type="number"
                                        value={row.ddvancesOtherDeductions ?? ""}
                                        onChange={(e) => handleChange(e, rowId, "ddvancesOtherDeductions")}
                                        inputProps={{ min: 0 }}
                                        sx={{
                                            backgroundColor: "#fffde7",
                                            "& .MuiOutlinedInput-root": {
                                                fontSize: "0.875rem",
                                            },
                                            "& input": {
                                                textAlign: "right",
                                                padding: "4px 8px",
                                            },
                                        }}
                                    />
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #ddd",
                                        textAlign: "right",
                                        fontWeight: 600,
                                        backgroundColor: "#fffde7",
                                    }}
                                >
                                    {formatValue(row.totalDeduction)}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #ddd",
                                        textAlign: "right",
                                        fontWeight: 700,
                                        backgroundColor: "#e0f2f1",
                                        color: "#00695c",
                                    }}
                                >
                                    {formatValue(row.netAmount)}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd", textAlign: "center" }}>
                                    {row.salaryStatus === "generated" && (
                                        <Tooltip title="Generate Salary Slip">
                                            <span>
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => handleGenerateReceipt(row)}
                                                    disabled={generatingId === rowId}
                                                >
                                                    {generatingId === rowId ? (
                                                        <CircularProgress size={20} />
                                                    ) : (
                                                        <ReceiptIcon />
                                                    )}
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                    )}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table >
        </TableContainer >
    );
};
