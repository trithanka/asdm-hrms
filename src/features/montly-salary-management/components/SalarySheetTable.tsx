import { useState, useEffect, useRef } from "react";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Checkbox,
    Tooltip,
    IconButton,
    CircularProgress,
} from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt";
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
}

interface SalarySheetTableProps {
    data: SalarySheetData[];
    onDataChange?: (updatedData: SalarySheetData[]) => void;
    onSelectionChange?: (selectedIds: number[]) => void;
    month?: string;
    year?: string;
}

export const SalarySheetTable = ({ data, onDataChange, onSelectionChange, month = "", year = "" }: SalarySheetTableProps) => {
    const [tableData, setTableData] = useState<SalarySheetData[]>(data);
    const [selected, setSelected] = useState<number[]>([]);
    const [generatingId, setGeneratingId] = useState<number | null>(null);
    const lastMonthYearRef = useRef<string>(`${month}-${year}`);

    const salarySlipMutation = useSalarySlip();

    // Update table data when month/year changes
    useEffect(() => {
        const currentMonthYear = `${month}-${year}`;
        if (currentMonthYear !== lastMonthYearRef.current) {
            // Month/year changed - reset data with new data
            setTableData(data);
            lastMonthYearRef.current = currentMonthYear;
        }
    }, [month, year, data]);

    // Initial load - only when table is empty
    useEffect(() => {
        if (tableData.length === 0 && data.length > 0) {
            setTableData(data);
        }
    }, [data, tableData.length]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        id: number | null,
        field: keyof SalarySheetData
    ) => {
        const { value } = e.target;
        const updatedData = tableData.map((row, index) => {
            // Use employeeId as fallback if pklSalaryBreakingAsdmNescEmployeeWiseId is null
            const rowId = row.pklSalaryBreakingAsdmNescEmployeeWiseId ?? row.employeeId;
            const matchId = id ?? rowId;

            if (rowId === matchId || (id === null && index === tableData.indexOf(row))) {
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
        setTableData(updatedData);
        if (onDataChange) {
            onDataChange(updatedData);
        }
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = tableData.map((n) => n.pklSalaryBreakingAsdmNescEmployeeWiseId || n.employeeId);
            setSelected(newSelected);
            if (onSelectionChange) {
                onSelectionChange(newSelected);
            }
            return;
        }
        setSelected([]);
        if (onSelectionChange) {
            onSelectionChange([]);
        }
    };

    const handleRowClick = (id: number) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: number[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }

        setSelected(newSelected);
        if (onSelectionChange) {
            onSelectionChange(newSelected);
        }
    };

    const isSelected = (id: number) => selected.indexOf(id) !== -1;

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
                            padding="checkbox"
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
                            }}
                        >
                            <Checkbox
                                color="primary"
                                indeterminate={selected.length > 0 && selected.length < tableData.length}
                                checked={tableData.length > 0 && selected.length === tableData.length}
                                onChange={handleSelectAllClick}
                            />
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
                                backgroundColor: "#f3e5f5",
                                userSelect: "none",
                                textAlign: "center",
                                minWidth: 120,
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
                        const isItemSelected = isSelected(rowId);
                        return (
                            <TableRow key={rowId} hover selected={isItemSelected}>
                                <TableCell
                                    padding="checkbox"
                                    sx={{
                                        border: "1px solid #ddd",
                                        position: "sticky",
                                        left: 0,
                                        bgcolor: isItemSelected ? "#f5f5f5" : "white",
                                        zIndex: 10
                                    }}
                                >
                                    <Checkbox
                                        color="primary"
                                        checked={isItemSelected}
                                        onChange={() => handleRowClick(rowId)}
                                    />
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #ddd",
                                        position: "sticky",
                                        left: 48,
                                        bgcolor: isItemSelected ? "#f5f5f5" : "white",
                                        zIndex: 10
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
                                    {row.basicPay.toLocaleString()}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #ddd",
                                        textAlign: "right",
                                        backgroundColor: "#fff3e0",
                                    }}
                                >
                                    {(row.incrementPercentValueFy ?? 0).toLocaleString()}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd", textAlign: "right", bgcolor: "#fff8f1" }}>
                                    {(row.salary ?? 0).toLocaleString()}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd", textAlign: "right", bgcolor: "#f5f3ff" }}>
                                    {(row.houseRentPercentValue ?? 0).toLocaleString()}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd", textAlign: "right", bgcolor: "#f5f3ff" }}>
                                    {row.mobileInternet.toLocaleString()}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd", textAlign: "right", bgcolor: "#f5f3ff" }}>
                                    {row.newsPaperMagazine.toLocaleString()}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd", textAlign: "right", bgcolor: "#f5f3ff" }}>
                                    {row.conveyanceAllowances.toLocaleString()}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd", textAlign: "right", bgcolor: "#f5f3ff" }}>
                                    {row.educationAllowance.toLocaleString()}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd", textAlign: "right", p: 0.5 }}>
                                    <TextField
                                        size="small"
                                        type="number"
                                        value={row.arrear ?? ""}
                                        onChange={(e) => handleChange(e, rowId, "arrear")}
                                        InputProps={{
                                        }}
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
                                    {(row.totalSalary ?? 0).toLocaleString()}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #ddd",
                                        textAlign: "right",
                                        backgroundColor: "#fffde7",
                                    }}
                                >
                                    {(row.deductionOfPtax ?? 0).toLocaleString()}
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
                                        InputProps={{
                                        }}
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
                                        InputProps={{
                                        }}
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
                                    {(row.totalDeduction ?? 0).toLocaleString()}
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
                                    {(row.netAmount ?? 0).toLocaleString()}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #ddd",
                                        textAlign: "center",
                                        fontWeight: 600,
                                        color: row.salaryStatus === "generated" ? "green" : "orange",
                                        textTransform: "capitalize",
                                    }}
                                >
                                    {row.salaryStatus}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd", textAlign: "center" }}>
                                    {row.salaryStatus === "generated" && (
                                        <Tooltip title="Generate Salary Receipt">
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
            </Table>
        </TableContainer>
    );
};
