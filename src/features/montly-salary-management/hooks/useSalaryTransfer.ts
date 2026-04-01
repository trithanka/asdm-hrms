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
    useSalarySendBack,
    useSalarySlipGenerate,
} from "./useGetSalaryFile";
import { useExportSalaryReport } from "./useExportSalaryReport";
import { formatFyMaster } from "../../../utils/formatter";
import { getRoleIdFromToken } from "../../../utils/auth";
import { SALARY_MONTHS } from "../constants/salaryConstants";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchFilters } from "../../../api/employee/employee-api";
import { getDaysInSelectedMonth } from "../utils/workingDays";

/** Resolves the current user's role ID from JWT (preferred) or auth-kit state. */
function resolveRoleId(authUser: () => any): number {
    const tokenId = getRoleIdFromToken();
    if (tokenId !== null && Number.isFinite(tokenId) && tokenId > 0) return tokenId;

    const state: any = authUser();
    return Number(
        state?.roleId ?? state?.fklRoleId ?? state?.roleID ?? state?.RoleId ?? state?.role_id ?? 0
    );
}

/** Maps role + current workflow position to the track step sent to the backend. */
function resolveTrackStep(roleId: number, currentStepTrack: number | null): number {
    // Finance stage
    if (roleId === 36) return 2;

    // HR first pass -> 1, HR after finance -> 3
    if (roleId === 98) return currentStepTrack === 2 ? 3 : 1;

    // Fallback keeps workflow moving to final step.
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
    const queryClient = useQueryClient();

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
    const [resultDialogOpen, setResultDialogOpen] = useState(false);
    const [backToHrDialogOpen, setBackToHrDialogOpen] = useState(false);
    const [backToFinanceDialogOpen, setBackToFinanceDialogOpen] = useState(false);
    const [forwardToHrDialogOpen, setForwardToHrDialogOpen] = useState(false);
    const [forwardToFinanceDialogOpen, setForwardToFinanceDialogOpen] = useState(false);
    const [counts, setCounts] = useState({ skipped: 0, valid: 0 });
    const [resultCounts, setResultCounts] = useState({ success: 0, failed: 0 });
    const [backToHrComment, setBackToHrComment] = useState("");
    const [backToFinanceComment, setBackToFinanceComment] = useState("");
    const [forwardToHrComment, setForwardToHrComment] = useState("");
    const [forwardToFinanceComment, setForwardToFinanceComment] = useState("");

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
    const salarySendBackMutation = useSalarySendBack();
    const salarySlipGenerateMutation = useSalarySlipGenerate();
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

            const selectedMonthNum = parseInt(monthValue, 10);
            const fyStartMonth = Number(selectedFyConfig.iStartMonth || 6);
            const now = new Date();
            const nowMonth = now.getMonth() + 1;
            const nowYear = now.getFullYear();
            const selectedFyStartYear = Number(selectedFyConfig.vsFy);
            const currentFyStartYear = nowMonth < fyStartMonth ? nowYear - 1 : nowYear;

            // If selected FY is the current FY, disable months that have not arrived yet.
            // Uses selected FY start month (June-based in your setup).
            if (selectedFyStartYear === currentFyStartYear) {
                const toFyOrder = (m: number) => ((m - fyStartMonth + 12) % 12) + 1;
                const selectedMonthOrder = toFyOrder(selectedMonthNum);
                const currentMonthOrder = toFyOrder(nowMonth);
                if (selectedMonthOrder > currentMonthOrder) return true;
            }

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

    const refreshAfterAction = useCallback(async () => {
        setCurrentTableData([]);
        await queryClient.invalidateQueries({ queryKey: ["employee-list"] });
    }, [queryClient]);

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

    const handleEnableSlip = useCallback(async () => {
        if (!selectedYear) {
            toast.error("Please select a financial year");
            return;
        }

        const salaryStructureType =
            structureTypesData?.data?.salaryStructureTypes?.find(
                (s: any) => s.type === selectedStructureType
            )?.id ?? selectedStructureType;

        try {
            const res = await salarySlipGenerateMutation.mutateAsync({
                salaryStructureType,
                generateMonth: selectedMonth,
                generateYear: selectedYear.toString(),
            } as any);
            toast.success(res?.message || "Salary slip enabled successfully");
            await refreshAfterAction();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to enable salary slip");
        }
    }, [selectedYear, structureTypesData, selectedStructureType, salarySlipGenerateMutation, selectedMonth, refreshAfterAction]);

    const buildSavePayload = useCallback((
        includeSaveFlag: boolean,
        commentText?: string,
        trackStepOverride?: number
    ) => {
        const data = getEmployeeData();
        if (!data.length) { toast.error("No data to save"); return null; }
        if (!selectedYear) { toast.error("Please select a financial year"); return null; }

        const payloadStepTrack =
            trackStepOverride ?? resolveTrackStep(resolvedRoleId, currentStepTrack);
        const payloadWorkingDays = data[0]?.workingDays ?? getDaysInSelectedMonth(selectedMonth, new Date().getFullYear());

        const generateEmployees = data.map((emp: any) => ({
            fullName: emp.fullName ?? "",
            employeeId: emp.employeeId,
            attendance: emp.attendance ?? "",
            lwp: emp.lwpDays ?? null,
            arear: emp.arrear ?? null,
            incomeTax: emp.deductionIncomeTax ?? null,
            otherDeduction: emp.ddvancesOtherDeductions ?? null,
            basicPay: emp.basicPay ?? null,
            isHold: emp.hold ? 1 : (emp.isHold ?? 0),
            stepTrack: emp.stepTrack ?? 1,
            comment: emp.employeeCommentBeforeAck ?? "",
        }));

        const payload = {
            salaryStructureType:
                structureTypesData?.data?.salaryStructureTypes?.find(
                    (s: any) => s.type === selectedStructureType
                )?.id ?? selectedStructureType,
            generateMonth: selectedMonth,
            generateYear: selectedYear.toString(),
            trackStep: payloadStepTrack,
            comment: commentText?.trim() || "process Done",
            iWorkingDays: payloadWorkingDays,
            generateEmployees,
            ...(includeSaveFlag ? { isSave: 1 } : {}),
        };
        return payload;
    }, [getEmployeeData, selectedYear, selectedMonth, selectedStructureType, structureTypesData, currentStepTrack, resolvedRoleId]);

    // ── Save All handler ──────────────────────────────────────────────────
    const handleSaveAll = useCallback(async () => {
        // Save should keep/update rows in HR stage.
        const payload = buildSavePayload(true, undefined, 1);
        if (!payload) return;

        try {
            const res = await saveEmployeeDataMutation.mutateAsync(payload as any);
            toast.success(res?.message || "All records saved successfully");
            await refreshAfterAction();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to save records");
        }
    }, [buildSavePayload, saveEmployeeDataMutation, refreshAfterAction]);

    // ── Forward to Finance (without isSave) ────────────────────────────────
    const handleForwardToFinance = useCallback(async (commentText?: string) => {
        const payload = buildSavePayload(false, commentText, 1);
        if (!payload) return;

        try {
            const res = await saveEmployeeDataMutation.mutateAsync(payload as any);
            toast.success(res?.message || "Forwarded to Finance successfully");
            await refreshAfterAction();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to forward to Finance");
        }
    }, [buildSavePayload, saveEmployeeDataMutation, refreshAfterAction]);

    const openForwardToFinanceDialog = useCallback(() => {
        setForwardToFinanceComment("");
        setForwardToFinanceDialogOpen(true);
    }, []);

    const handleConfirmForwardToFinance = useCallback(async () => {
        if (!forwardToFinanceComment.trim()) {
            toast.error("Please add a comment before forwarding");
            return;
        }
        await handleForwardToFinance(forwardToFinanceComment.trim());
        setForwardToFinanceDialogOpen(false);
    }, [forwardToFinanceComment, handleForwardToFinance]);

    const openBackToHrDialog = useCallback(() => {
        setBackToHrComment("");
        setBackToHrDialogOpen(true);
    }, []);

    const openBackToFinanceDialog = useCallback(() => {
        setBackToFinanceComment("");
        setBackToFinanceDialogOpen(true);
    }, []);

    const handleConfirmBackToHr = useCallback(async () => {
        if (!backToHrComment.trim()) {
            toast.error("Please add a comment before sending back");
            return;
        }
        if (!selectedYear) {
            toast.error("Please select a financial year");
            return;
        }

        const data = getEmployeeData();
        const employeeIds = data
            .filter((emp: any) => !emp.hold && emp.isHold !== 1 && (emp.stepTrack ?? null) === 2)
            .map((emp: any) => Number(emp.employeeId));

        if (!employeeIds.length) {
            toast.error("No step 2 employees available to send back");
            return;
        }

        const payload = {
            salaryStructureType:
                structureTypesData?.data?.salaryStructureTypes?.find(
                    (s: any) => s.type === selectedStructureType
                )?.id ?? selectedStructureType,
            generateMonth: selectedMonth,
            generateYear: selectedYear.toString(),
            trackStep: 2,
            comment: backToHrComment.trim(),
            generateEmployees: employeeIds,
        };

        try {
            const res = await salarySendBackMutation.mutateAsync(payload as any);
            toast.success(res?.message || "Sent back to HR successfully");
            setBackToHrDialogOpen(false);
            await refreshAfterAction();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to send back to HR");
        }
    }, [backToHrComment, selectedYear, getEmployeeData, structureTypesData, selectedStructureType, selectedMonth, salarySendBackMutation, refreshAfterAction]);

    const handleConfirmBackToFinance = useCallback(async () => {
        if (!backToFinanceComment.trim()) {
            toast.error("Please add a comment before sending back");
            return;
        }
        if (!selectedYear) {
            toast.error("Please select a financial year");
            return;
        }

        const data = getEmployeeData();
        const employeeIds = data
            .filter((emp: any) => !emp.hold && emp.isHold !== 1 && (emp.stepTrack ?? null) === 3)
            .map((emp: any) => Number(emp.employeeId));

        if (!employeeIds.length) {
            toast.error("No step 3 employees available to send back");
            return;
        }

        const payload = {
            salaryStructureType:
                structureTypesData?.data?.salaryStructureTypes?.find(
                    (s: any) => s.type === selectedStructureType
                )?.id ?? selectedStructureType,
            generateMonth: selectedMonth,
            generateYear: selectedYear.toString(),
            trackStep: 3,
            comment: backToFinanceComment.trim(),
            generateEmployees: employeeIds,
        };

        try {
            const res = await salarySendBackMutation.mutateAsync(payload as any);
            toast.success(res?.message || "Sent back to Finance successfully");
            setBackToFinanceDialogOpen(false);
            await refreshAfterAction();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to send back to Finance");
        }
    }, [backToFinanceComment, selectedYear, getEmployeeData, structureTypesData, selectedStructureType, selectedMonth, salarySendBackMutation, refreshAfterAction]);

    const openForwardToHrDialog = useCallback(() => {
        setForwardToHrComment("");
        setForwardToHrDialogOpen(true);
    }, []);

    const handleConfirmForwardToHr = useCallback(async () => {
        if (!forwardToHrComment.trim()) {
            toast.error("Please add a comment before forwarding");
            return;
        }
        if (!selectedYear) {
            toast.error("Please select a financial year");
            return;
        }

        const data = getEmployeeData();
        const forwardEmployees = data
            .filter((emp: any) => !emp.hold && emp.isHold !== 1 && (emp.stepTrack ?? null) === 2)
            .map((emp: any) => ({
                fullName: emp.fullName ?? "",
                employeeId: emp.employeeId,
                attendance: emp.attendance ?? "",
                lwp: emp.lwpDays ?? null,
                arear: emp.arrear ?? null,
                incomeTax: emp.deductionIncomeTax ?? null,
                otherDeduction: emp.ddvancesOtherDeductions ?? null,
                basicPay: emp.basicPay ?? 0,
                isHold: emp.hold ? 1 : (emp.isHold ?? 0),
                stepTrack: emp.stepTrack ?? 1,
                comment: emp.employeeCommentBeforeAck ?? "",
            }));

        if (!forwardEmployees.length) {
            toast.error("No step 2 employees available to forward");
            return;
        }

        const payloadWorkingDays = data[0]?.workingDays ?? getDaysInSelectedMonth(selectedMonth, new Date().getFullYear());

        const payload = {
            salaryStructureType:
                structureTypesData?.data?.salaryStructureTypes?.find(
                    (s: any) => s.type === selectedStructureType
                )?.id ?? selectedStructureType,
            generateMonth: selectedMonth,
            generateYear: selectedYear.toString(),
            trackStep: 2,
            comment: forwardToHrComment.trim(),
            iWorkingDays: payloadWorkingDays,
            generateEmployees: forwardEmployees,
        };

        try {
            const res = await saveEmployeeDataMutation.mutateAsync(payload as any);
            toast.success(res?.message || "Forwarded to HR successfully");
            setForwardToHrDialogOpen(false);
            await refreshAfterAction();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to forward to HR");
        }
    }, [forwardToHrComment, selectedYear, getEmployeeData, structureTypesData, selectedStructureType, selectedMonth, saveEmployeeDataMutation, refreshAfterAction]);

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
            const payloadWorkingDays =
                employees[0]?.workingDays ??
                getDaysInSelectedMonth(selectedMonth, new Date().getFullYear());

            const generateEmployees = employees.map((emp: any) => ({
                fullName: emp.fullName ?? "",
                employeeId: emp.employeeId,
                attendance: emp.attendance ?? null,
                lwp: emp.lwpDays ?? null,
                arear: emp.arrear ?? null,
                incomeTax: emp.deductionIncomeTax ?? null,
                otherDeduction: emp.ddvancesOtherDeductions ?? null,
                basicPay: emp.basicPay ?? 0,
                isHold: emp.hold ? 1 : 0,
                stepTrack: emp.stepTrack ?? 1,
                comment: emp.employeeCommentBeforeAck ?? "",
            }));

            const payload = {
                salaryStructureType:
                    structureTypesData?.data?.salaryStructureTypes?.find(
                        (s) => s.type === selectedStructureType
                    )?.id ?? selectedStructureType,
                generateMonth: selectedMonth,
                generateYear: selectedYear.toString(),
                trackStep: 3,
                comment: "process Done",
                iWorkingDays: payloadWorkingDays,
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
        [
            structureTypesData,
            selectedStructureType,
            selectedMonth,
            selectedYear,
            resolvedRoleId,
            currentStepTrack,
            generateSalaryMutation,
        ]
    );

    const handleSubmit = useCallback(() => {
        const data = getEmployeeData();
        if (!data.length) { toast.error("No employees to submit"); return; }

        const pendingEmployees = data.filter(
            (emp: any) => String(emp?.salaryStatus ?? "").trim().toLowerCase() !== "generated"
        );

        const valid = pendingEmployees.filter(
            (emp: any) => emp.attendance !== null && emp.attendance !== undefined && emp.attendance > 0
        );
        const skipped = pendingEmployees.length - valid.length;

        if (!valid.length) { toast.error("No employees with valid attendance found."); return; }
        setCounts({ skipped, valid: valid.length });
        setConfirmDialogOpen(true);
    }, [getEmployeeData]);

    const handleProceedAfterConfirm = useCallback(async () => {
        setConfirmDialogOpen(false);
        const data = getEmployeeData();
        const pendingEmployees = data.filter(
            (emp: any) => String(emp?.salaryStatus ?? "").trim().toLowerCase() !== "generated"
        );
        const valid = pendingEmployees.filter(
            (emp: any) => emp.attendance !== null && emp.attendance !== undefined && emp.attendance > 0
        );
        if (!valid.length) { toast.error("No employees with valid attendance found."); return; }
        await runGeneration(valid);
    }, [getEmployeeData, runGeneration]);

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
        salarySendBackMutation,
        salarySlipGenerateMutation,
        salaryTimelineMutation,

        // Handlers
        handleExportExcel,
        handleExportPdf,
        handleSaveAll,
        handleForwardToFinance,
        handleEnableSlip,
        openForwardToFinanceDialog,
        handleConfirmForwardToFinance,
        openForwardToHrDialog,
        handleConfirmForwardToHr,
        openBackToHrDialog,
        handleConfirmBackToHr,
        openBackToFinanceDialog,
        handleConfirmBackToFinance,
        handleTimeline,
        handleSubmit,
        handleProceedAfterConfirm,

        // Dialog state
        confirmDialogOpen, setConfirmDialogOpen,
        resultDialogOpen, setResultDialogOpen,
        backToHrDialogOpen, setBackToHrDialogOpen,
        backToFinanceDialogOpen, setBackToFinanceDialogOpen,
        forwardToHrDialogOpen, setForwardToHrDialogOpen,
        forwardToFinanceDialogOpen, setForwardToFinanceDialogOpen,
        counts,
        resultCounts,
        backToHrComment, setBackToHrComment,
        backToFinanceComment, setBackToFinanceComment,
        forwardToHrComment, setForwardToHrComment,
        forwardToFinanceComment, setForwardToFinanceComment,
    };
}
