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
    fullSalary: number | null;
    salary: number | null;
    houseRent: number;
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

    const salarySlipMutation = useSalarySlip();

    // Update table data when prop changes
    useEffect(() => {
        setTableData(data);
    }, [data]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        id: number,
        field: keyof SalarySheetData
    ) => {
        const { value } = e.target;
        const updatedData = tableData.map((row) => {
            const rowId = row.pklSalaryBreakingAsdmNescEmployeeWiseId || tableData.indexOf(row);
            return rowId === id
                ? {
                    ...row,
                    [field]:
                        field === "attendance" ||
                            field === "lwpDays" ||
                            field === "arrear" ||
                            field === "deductionOfPtax" ||
                            field === "deductionIncomeTax" ||
                            field === "ddvancesOtherDeductions"
                            ? parseFloat(value) || null
                            : value,
                }
                : row;
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
                generateYear: year,
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
        <TableContainer component={Paper} sx={{ mt: 3, overflow: "auto", maxHeight: "calc(100vh - 280px)", width: "100%", maxWidth: "100%" }}>
            <Table sx={{ minWidth: 1600 }} size="small" stickyHeader>
                <TableHead>
                    <TableRow sx={{ userSelect: "none" }}>
                        <TableCell padding="checkbox" sx={{ fontWeight: 600, border: "1px solid #ddd" }}>
                            <Checkbox
                                color="primary"
                                indeterminate={selected.length > 0 && selected.length < tableData.length}
                                checked={tableData.length > 0 && selected.length === tableData.length}
                                onChange={handleSelectAllClick}
                            />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, border: "1px solid #ddd", userSelect: "none" }}>
                            Name
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, border: "1px solid #ddd", userSelect: "none" }}>
                            Designation/Category
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, border: "1px solid #ddd", userSelect: "none" }}>
                            Attendance
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, border: "1px solid #ddd", backgroundColor: "#f5f5f5", userSelect: "none" }}>
                            LWP Days
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, border: "1px solid #ddd", userSelect: "none" }}>
                            Basic Pay
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: 600,
                                border: "1px solid #ddd",
                                backgroundColor: "#ff9800",
                                color: "white",
                                userSelect: "none",
                            }}
                        >
                            Increment %
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, border: "1px solid #ddd", userSelect: "none" }}>
                            Salary
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, border: "1px solid #ddd", userSelect: "none" }}>
                            House Rent
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, border: "1px solid #ddd", userSelect: "none" }}>
                            Mobile/Internet
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, border: "1px solid #ddd", userSelect: "none" }}>
                            News Paper/Magazine
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, border: "1px solid #ddd", userSelect: "none" }}>
                            Conveyance Allowance
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, border: "1px solid #ddd", userSelect: "none" }}>
                            Education Allowance
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, border: "1px solid #ddd", userSelect: "none" }}>
                            Arrear
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: 600,
                                border: "1px solid #ddd",
                                backgroundColor: "#d4edda",
                                userSelect: "none",
                            }}
                        >
                            Total Pay
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: 600,
                                border: "1px solid #ddd",
                                backgroundColor: "#fff9c4",
                                userSelect: "none",
                            }}
                        >
                            Deduction of PTax
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: 600,
                                border: "1px solid #ddd",
                                backgroundColor: "#fff9c4",
                                userSelect: "none",
                            }}
                        >
                            Deduction Income Tax
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: 600,
                                border: "1px solid #ddd",
                                backgroundColor: "#c8e6c9",
                                userSelect: "none",
                            }}
                        >
                            Advances/Other Deductions
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: 600,
                                border: "1px solid #ddd",
                                backgroundColor: "#c8e6c9",
                                userSelect: "none",
                            }}
                        >
                            Total Deduction
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: 600,
                                border: "1px solid #ddd",
                                backgroundColor: "#c8e6c9",
                                userSelect: "none",
                            }}
                        >
                            Net Amount
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: 600,
                                border: "1px solid #ddd",
                                backgroundColor: "#e1bee7",
                                userSelect: "none",
                            }}
                        >
                            Salary Status
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: 600,
                                border: "1px solid #ddd",
                                userSelect: "none",
                                textAlign: "center",
                            }}
                        >
                            Action
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tableData.map((row) => {
                        const rowId = row.pklSalaryBreakingAsdmNescEmployeeWiseId || row.employeeId;
                        const isItemSelected = isSelected(rowId);
                        return (
                            <TableRow key={rowId} hover selected={isItemSelected}>
                                <TableCell padding="checkbox" sx={{ border: "1px solid #ddd" }}>
                                    <Checkbox
                                        color="primary"
                                        checked={isItemSelected}
                                        onChange={() => handleRowClick(rowId)}
                                    />
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd" }}>
                                    {row.fullName}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd" }}>
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
                                <TableCell sx={{ border: "1px solid #ddd", textAlign: "right" }}>
                                    ₹{row.basicPay.toLocaleString()}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #ddd",
                                        textAlign: "right",
                                        backgroundColor: "#fff3e0",
                                    }}
                                >
                                    {row.incrementPercentage}%
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd", textAlign: "right" }}>
                                    ₹{(row.salary ?? 0).toLocaleString()}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd", textAlign: "right" }}>
                                    ₹{row.houseRent.toLocaleString()}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd", textAlign: "right" }}>
                                    ₹{row.mobileInternet.toLocaleString()}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd", textAlign: "right" }}>
                                    ₹{row.newsPaperMagazine.toLocaleString()}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd", textAlign: "right" }}>
                                    ₹{row.conveyanceAllowances.toLocaleString()}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd", textAlign: "right" }}>
                                    ₹{row.educationAllowance.toLocaleString()}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd", textAlign: "right", p: 0.5 }}>
                                    <TextField
                                        size="small"
                                        type="number"
                                        value={row.arrear ?? ""}
                                        onChange={(e) => handleChange(e, rowId, "arrear")}
                                        InputProps={{
                                            startAdornment: "₹",
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
                                        backgroundColor: "#e8f5e9",
                                    }}
                                >
                                    ₹{(row.totalSalary ?? 0).toLocaleString()}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #ddd",
                                        textAlign: "right",
                                        backgroundColor: "#fffde7",
                                    }}
                                >
                                    ₹{(row.deductionOfPtax ?? 0).toLocaleString()}
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
                                            startAdornment: "₹",
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
                                        backgroundColor: "#e0f2f1",
                                        p: 0.5,
                                    }}
                                >
                                    <TextField
                                        size="small"
                                        type="number"
                                        value={row.ddvancesOtherDeductions ?? ""}
                                        onChange={(e) => handleChange(e, rowId, "ddvancesOtherDeductions")}
                                        InputProps={{
                                            startAdornment: "₹",
                                        }}
                                        sx={{
                                            backgroundColor: "#e0f2f1",
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
                                        backgroundColor: "#e0f2f1",
                                    }}
                                >
                                    ₹{(row.totalDeduction ?? 0).toLocaleString()}
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
                                    ₹{(row.netAmount ?? 0).toLocaleString()}
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
