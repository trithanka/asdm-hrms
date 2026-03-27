import { Box, Stack, Typography } from "@mui/material";

import { useSalaryTransfer } from "../features/montly-salary-management/hooks/useSalaryTransfer";
import { SalaryFilters } from "../features/montly-salary-management/components/SalaryFilters";
import { SalaryActionBar } from "../features/montly-salary-management/components/SalaryActionBar";
import { SalaryTableRenderer } from "../features/montly-salary-management/components/SalaryTableRenderer";
import { ConfirmAttendanceDialog } from "../features/montly-salary-management/components/dialogs/ConfirmAttendanceDialog";
import { CommentStatusDialog } from "../features/montly-salary-management/components/dialogs/CommentStatusDialog";
import { ResultSummaryDialog } from "../features/montly-salary-management/components/dialogs/ResultSummaryDialog";

export const SalaryTransfer = () => {
    const {
        // Filter values
        selectedStructureType, setSelectedStructureType,
        selectedMonth, setSelectedMonth,
        selectedYear, setSelectedYear,
        selectedDepartment, setSelectedDepartment,

        // API data
        structureTypesData, isLoadingTypes,
        formattedYears,
        departmentOptions,
        isLoadingEmployees, employeeError,
        filteredEmployeeList,

        // Derived
        resolvedRoleId,
        currentStepTrack,
        isMonthDisabled,

        // Table
        handleSalaryDataChange,

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
    } = useSalaryTransfer();

    const employeeList = filteredEmployeeList ?? [];
    const hasEmployees = employeeList.length > 0;

    return (
        <Box
            sx={{
                height: "100%",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                pt: 1,
            }}
        >
            {/* ── Header ──────────────────────────────────────────────────── */}
            <Box sx={{ mb: 0, flexShrink: 0 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "primary.main" }}>
                        Employee Wise Payroll
                    </Typography>
                </Stack>

                {/* Filters + Stage badge Card */}
                <SalaryFilters
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    selectedMonth={selectedMonth}
                    setSelectedMonth={setSelectedMonth}
                    selectedDepartment={selectedDepartment}
                    setSelectedDepartment={setSelectedDepartment}
                    departmentOptions={departmentOptions}
                    selectedStructureType={selectedStructureType}
                    setSelectedStructureType={setSelectedStructureType}
                    formattedYears={formattedYears}
                    isLoadingTypes={isLoadingTypes}
                    structureTypesData={structureTypesData}
                    isMonthDisabled={isMonthDisabled}
                    currentStepTrack={currentStepTrack}
                >
                    {/* Action buttons are rendered inside the same card via children slot */}
                    {selectedStructureType && hasEmployees && (
                        <SalaryActionBar
                            resolvedRoleId={resolvedRoleId}
                            isLoadingEmployees={isLoadingEmployees}
                            generateSalaryMutation={generateSalaryMutation}
                            saveEmployeeDataMutation={saveEmployeeDataMutation}
                            salaryTimelineMutation={salaryTimelineMutation}
                            employeeList={employeeList}
                            onExportExcel={handleExportExcel}
                            onExportPdf={handleExportPdf}
                            onSaveAll={handleSaveAll}
                            onTimeline={handleTimeline}
                            onSubmit={handleSubmit}
                        />
                    )}
                </SalaryFilters>
            </Box>

            {/* ── Table ───────────────────────────────────────────────────── */}
            <Box sx={{ flex: 1, overflow: "hidden", minHeight: 0 }}>
                <SalaryTableRenderer
                    selectedStructureType={selectedStructureType}
                    isLoadingEmployees={isLoadingEmployees}
                    employeeError={employeeError}
                    employeeData={employeeList}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    resolvedRoleId={resolvedRoleId}
                    currentStepTrack={currentStepTrack}
                    onDataChange={handleSalaryDataChange}
                />
            </Box>

            {/* ── Dialogs ─────────────────────────────────────────────────── */}
            <ConfirmAttendanceDialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                onProceed={handleProceedAfterConfirm}
                counts={counts}
            />

            <CommentStatusDialog
                open={commentDialogOpen}
                onClose={() => setCommentDialogOpen(false)}
                onProceed={handleConfirmAndGenerate}
                comment={timelineComment}
                onCommentChange={setTimelineComment}
                status={timelineStatus}
                onStatusChange={setTimelineStatus}
                isLoading={generateSalaryMutation.isPending}
            />

            <ResultSummaryDialog
                open={resultDialogOpen}
                onClose={() => setResultDialogOpen(false)}
                counts={resultCounts}
            />
        </Box>
    );
};
