import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "react-auth-kit";
import toast from "react-hot-toast";

import {
    useSalaryStructureTypes,
    useEmployeeList,
    useGenerateSalary,
    useSalaryTrackTimeline,
    useSaveEmployeeData,
} from "./useGetSalaryFile";
import { useExportSalaryReport } from "./useExportSalaryReport";
import { formatFyMaster } from "../../../utils/formatter";
import { getRoleIdFromToken } from "../../../utils/auth";
import { SALARY_MONTHS } from "../constants/salaryConstants";
import { useQuery } from "@tanstack/react-query";
import { fetchFilters } from "../../../api/employee/employee-api";

/** Resolves the current user's role ID from JWT (preferred) or auth-kit state. */
function resolveRoleId(authUser: () => any): number {
    const tokenId = getRoleIdFromToken();
    if (tokenId !== null && Number.isFinite(tokenId) && tokenId > 0) return tokenId;

    const state: any = authUser();
    return Number(
        state?.roleId ?? state?.fklRoleId ?? state?.roleID ?? state?.RoleId ?? state?.role_id ?? 0
    );
}

/** Maps a role ID to the track step sent to the backend. */
function resolveTrackStep(roleId: number): number {
    if (roleId === 98) return 1;
    if (roleId === 36) return 2;
    return 3;
}

/** Selects the best-matching FY ID from fyMaster based on today's date. */
function pickDefaultFyId(fyMaster: any[]): number | null {
    const enabled = fyMaster.filter((fy) => fy.bEnabled === 1);
    if (!enabled.length) return null;

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const fyStartYear = currentMonth < 4 ? currentYear - 1 : currentYear;

    const getScore = (v: number) => (v < 4 ? v + 12 : v);
    const monthScore = getScore(currentMonth);

    const sameFy = enabled.filter((fy) => Number(fy.vsFy) === fyStartYear);
    if (sameFy.length > 0) {
        const match =
            [...sameFy]
                .filter((fy) => getScore(fy.iStartMonth) <= monthScore)
                .sort((a, b) => getScore(b.iStartMonth) - getScore(a.iStartMonth))[0] ??
            [...sameFy].sort((a, b) => b.pklSalaryFinancialYearId - a.pklSalaryFinancialYearId)[0];
        return match?.pklSalaryFinancialYearId ?? null;
    }

    return (
        [...enabled].sort((a, b) => b.pklSalaryFinancialYearId - a.pklSalaryFinancialYearId)[0]
            ?.pklSalaryFinancialYearId ?? null
    );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useSalaryTransfer() {
    const navigate = useNavigate();
    const authUser = useAuthUser();

    // ── Filter state ──────────────────────────────────────────────────────────
    const [selectedStructureType, setSelectedStructureType] = useState<string>("ASDM_NESC");
    const [selectedMonth, setSelectedMonth] = useState<string>(
        (new Date().getMonth() + 1).toString()
    );
    const [selectedYear, setSelectedYear] = useState<number | "">("");
    const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
    const [currentTableData, setCurrentTableData] = useState<any[]>([]);

    // ── Dialog state ──────────────────────────────────────────────────────────
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [commentDialogOpen, setCommentDialogOpen] = useState(false);
    const [resultDialogOpen, setResultDialogOpen] = useState(false);
    const [counts, setCounts] = useState({ skipped: 0, valid: 0 });
    const [resultCounts, setResultCounts] = useState({ success: 0, failed: 0 });
    const [generationQueue, setGenerationQueue] = useState<any[]>([]);
    const [timelineComment, setTimelineComment] = useState("");
    const [timelineStatus, setTimelineStatus] = useState<"Pending" | "Rejected" | "Approved">(
        "Pending"
    );

    // ── API data ──────────────────────────────────────────────────────────────
    const { data: structureTypesData, isLoading: isLoadingTypes } = useSalaryStructureTypes();
    const { data: employeeMasterData } = useQuery({
        queryKey: ["employee-master-filters"],
        queryFn: fetchFilters,
        staleTime: 5 * 60 * 1000,
    });

    const formattedYears = useMemo(
        () => (structureTypesData?.data?.fyMaster ? formatFyMaster(structureTypesData.data.fyMaster) : []),
        [structureTypesData]
    );

    const structureTypeId = structureTypesData?.data?.salaryStructureTypes?.find(
        (s) => s.type === selectedStructureType
    )?.id;

    const {
        data: employeeListData,
        isLoading: isLoadingEmployees,
        error: employeeError,
    } = useEmployeeList(
        structureTypeId !== undefined ? structureTypeId.toString() : selectedStructureType,
        selectedMonth,
        selectedYear ? selectedYear.toString() : undefined
    );

    const generateSalaryMutation = useGenerateSalary();
    const saveEmployeeDataMutation = useSaveEmployeeData();
    const salaryTimelineMutation = useSalaryTrackTimeline();
    const { exportToExcel, exportToPdf } = useExportSalaryReport();

    // ── Derived values ────────────────────────────────────────────────────────
    const resolvedRoleId = useMemo(() => resolveRoleId(authUser), []);
    const currentStepTrack: number | null =
        employeeListData?.employeeList?.[0]?.stepTrack ?? null;
    const departmentOptions = useMemo(
        () => {
            const departments = employeeMasterData?.department ?? [];
            const names = Array.from(
                new Set(
                    departments
                        .map((dept: any) => dept?.internalDepartmentName)
                        .filter((name: any): name is string => Boolean(name && typeof name === "string"))
                )
            );

            return names.map((name) => ({ label: name, value: name }));
        },
        [employeeMasterData]
    );
    const filteredEmployeeList = useMemo(() => {
        const employees = employeeListData?.employeeList ?? [];
        if (selectedDepartment === "all") return employees;
        return employees.filter((employee: any) => employee.internalDept === selectedDepartment);
    }, [employeeListData, selectedDepartment]);

    // ── Auto-select default FY on load ────────────────────────────────────────
    useEffect(() => {
        if (structureTypesData?.data?.fyMaster && selectedYear === "") {
            const id = pickDefaultFyId(structureTypesData.data.fyMaster);
            if (id !== null) setSelectedYear(id);
        }
    }, [structureTypesData, selectedYear]);

    // ── Month availability ────────────────────────────────────────────────────
    const isMonthDisabled = useCallback(
        (monthValue: string): boolean => {
            if (!structureTypesData?.data?.fyMaster || selectedYear === "") return false;
            const selectedFyConfig = structureTypesData.data.fyMaster.find(
                (fy) => fy.pklSalaryFinancialYearId === selectedYear
            );
            if (!selectedFyConfig) return false;

            const allSameFy = structureTypesData.data.fyMaster.filter(
                (fy) => fy.vsFy === selectedFyConfig.vsFy
            );
            if (allSameFy.length <= 1) return false;

            const getScore = (v: number) => (v < 4 ? v + 12 : v);
            const mScore = getScore(parseInt(monthValue));
            const startScore = getScore(selectedFyConfig.iStartMonth);
            if (mScore < startScore) return true;

            return allSameFy.some((other) => {
                if (other.pklSalaryFinancialYearId === selectedYear) return false;
                const oScore = getScore(other.iStartMonth);
                return oScore > startScore && oScore <= mScore;
            });
        },
        [structureTypesData, selectedYear]
    );

    // Auto-correct month if it becomes disabled after FY change
    useEffect(() => {
        if (selectedYear !== "" && isMonthDisabled(selectedMonth)) {
            const first = SALARY_MONTHS.find((m) => !isMonthDisabled(m.value));
            if (first) setSelectedMonth(first.value);
        }
    }, [selectedYear, selectedMonth, isMonthDisabled]);

    // Clear edited table cache when upstream filters/data change.
    useEffect(() => {
        setCurrentTableData([]);
    }, [selectedStructureType, selectedMonth, selectedYear, selectedDepartment, employeeListData]);

    // ── Export handlers ───────────────────────────────────────────────────────
    const getEmployeeData = useCallback(
        () =>
            currentTableData.length > 0
                ? currentTableData
                : filteredEmployeeList,
        [currentTableData, filteredEmployeeList]
    );

    const selectedYearLabel = useMemo(
        () =>
            formattedYears.find((fy) => fy.value === selectedYear)?.label ??
            (selectedYear ? selectedYear.toString() : ""),
        [formattedYears, selectedYear]
    );

    const handleExportExcel = useCallback(() => {
        const data = getEmployeeData();
        if (!data.length) { toast.error("No data available to export"); return; }
        const fileName = exportToExcel(data, {
            month: selectedMonth,
            year: selectedYearLabel,
            structureType: selectedStructureType,
        });
        fileName ? toast.success(`Report downloaded: ${fileName}`) : toast.error("Failed to export report");
    }, [getEmployeeData, exportToExcel, selectedMonth, selectedYearLabel, selectedStructureType]);

    const handleExportPdf = useCallback(async () => {
        const data = getEmployeeData();
        if (!data.length) { toast.error("No data available to export"); return; }
        const fileName = await exportToPdf(data, {
            month: selectedMonth,
            year: selectedYearLabel,
            structureType: selectedStructureType,
        });
        fileName ? toast.success(`Report downloaded: ${fileName}`) : toast.error("Failed to export PDF report");
    }, [getEmployeeData, exportToPdf, selectedMonth, selectedYearLabel, selectedStructureType]);

    // ── Save All handler ──────────────────────────────────────────────────
    const handleSaveAll = useCallback(async () => {
        const data = getEmployeeData();
        if (!data.length) { toast.error("No data to save"); return; }
        if (!selectedYear) { toast.error("Please select a financial year"); return; }

        const saveEmployees = data.map((emp: any) => ({
            fullName: emp.fullName ?? "",
            employeeId: emp.employeeId,
            attendance: emp.attendance ?? null,
            lwp: emp.lwpDays ?? null,
            arear: emp.arrear ?? null,
            incomeTax: emp.deductionIncomeTax ?? null,
            otherDeduction: emp.ddvancesOtherDeductions ?? null,
            isHold: emp.hold ? 1 : (emp.isHold ?? 0),
            comment: emp.employeeCommentBeforeAck ?? "",
        }));

        const payload = {
            salaryStructureType:
                structureTypesData?.data?.salaryStructureTypes?.find(
                    (s: any) => s.type === selectedStructureType
                )?.id ?? selectedStructureType,
            generateMonth: selectedMonth,
            generateYear: selectedYear.toString(),
            generateEmployees: saveEmployees,
            isSave: 1,
        };

        try {
            const res = await saveEmployeeDataMutation.mutateAsync(payload as any);
            toast.success(res?.message || "All records saved successfully");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to save records");
        }
    }, [getEmployeeData, selectedYear, selectedMonth, selectedStructureType, structureTypesData, saveEmployeeDataMutation]);

    // ── Timeline handler ──────────────────────────────────────────────────────
    const handleTimeline = useCallback(() => {
        if (!structureTypeId || !selectedMonth || !selectedYear) return;
        salaryTimelineMutation.mutate(
            { salaryStructureType: structureTypeId, generateMonth: selectedMonth, generateYear: selectedYear.toString() },
            {
                onSuccess: (data) => {
                    toast.success(data?.message || "Timeline fetched successfully");
                    navigate("/salary-transfer/timelines", { state: { timelineData: data } });
                },
                onError: () => toast.error("Failed to fetch timeline"),
            }
        );
    }, [structureTypeId, selectedMonth, selectedYear, salaryTimelineMutation, navigate]);

    // ── Generation handlers ───────────────────────────────────────────────────
    const runGeneration = useCallback(
        async (employees: any[]) => {
            const generateEmployees = employees.map((emp: any) => ({
                fullName: emp.fullName ?? "",
                employeeId: emp.employeeId,
                attendance: emp.attendance ?? null,
                lwp: emp.lwpDays ?? null,
                arear: emp.arrear ?? null,
                incomeTax: emp.deductionIncomeTax ?? null,
                otherDeduction: emp.ddvancesOtherDeductions ?? null,
                isHold: emp.hold ? 1 : 0,
            }));

            const payload = {
                salaryStructureType:
                    structureTypesData?.data?.salaryStructureTypes?.find(
                        (s) => s.type === selectedStructureType
                    )?.id ?? selectedStructureType,
                generateMonth: selectedMonth,
                generateYear: selectedYear.toString(),
                trackStep: resolveTrackStep(resolvedRoleId),
                generateEmployees,
            };

            try {
                const response = await generateSalaryMutation.mutateAsync(payload as any);
                setResultCounts({
                    success: response.sucessReport.successfullyGenerateCount,
                    failed: response.sucessReport.failedGenerateCount,
                });
                setResultDialogOpen(true);
            } catch (error: any) {
                toast.error(error?.response?.data?.message || "Failed to generate salary.");
            }
        },
        [structureTypesData, selectedStructureType, selectedMonth, selectedYear, resolvedRoleId, generateSalaryMutation]
    );

    const openCommentDialog = useCallback((employees: any[]) => {
        if (!employees?.length) { toast.error("No employees with valid attendance found."); return; }
        setGenerationQueue(employees);
        setTimelineComment("");
        setTimelineStatus("Pending");
        setCommentDialogOpen(true);
    }, []);

    const handleConfirmAndGenerate = useCallback(async () => {
        if (!timelineComment.trim()) { toast.error("Please add a comment before proceeding."); return; }
        setCommentDialogOpen(false);
        await runGeneration(generationQueue);
        setGenerationQueue([]);
    }, [timelineComment, runGeneration, generationQueue]);

    const handleSubmit = useCallback(() => {
        const data = getEmployeeData();
        if (!data.length) { toast.error("No employees to submit"); return; }

        const valid = data.filter(
            (emp: any) => emp.attendance !== null && emp.attendance !== undefined && emp.attendance > 0
        );
        const skipped = data.length - valid.length;

        if (!valid.length) { toast.error("No employees with valid attendance found."); return; }
        if (skipped > 0) {
            setCounts({ skipped, valid: valid.length });
            setConfirmDialogOpen(true);
        } else {
            openCommentDialog(valid);
        }
    }, [getEmployeeData, openCommentDialog]);

    const handleProceedAfterConfirm = useCallback(() => {
        setConfirmDialogOpen(false);
        const data = getEmployeeData();
        const valid = data.filter(
            (emp: any) => emp.attendance !== null && emp.attendance !== undefined && emp.attendance > 0
        );
        openCommentDialog(valid);
    }, [getEmployeeData, openCommentDialog]);

    return {
        // Filter values
        selectedStructureType, setSelectedStructureType,
        selectedMonth, setSelectedMonth,
        selectedYear, setSelectedYear,
        selectedDepartment, setSelectedDepartment,

        // API data
        structureTypesData, isLoadingTypes,
        formattedYears,
        structureTypeId,
        employeeListData, isLoadingEmployees, employeeError,
        departmentOptions,
        filteredEmployeeList,

        // Derived
        resolvedRoleId,
        currentStepTrack,
        isMonthDisabled,

        // Table data
        currentTableData,
        handleSalaryDataChange: setCurrentTableData,

        // Mutations
        generateSalaryMutation,
        saveEmployeeDataMutation,
        salaryTimelineMutation,

        // Handlers
        handleExportExcel,
        handleExportPdf,
        handleSaveAll,
        handleTimeline,
        handleSubmit,
        handleConfirmAndGenerate,
        handleProceedAfterConfirm,

        // Dialog state
        confirmDialogOpen, setConfirmDialogOpen,
        commentDialogOpen, setCommentDialogOpen,
        resultDialogOpen, setResultDialogOpen,
        counts,
        resultCounts,
        timelineComment, setTimelineComment,
        timelineStatus, setTimelineStatus,
    };
}
