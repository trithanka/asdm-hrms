export const SALARY_MONTHS = [
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
] as const;

export const SALARY_STAGE_LABELS: Record<number, string> = {
    1: "Preparation",
    2: "Finance Verification",
    3: "Generate Salary",
    4: "Completed",
};

export const SALARY_STAGE_COLORS: Record<number, { bgcolor: string; color: string }> = {
    1: { bgcolor: "#f5f5f5", color: "#757575" },
    2: { bgcolor: "#fff3e0", color: "#ed6c02" },
    3: { bgcolor: "#e3f2fd", color: "#1976d2" },
    4: { bgcolor: "#e8f5e9", color: "#2e7d32" },
};

/** Role IDs used throughout the payroll system */
export const ROLE_IDS = {
    HR: 98,
    FINANCE: 36,
} as const;
