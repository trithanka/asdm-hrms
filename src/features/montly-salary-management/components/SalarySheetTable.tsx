import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
    Paper,
    Table,
    TableBody,
    Checkbox,
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
import { getSalaryEditPermissions } from "../utils/salaryEditPermissions";
import { getStepLabel } from "../utils/stepTrack";
import { getDaysInSelectedMonth } from "../utils/workingDays";

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
    employeeCommentBeforeAck?: string;
    hold?: boolean;
    isHold?: number | null;
    stepTrack?: number | null;
    salaryStatus: string;
    workingDays?: number;
}

interface SalarySheetTableProps {
    data: SalarySheetData[];
    onDataChange?: (updatedData: SalarySheetData[]) => void;
    month?: string;
    year?: string;
    roleId?: number;
    stepTrack?: number | null;
}

export const SalarySheetTable = ({ data, onDataChange, month = "", year = "", roleId = 0, stepTrack = null }: SalarySheetTableProps) => {
    const [tableData, setTableData] = useState<SalarySheetData[]>(data);
    const [generatingId, setGeneratingId] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [scrollTop, setScrollTop] = useState(0);
    const [viewportHeight, setViewportHeight] = useState(700);

    const { isEditable, isOtherDeductionEditable } = getSalaryEditPermissions(roleId, stepTrack);
    const workingDaysForMonth = getDaysInSelectedMonth(month, year);
    const ROW_HEIGHT = 56;
    const OVERSCAN_ROWS = 8;

    const salarySlipMutation = useSalarySlip();

    const handleContainerScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(e.currentTarget.scrollTop);
    }, []);

    useEffect(() => {
        const updateViewport = () => {
            if (containerRef.current) {
                setViewportHeight(containerRef.current.clientHeight);
            }
        };

        updateViewport();
        window.addEventListener("resize", updateViewport);
        return () => window.removeEventListener("resize", updateViewport);
    }, []);

    const recalculateRow = useCallback((row: SalarySheetData, originalRowFromSource?: SalarySheetData) => {
        // If already generated, return as is (do not recalculate)
        if (row.salaryStatus === "generated") return row;

        const originalRow = originalRowFromSource ?? row;

        const workingDays = workingDaysForMonth;
        const attendance = Number(row.attendance ?? 0);

        // Base monthly values, with row edits taking priority over original API values.
        const baseBasicPay = Number(row.basicPay ?? originalRow.basicPay ?? 0);
        const incrementPercentage = Number(row.incrementPercentage ?? originalRow.incrementPercentage ?? 0);
        const incrementPercentValueFy = (baseBasicPay * incrementPercentage) / 100;
        const fullSalary = baseBasicPay + incrementPercentValueFy;

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

        return {
            ...row,
            workingDays,
            basicPay: baseBasicPay,
            incrementPercentValueFy,
            fullSalary,
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
    }, [workingDaysForMonth]);

    // Update table data when month/year changes or data arrives
    useEffect(() => {
        if (data.length > 0) {
            const calculatedData = data.map((row) => ({
                ...recalculateRow(row, row),
                employeeCommentBeforeAck: row.employeeCommentBeforeAck ?? "",
            }));
            setTableData(calculatedData);
        }
    }, [data, recalculateRow]);

    // Avoid parent-level rerender on each keystroke; sync local edits in short batches.
    useEffect(() => {
        if (!onDataChange) return;
        const timer = window.setTimeout(() => {
            onDataChange(tableData);
        }, 120);
        return () => window.clearTimeout(timer);
    }, [tableData, onDataChange]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        rowIndex: number,
        field: keyof SalarySheetData
    ) => {
        const { value } = e.target;
        const isNumericField =
            field === "attendance" ||
            field === "lwpDays" ||
            field === "basicPay" ||
            field === "arrear" ||
            field === "deductionOfPtax" ||
            field === "deductionIncomeTax" ||
            field === "ddvancesOtherDeductions";
        const parsedValue =
            isNumericField
                ? (value === "" || value === null || value === undefined ? null : (isNaN(parseFloat(value)) ? null : parseFloat(value)))
                : value;

        setTableData((prev) =>
            prev.map((row, idx) => {
                if (idx !== rowIndex) return row;

                const updatedRow = {
                    ...row,
                    [field]: parsedValue,
                } as SalarySheetData;
                return recalculateRow(updatedRow, data[idx]);
            })
        );
    };

    const handleHoldToggle = (rowIndex: number, checked: boolean) => {
        setTableData((prev) =>
            prev.map((row, idx) => {
                if (idx !== rowIndex) return row;

                return {
                    ...row,
                    hold: checked,
                };
            })
        );
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

    const totalRows = tableData.length;
    const visibleRange = useMemo(() => {
        const visibleCount = Math.max(1, Math.ceil(viewportHeight / ROW_HEIGHT));
        const start = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN_ROWS);
        const end = Math.min(totalRows, start + visibleCount + OVERSCAN_ROWS * 2);
        return { start, end };
    }, [scrollTop, viewportHeight, totalRows]);
    const visibleRows = useMemo(
        () => tableData.slice(visibleRange.start, visibleRange.end),
        [tableData, visibleRange.start, visibleRange.end]
    );
    const topSpacerHeight = visibleRange.start * ROW_HEIGHT;
    const bottomSpacerHeight = Math.max(0, (totalRows - visibleRange.end) * ROW_HEIGHT);

    return (
        <TableContainer
            component={Paper}
            ref={containerRef}
            onScroll={handleContainerScroll}
            sx={{
                overflowX: "auto",
                overflowY: "auto",
                height: "100%",
                maxHeight: "100%",
                minHeight: 0,
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
                                // position: "sticky",
                                // left: 0,
                                zIndex: 11,
                                bgcolor: "#f5f5f5",
                                textAlign: "center",
                                minWidth: 60,
                            }}
                        >
                            Sl No
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: 700,
                                fontSize: "0.75rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                border: "1px solid #ddd",
                                // position: "sticky",
                                // left: 60,
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
                                zIndex: 11,
                                bgcolor: "#f5f5f5",
                                textAlign: "center",
                                minWidth: 110,
                            }}
                        >
                            Step
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: 700,
                                fontSize: "0.75rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                border: "1px solid #ddd",
                                userSelect: "none",
                                // position: "sticky",
                                // left: 120,
                                zIndex: 11,
                                bgcolor: "#f5f5f5",
                                textAlign: "center",
                                minWidth: 70,
                            }}
                        >
                            Hold
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
                                left: 0,
                                zIndex: 11,
                                bgcolor: "#f5f5f5",
                                minWidth: 200,
                            }}
                        >
                            Employee
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", border: "1px solid #ddd", backgroundColor: "#f5f5f5", userSelect: "none", textAlign: "center", minWidth: 95 }}>
                            Working Days
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", border: "1px solid #ddd", backgroundColor: isEditable ? "#e3f2fd" : "#e0e0e0", color: isEditable ? "inherit" : "#9e9e9e", userSelect: "none", textAlign: "center", minWidth: 100, opacity: isEditable ? 1 : 0.7 }}>
                            Attendance (in days)
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", border: "1px solid #ddd", backgroundColor: isEditable ? "#e3f2fd" : "#e0e0e0", color: isEditable ? "inherit" : "#9e9e9e", userSelect: "none", textAlign: "center", minWidth: 100, opacity: isEditable ? 1 : 0.7 }}>
                            LWP Days (in days)
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", border: "1px solid #ddd", backgroundColor: isEditable ? "#fff3e0" : "#e0e0e0", color: isEditable ? "inherit" : "#9e9e9e", userSelect: "none", textAlign: "right", minWidth: 110, opacity: isEditable ? 1 : 0.7 }}>
                            Fixed pay
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
                        <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", border: "1px solid #ddd", backgroundColor: isEditable ? "#c8e6c9" : "#e0e0e0", color: isEditable ? "inherit" : "#9e9e9e", userSelect: "none", textAlign: "right", minWidth: 100, opacity: isEditable ? 1 : 0.7 }}>
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
                        {/* Inc Tax: ALWAYS greyed - never editable */}
                        <TableCell
                            sx={{
                                fontWeight: 700,
                                fontSize: "0.75rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                border: "1px solid #ddd",
                                backgroundColor: "#e0e0e0",
                                color: "#9e9e9e",
                                userSelect: "none",
                                textAlign: "right",
                                minWidth: 120,
                                opacity: 0.7,
                            }}
                        >
                            Inc Tax
                        </TableCell>
                        {/* Adv/Oth Ded: greyed when not editable */}
                        <TableCell
                            sx={{
                                fontWeight: 700,
                                fontSize: "0.75rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                border: "1px solid #ddd",
                                backgroundColor: isOtherDeductionEditable ? "#fff9c4" : "#e0e0e0",
                                color: isOtherDeductionEditable ? "inherit" : "#9e9e9e",
                                userSelect: "none",
                                textAlign: "right",
                                minWidth: 140,
                                opacity: isOtherDeductionEditable ? 1 : 0.7,
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
                                backgroundColor: isEditable ? "inherit" : "#e0e0e0",
                                color: isEditable ? "inherit" : "#9e9e9e",
                                userSelect: "none",
                                textAlign: "left",
                                minWidth: 240,
                                opacity: isEditable ? 1 : 0.7,
                            }}
                        >
                            Comment
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
                    {topSpacerHeight > 0 && (
                        <TableRow>
                            <TableCell colSpan={100} sx={{ p: 0, border: 0, height: `${topSpacerHeight}px` }} />
                        </TableRow>
                    )}
                    {visibleRows.map((row, index) => {
                        const absoluteIndex = visibleRange.start + index;
                        const rowId = row.pklSalaryBreakingAsdmNescEmployeeWiseId || row.employeeId;

                        // Combined lock: check if row is currently held (instant UI or API value) 
                        const isRowCurrentlyHeld = Boolean(row.hold) || row.isHold === 1;

                        // General inputs lock (Attendance, LWP, BasicPay, Arrear)
                        const canEditInputsThisRow = isEditable && !isRowCurrentlyHeld;

                        // Other deductions lock (role 36 step 2 specific)
                        const canEditOtherDedThisRow = isOtherDeductionEditable && !isRowCurrentlyHeld;

                        // Comment field remains editable even when held (user request)
                        const canEditCommentThisRow = isEditable;

                        return (
                            <TableRow
                                key={`${rowId}-${absoluteIndex}`}
                                hover
                                sx={
                                    isRowCurrentlyHeld
                                        ? {
                                            "& td": { backgroundColor: "#eeeeee !important" },
                                            "& .MuiOutlinedInput-root": { backgroundColor: "#eeeeee !important" },
                                        }
                                        : undefined
                                }
                            >
                                <TableCell
                                    sx={{
                                        border: "1px solid #ddd",
                                        // position: "sticky",
                                        // left: 0,
                                        bgcolor: "white",
                                        zIndex: 11,
                                        textAlign: "center"
                                    }}
                                >
                                    {absoluteIndex + 1}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #ddd",
                                        // position: "sticky",
                                        // left: 60,
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
                                        bgcolor: "white",
                                        zIndex: 11,
                                        textAlign: "center",
                                        fontSize: "0.8125rem",
                                        fontWeight: 500,
                                    }}
                                >
                                    {getStepLabel(row.stepTrack ?? null)}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #ddd",
                                        // position: "sticky",
                                        // left: 120,
                                        bgcolor: "white",
                                        zIndex: 11,
                                        textAlign: "center"
                                    }}
                                >
                                    <Checkbox
                                        checked={Boolean(row.hold)}
                                        onChange={(e) => handleHoldToggle(absoluteIndex, e.target.checked)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #ddd",
                                        position: "sticky",
                                        left: 0,
                                        zIndex: 11,
                                        bgcolor: "white",
                                        minWidth: 200,
                                        verticalAlign: "center",
                                    }}
                                >
                                    <div style={{ fontWeight: 600, fontSize: "0.875rem", lineHeight: 1.3 }}>
                                        {row.fullName}
                                    </div>
                                    {/* <div style={{ fontSize: "0.75rem", color: "#666", marginTop: 2 }}>
                                        {row.designationName}
                                    </div> */}
                                    {/* <div style={{ fontSize: "0.7rem", color: "#999", marginTop: 1 }}>
                                        {row.designationCategory}
                                    </div> */}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", fontWeight: 600 }}>
                                    {workingDaysForMonth}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", p: 0.5, backgroundColor: canEditInputsThisRow ? "transparent" : "#f5f5f5" }}>
                                    <TextField
                                        size="small"
                                        type="number"
                                        value={row.attendance ?? ""}
                                        onChange={(e) => handleChange(e, absoluteIndex, "attendance")}
                                        inputProps={{
                                            min: 0,
                                            readOnly: !canEditInputsThisRow,
                                            tabIndex: !canEditInputsThisRow ? -1 : undefined,
                                            style: { cursor: !canEditInputsThisRow ? "default" : undefined },
                                        }}
                                        sx={{
                                            opacity: canEditInputsThisRow ? 1 : 0.5,
                                            "& .MuiOutlinedInput-root": { fontSize: "0.875rem" },
                                            "& input": { textAlign: "center", padding: "4px 8px" },
                                        }}
                                    />
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", p: 0.5, backgroundColor: canEditInputsThisRow ? "transparent" : "#f5f5f5" }}>
                                    <TextField
                                        size="small"
                                        type="number"
                                        value={row.lwpDays ?? ""}
                                        onChange={(e) => handleChange(e, absoluteIndex, "lwpDays")}
                                        inputProps={{
                                            min: 0,
                                            readOnly: !canEditInputsThisRow,
                                            tabIndex: !canEditInputsThisRow ? -1 : undefined,
                                            style: { cursor: !canEditInputsThisRow ? "default" : undefined },
                                        }}
                                        sx={{
                                            opacity: canEditInputsThisRow ? 1 : 0.5,
                                            "& .MuiOutlinedInput-root": { fontSize: "0.875rem" },
                                            "& input": { textAlign: "center", padding: "4px 8px" },
                                        }}
                                    />
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd", textAlign: "right", bgcolor: canEditInputsThisRow ? "#fff8f1" : "#f5f5f5", p: 0.5 }}>
                                    <TextField
                                        size="small"
                                        type="number"
                                        value={row.basicPay ?? ""}
                                        onChange={(e) => handleChange(e, absoluteIndex, "basicPay")}
                                        inputProps={{
                                            min: 0,
                                            step: "0.01",
                                            readOnly: !canEditInputsThisRow,
                                            tabIndex: !canEditInputsThisRow ? -1 : undefined,
                                            style: { cursor: !canEditInputsThisRow ? "default" : undefined },
                                        }}
                                        sx={{
                                            opacity: canEditInputsThisRow ? 1 : 0.5,
                                            "& .MuiOutlinedInput-root": { fontSize: "0.875rem" },
                                            "& input": { textAlign: "right", padding: "4px 8px" },
                                        }}
                                    />
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
                                <TableCell sx={{ border: "1px solid #ddd", textAlign: "right", p: 0.5, backgroundColor: canEditInputsThisRow ? "transparent" : "#f5f5f5" }}>
                                    <TextField
                                        size="small"
                                        type="number"
                                        value={row.arrear ?? ""}
                                        onChange={(e) => handleChange(e, absoluteIndex, "arrear")}
                                        inputProps={{
                                            min: 0,
                                            readOnly: !canEditInputsThisRow,
                                            tabIndex: !canEditInputsThisRow ? -1 : undefined,
                                            style: { cursor: !canEditInputsThisRow ? "default" : undefined },
                                        }}
                                        sx={{
                                            opacity: canEditInputsThisRow ? 1 : 0.5,
                                            "& .MuiOutlinedInput-root": { fontSize: "0.875rem" },
                                            "& input": { textAlign: "right", padding: "4px 8px" },
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
                                {/* Income Tax cell: ALWAYS greyed */}
                                <TableCell sx={{ border: "1px solid #ddd", textAlign: "right", backgroundColor: "#f0f0f0", p: 0.5 }}>
                                    <TextField
                                        size="small"
                                        type="number"
                                        value={row.deductionIncomeTax ?? ""}
                                        onChange={(e) => handleChange(e, absoluteIndex, "deductionIncomeTax")}
                                        inputProps={{
                                            min: 0,
                                            readOnly: true,
                                            tabIndex: -1,
                                            style: { cursor: "default" },
                                        }}
                                        sx={{
                                            opacity: 0.45,
                                            backgroundColor: "#f0f0f0",
                                            "& .MuiOutlinedInput-root": { fontSize: "0.875rem" },
                                            "& input": { textAlign: "right", padding: "4px 8px" },
                                        }}
                                    />
                                </TableCell>
                                {/* Adv/Oth Ded cell: greyed when not editable */}
                                <TableCell sx={{ border: "1px solid #ddd", textAlign: "right", backgroundColor: isOtherDeductionEditable ? "#fffde7" : "#f0f0f0", p: 0.5 }}>
                                    <TextField
                                        size="small"
                                        type="number"
                                        value={row.ddvancesOtherDeductions ?? ""}
                                        onChange={(e) => handleChange(e, absoluteIndex, "ddvancesOtherDeductions")}
                                        inputProps={{
                                            min: 0,
                                            readOnly: !canEditOtherDedThisRow,
                                            tabIndex: !canEditOtherDedThisRow ? -1 : undefined,
                                            style: { cursor: !canEditOtherDedThisRow ? "default" : undefined },
                                        }}
                                        sx={{
                                            opacity: canEditOtherDedThisRow ? 1 : 0.45,
                                            backgroundColor: canEditOtherDedThisRow ? "#fffde7" : "#f0f0f0",
                                            "& .MuiOutlinedInput-root": { fontSize: "0.875rem" },
                                            "& input": { textAlign: "right", padding: "4px 8px" },
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
                                    {row.netAmount !== null
                                        ? formatValue(Math.round(row.netAmount))
                                        : ""}
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ddd", p: 0.5, backgroundColor: canEditCommentThisRow ? "transparent" : "#f5f5f5" }}>
                                    <TextField
                                        size="small"
                                        multiline
                                        minRows={1}
                                        value={row.employeeCommentBeforeAck ?? ""}
                                        onChange={(e) => handleChange(e, absoluteIndex, "employeeCommentBeforeAck")}
                                        placeholder="Enter comment"
                                        fullWidth
                                        inputProps={{
                                            readOnly: !canEditCommentThisRow,
                                            tabIndex: !canEditCommentThisRow ? -1 : undefined,
                                            style: { cursor: !canEditCommentThisRow ? "default" : undefined },
                                        }}
                                        sx={{
                                            opacity: canEditCommentThisRow ? 1 : 0.5,
                                            "& .MuiOutlinedInput-root": { fontSize: "0.875rem", alignItems: "flex-start" },
                                            "& textarea": { padding: "4px 8px", resize: "vertical", overflow: "auto" },
                                        }}

                                    />
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
                    {bottomSpacerHeight > 0 && (
                        <TableRow>
                            <TableCell colSpan={100} sx={{ p: 0, border: 0, height: `${bottomSpacerHeight}px` }} />
                        </TableRow>
                    )}
                </TableBody>
            </Table >
        </TableContainer >
    );
};
