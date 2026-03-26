import { ROLE_IDS } from "../constants/salaryConstants";

export interface PayrollEmployee {
    stepTrack?: number | null;
    isHold?: number | null | boolean;
    hold?: boolean; // sometimes its mapped as hold in the UI
}

export interface PayrollActions {
    showForwardToFinance: boolean;
    showRevertToFinance: boolean;
    showGenerateSalary: boolean;
    showForwardToHR: boolean;
    showRevertToHR: boolean;
    showSaveAll: boolean;
    showEnableSalarySlip: boolean;
}

const DEFAULT_ACTIONS: PayrollActions = {
    showForwardToFinance: false,
    showRevertToFinance: false,
    showGenerateSalary: false,
    showForwardToHR: false,
    showRevertToHR: false,
    showSaveAll: false,
    showEnableSalarySlip: false,
};

/**
 * Derives allowable payroll action buttons based on employee data and user role.
 */
export function getPayrollActions(employees: PayrollEmployee[], roleId: number): PayrollActions {
    if (!employees || employees.length === 0) return DEFAULT_ACTIONS;

    const activeEmployees = employees.filter(emp => !emp.isHold && !emp.hold);

    if (activeEmployees.length === 0) return DEFAULT_ACTIONS;

    if (roleId === ROLE_IDS.HR) { // 98
        const hasPrepStep = activeEmployees.some(emp => emp.stepTrack === null || emp.stepTrack === 1);
        const allAtGenStep = activeEmployees.every(emp => emp.stepTrack === 3);
        const allAtCompleted = activeEmployees.every(emp => emp.stepTrack === 4);

        return {
            ...DEFAULT_ACTIONS,
            showForwardToFinance: hasPrepStep,
            showSaveAll: hasPrepStep,
            showRevertToFinance: allAtGenStep,
            showGenerateSalary: allAtGenStep,
            showEnableSalarySlip: allAtCompleted,
        };
    }

    if (roleId === ROLE_IDS.FINANCE) { // 36
        const allAtFinanceStep = activeEmployees.every(emp => emp.stepTrack === 2);

        return {
            ...DEFAULT_ACTIONS,
            showForwardToHR: allAtFinanceStep,
            showRevertToHR: allAtFinanceStep,
        };
    }

    return DEFAULT_ACTIONS;
}
