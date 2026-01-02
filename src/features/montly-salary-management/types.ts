export interface SalarySheetData {
    id: number;
    name: string;
    designationCategory: string;
    attendance: number;
    lwf: string;
    basicPay: number;
    dearnessAllowance: number;
    salary: number;
    houseRent: number;
    medicalIncentive: number;
    newsPaperAllowance: number;
    conveyanceAllowance: number;
    educationAllowance: number;
    arrear: number;
    totalPay: number;
    deductionOfTax: number;
    deductionOfLfEsi: number;
    advancesDeduction: number;
    totalDeductionAmount: number;
    netPayableInBank: number;
}

export interface BankTransferData {
    id: number;
    employeeId: string;
    employeeName: string;
    accountNumber: string;
    ifscCode: string;
    transferAmount: number;
    status: string;
}

export interface TaxDeductionData {
    id: number;
    employeeId: string;
    employeeName: string;
    grossSalary: number;
    taxableIncome: number;
    tdsAmount: number;
    panNumber: string;
}

export type FileType = "salary-sheet" | "bank-transfer" | "tax-deduction" | "";
