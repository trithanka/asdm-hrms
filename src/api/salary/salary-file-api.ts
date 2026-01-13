import API from "..";

export interface SalaryFile {
    id: number;
    fileName: string;
    fileType: string;
    generatedDate: string;
    month: number;
    year: number;
    status: string;
}

export interface SalaryFileResponse {
    success: boolean;
    data: SalaryFile[];
    message?: string;
}

export interface GenerateSalaryFilePayload {
    month: number;
    year: number;
    fileType: string;
    selectedEmployeeIds?: number[];
}

export interface GenerateSalaryFileResponse {
    success: boolean;
    message: string;
    data?: {
        fileId: number;
        fileName: string;
    };
}

export interface SalaryStructureType {
    type: string;
}

export interface FyMaster {
    pklSalaryFinancialYearId: number;
    vsFy: string;
    iStartMonth: number;
    bEnabled: number;
    dtCreatedAt: string;
}

export interface DesignationCategory {
    pklDesignationCategoryId: number;
    vsDesignationCategoryName: string;
    fklSlarayStructureTypeId: number;
    fklModifiedByLoginId: number;
    dtModifiedDate: string;
}

export interface SalaryStructureTypesResponse {
    status: string;
    message: string;
    data: {
        salaryStructureTypes: SalaryStructureType[];
        fyMaster: FyMaster[];
        designationCategory: DesignationCategory[];
    };
    statusCode: number;
}

export interface FyMasterResponse {
    status: string;
    message: string;
    data: FyMaster[];
    statusCode: number;
}

export interface EmployeeListPayload {
    salaryStructureType: string;
    generateMonth: string;
    generateYear: string;
}

export interface EmployeeData {
    fullName: string;
    employeeId: number;
    designationName: string;
    designationId: number;
    internalDept: string;
    designationCategory: string;
    workingDays: number;
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
    generateOn: string | null;
    generateSalaryDate: string | null;
    pklSalaryBreakingAsdmNescEmployeeWiseId: number | null;
    salaryStatus: string;
}

export interface EmployeeListResponse {
    status: string;
    message: string;
    employeeList: EmployeeData[];
    statusCode: number;
}

export interface GenerateEmployeeData {
    employeeId: number;
    attendance: number;
    lwp: number;
    arear: number;
    incomeTax: number;
    otherDeduction: number;
}

export interface GenerateSalaryPayload {
    salaryStructureType: string;
    generateMonth: string;
    generateYear: string;
    generateEmployees: GenerateEmployeeData[];
}

export interface GenerateSalaryResponse {
    status: string;
    sucessReport: {
        status: boolean;
        successfullyGenerateCount: number;
        successfullyGenerate: any[];
        failedGenerateCount: number;
        failedGenerate: Array<{
            SI: number;
            employeeId: number;
            message: string;
        }>;
        total: number;
        message: string | null;
    };
    statusCode: number;
}

export const salaryFileApi = {
    // Get all salary files
    getSalaryFiles: async (): Promise<SalaryFileResponse> => {
        const response = await API.post("/SalaryGenerate/salary-master");
        return response.data;
    },

    // Get salary files filtered by month and year
    getSalaryFilesByDate: async (month: number, year: number): Promise<SalaryFileResponse> => {
        const response = await API.post("/SalaryGenerate/salary-master", {
            month,
            year,
        });
        return response.data;
    },

    // Get salary structure types
    getSalaryStructureTypes: async (): Promise<SalaryStructureTypesResponse> => {
        const response = await API.post("/SalaryGenerate/salary-master");
        return response.data;
    },

    // Get employee list based on salary structure type, month, and year
    getEmployeeList: async (payload: EmployeeListPayload): Promise<EmployeeListResponse> => {
        const response = await API.post("/SalaryGenerate/employee-list", payload);
        return response.data;
    },

    // Generate salary for employees
    generateSalary: async (payload: GenerateSalaryPayload): Promise<GenerateSalaryResponse> => {
        const response = await API.post("/SalaryGenerate/generate-salary", payload);
        return response.data;
    },

    // Generate/Create new salary file
    generateSalaryFile: async (payload: GenerateSalaryFilePayload): Promise<GenerateSalaryFileResponse> => {
        const response = await API.post("/SalaryGenerate/salary-master", payload);
        return response.data;
    },

    // Download salary file
    downloadSalaryFile: async (fileId: number): Promise<Blob> => {
        const response = await API.get(`/SalaryGenerate/salary-master/${fileId}/download`, {
            responseType: "blob",
        });
        return response.data;
    },

    // Get salary slip
    getSalarySlip: async (payload: SalarySlipPayload): Promise<SalarySlipResponse> => {
        const response = await API.post("/SalaryGenerate/salary-slip", payload);
        return response.data;
    },

    // Create/Update financial year
    saveFinancialYear: async (payload: { vsFy: string, iStartMonth: number, bEnabled: number, pklSalaryFinancialYearId?: number }): Promise<any> => {
        const response = await API.post("/SalaryGenerate/financial-year-save", payload);
        return response.data;
    },

    // Toggle masters (financial year, etc)
    toggleMasters: async (id: number, toggleCard: string, card: string): Promise<any> => {
        const response = await API.post("/SalaryGenerate/toggle-masters", { id, toggleCard, card });
        return response.data;
    },

    // Get salary breaking master
    getSalaryBreakingMaster: async (structType: string, fyId?: string): Promise<any> => {
        const payload: any = { structType };
        if (fyId && fyId !== "all") {
            payload.FinancialYearId = Number(fyId);
        }
        const response = await API.post("/SalaryGenerate/salary-breaking", payload);
        return response.data;
    },

    // Save/Update salary breaking master
    saveSalaryBreakingMaster: async (payload: any): Promise<any> => {
        const response = await API.post("/SalaryGenerate/breaking-master-save", payload);
        return response.data;
    },

    // Toggle salary breaking master status
    toggleSalaryBreakingMaster: async (id: number): Promise<any> => {
        const response = await API.post("/SalaryGenerate/breaking-master-toggle", { pklSalaryBreakingAsdmNescId: id });
        return response.data;
    },

    // Get financial year master data
    getFyMaster: async (): Promise<FyMasterResponse> => {
        const response = await API.post("/SalaryGenerate/fy-salary-master", {});
        return response.data;
    },
};

export interface SalarySlipPayload {
    employeeId: string;
    generateMonth: string;
    generateYear: string;
}

export interface SalarySlipData {
    generatedOn: any;
    salaryReportId: number;
    fullName: string;
    dateOfJoing: string;
    designation: string;
    salarySlipMonth: string;
    salarySlipMonthString: string;
    fixedSalary: number;
    houseRent: number;
    mobileInternet: number;
    newspaperMagazine: number;
    conveyanceAllowance: number;
    educationAllowance: number;
    grossSalary: number;
    deductionPtax: number;
    deductionIncomeTax: number;
    ddvancesOtherDeductions: number;
    netAmount: number;
}

export interface SalarySlipResponse {
    status: string;
    message: string;
    data: SalarySlipData[];
    statusCode: number;
}
