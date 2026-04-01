import { Box, Stack, Typography } from "@mui/material";

import { useSalaryTransfer } from "../features/montly-salary-management/hooks/useSalaryTransfer";
import { SalaryFilters } from "../features/montly-salary-management/components/SalaryFilters";
import { SalaryActionBar } from "../features/montly-salary-management/components/SalaryActionBar";
import { SalaryTableRenderer } from "../features/montly-salary-management/components/SalaryTableRenderer";
import { ConfirmAttendanceDialog } from "../features/montly-salary-management/components/dialogs/ConfirmAttendanceDialog";
import { BackToHrCommentDialog } from "../features/montly-salary-management/components/dialogs/BackToHrCommentDialog";
import { BackToFinanceCommentDialog } from "../features/montly-salary-management/components/dialogs/BackToFinanceCommentDialog";
import { ForwardToFinanceCommentDialog } from "../features/montly-salary-management/components/dialogs/ForwardToFinanceCommentDialog";
import { ForwardToHrCommentDialog } from "../features/montly-salary-management/components/dialogs/ForwardToHrCommentDialog";
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
        currentTableData,
        handleSalaryDataChange,

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
        openForwardToFinanceDialog,
        handleConfirmForwardToFinance,
        openForwardToHrDialog,
        handleConfirmForwardToHr,
        openBackToHrDialog,
        handleConfirmBackToHr,
        openBackToFinanceDialog,
        handleConfirmBackToFinance,
        handleEnableSlip,
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
    } = useSalaryTransfer();

    const employeeList = filteredEmployeeList ?? [];
    const actionEmployeeList =
        currentTableData.length > 0 ? currentTableData : employeeList;
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
                            salarySlipGenerateMutation={salarySlipGenerateMutation}
                            salaryTimelineMutation={salaryTimelineMutation}
                            employeeList={actionEmployeeList}
                            onExportExcel={handleExportExcel}
                            onExportPdf={handleExportPdf}
                            onSaveAll={handleSaveAll}
                            onForwardToFinance={openForwardToFinanceDialog}
                            onForwardToHR={openForwardToHrDialog}
                            onBackToHR={openBackToHrDialog}
                            onBackToFinance={openBackToFinanceDialog}
                            onEnableSlip={handleEnableSlip}
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

            <BackToHrCommentDialog
                open={backToHrDialogOpen}
                onClose={() => setBackToHrDialogOpen(false)}
                onProceed={handleConfirmBackToHr}
                comment={backToHrComment}
                onCommentChange={setBackToHrComment}
                isLoading={salarySendBackMutation.isPending}
            />

            <BackToFinanceCommentDialog
                open={backToFinanceDialogOpen}
                onClose={() => setBackToFinanceDialogOpen(false)}
                onProceed={handleConfirmBackToFinance}
                comment={backToFinanceComment}
                onCommentChange={setBackToFinanceComment}
                isLoading={salarySendBackMutation.isPending}
            />

            <ForwardToHrCommentDialog
                open={forwardToHrDialogOpen}
                onClose={() => setForwardToHrDialogOpen(false)}
                onProceed={handleConfirmForwardToHr}
                comment={forwardToHrComment}
                onCommentChange={setForwardToHrComment}
                isLoading={saveEmployeeDataMutation.isPending}
            />

            <ForwardToFinanceCommentDialog
                open={forwardToFinanceDialogOpen}
                onClose={() => setForwardToFinanceDialogOpen(false)}
                onProceed={handleConfirmForwardToFinance}
                comment={forwardToFinanceComment}
                onCommentChange={setForwardToFinanceComment}
                isLoading={saveEmployeeDataMutation.isPending}
            />

            <ResultSummaryDialog
                open={resultDialogOpen}
                onClose={() => setResultDialogOpen(false)}
                counts={resultCounts}
            />
        </Box>
    );
};
