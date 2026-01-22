import * as XLSX from "xlsx";

interface SalarySheetData {
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
    salaryStatus: string;
}

interface ExportOptions {
    month: string;
    year: string;
    structureType: string;
}

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export function exportAsdmNescSalaryReport(
    data: SalarySheetData[],
    options: ExportOptions
) {
    const monthName = MONTH_NAMES[parseInt(options.month) - 1] || options.month;
    const fileName = `ASDM_NESC_Salary_Report_${monthName}_${options.year}.xlsx`;

    // Prepare the rows with formatted data
    const rows = data.map((emp, index) => ({
        "Sl. No.": index + 1,
        "Employee ID": emp.employeeId,
        "Name": emp.fullName,
        "Designation": emp.designationName,
        "Category": emp.designationCategory,
        "Attendance": emp.attendance ?? 0,
        "LWP Days": emp.lwpDays ?? 0,
        "Basic Pay (₹)": emp.basicPay,
        "Increment (₹)": emp.incrementPercentValueFy ?? 0,
        "Salary (₹)": emp.salary ?? 0,
        "House Rent (₹)": emp.houseRentPercentValue ?? 0,
        "Mobile/Internet (₹)": emp.mobileInternet,
        "News Paper/Magazine (₹)": emp.newsPaperMagazine,
        "Conveyance Allowance (₹)": emp.conveyanceAllowances,
        "Education Allowance (₹)": emp.educationAllowance,
        "Arrear (₹)": emp.arrear ?? 0,
        "Total Pay (₹)": emp.totalSalary ?? 0,
        "PTax Deduction (₹)": emp.deductionOfPtax ?? 0,
        "Income Tax Deduction (₹)": emp.deductionIncomeTax ?? 0,
        "Other Deductions (₹)": emp.ddvancesOtherDeductions ?? 0,
        "Total Deduction (₹)": emp.totalDeduction ?? 0,
        "Net Amount (₹)": emp.netAmount ?? 0,
        "Status": emp.salaryStatus,
    }));

    // Calculate totals
    const totals = data.reduce(
        (acc, emp) => ({
            attendance: acc.attendance + (emp.attendance ?? 0),
            lwpDays: acc.lwpDays + (emp.lwpDays ?? 0),
            basicPay: acc.basicPay + emp.basicPay,
            increment: acc.increment + (emp.incrementPercentValueFy ?? 0),
            salary: acc.salary + (emp.salary ?? 0),
            houseRent: acc.houseRent + (emp.houseRentPercentValue ?? 0),
            mobileInternet: acc.mobileInternet + emp.mobileInternet,
            newsPaperMagazine: acc.newsPaperMagazine + emp.newsPaperMagazine,
            conveyanceAllowances: acc.conveyanceAllowances + emp.conveyanceAllowances,
            educationAllowance: acc.educationAllowance + emp.educationAllowance,
            arrear: acc.arrear + (emp.arrear ?? 0),
            totalSalary: acc.totalSalary + (emp.totalSalary ?? 0),
            deductionOfPtax: acc.deductionOfPtax + (emp.deductionOfPtax ?? 0),
            deductionIncomeTax: acc.deductionIncomeTax + (emp.deductionIncomeTax ?? 0),
            otherDeductions: acc.otherDeductions + (emp.ddvancesOtherDeductions ?? 0),
            totalDeduction: acc.totalDeduction + (emp.totalDeduction ?? 0),
            netAmount: acc.netAmount + (emp.netAmount ?? 0),
        }),
        {
            attendance: 0,
            lwpDays: 0,
            basicPay: 0,
            increment: 0,
            salary: 0,
            houseRent: 0,
            mobileInternet: 0,
            newsPaperMagazine: 0,
            conveyanceAllowances: 0,
            educationAllowance: 0,
            arrear: 0,
            totalSalary: 0,
            deductionOfPtax: 0,
            deductionIncomeTax: 0,
            otherDeductions: 0,
            totalDeduction: 0,
            netAmount: 0,
        }
    );

    // Add totals row
    const totalsRow = {
        "Sl. No.": "",
        "Employee ID": "",
        "Name": "TOTAL",
        "Designation": "",
        "Category": "",
        "Attendance": totals.attendance,
        "LWP Days": totals.lwpDays,
        "Basic Pay (₹)": totals.basicPay,
        "Increment (₹)": totals.increment,
        "Salary (₹)": totals.salary,
        "House Rent (₹)": totals.houseRent,
        "Mobile/Internet (₹)": totals.mobileInternet,
        "News Paper/Magazine (₹)": totals.newsPaperMagazine,
        "Conveyance Allowance (₹)": totals.conveyanceAllowances,
        "Education Allowance (₹)": totals.educationAllowance,
        "Arrear (₹)": totals.arrear,
        "Total Pay (₹)": totals.totalSalary,
        "PTax Deduction (₹)": totals.deductionOfPtax,
        "Income Tax Deduction (₹)": totals.deductionIncomeTax,
        "Other Deductions (₹)": totals.otherDeductions,
        "Total Deduction (₹)": totals.totalDeduction,
        "Net Amount (₹)": totals.netAmount,
        "Status": "",
    };

    rows.push(totalsRow as any);

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);

    // Set column widths for better readability
    const columnWidths = [
        { wch: 8 },   // Sl. No.
        { wch: 12 },  // Employee ID
        { wch: 25 },  // Name
        { wch: 20 },  // Designation
        { wch: 15 },  // Category
        { wch: 12 },  // Attendance
        { wch: 10 },  // LWP Days
        { wch: 14 },  // Basic Pay
        { wch: 12 },  // Increment
        { wch: 14 },  // Salary
        { wch: 14 },  // House Rent
        { wch: 16 },  // Mobile/Internet
        { wch: 20 },  // News Paper/Magazine
        { wch: 20 },  // Conveyance Allowance
        { wch: 20 },  // Education Allowance
        { wch: 12 },  // Arrear
        { wch: 14 },  // Total Pay
        { wch: 16 },  // PTax Deduction
        { wch: 20 },  // Income Tax Deduction
        { wch: 18 },  // Other Deductions
        { wch: 16 },  // Total Deduction
        { wch: 14 },  // Net Amount
        { wch: 12 },  // Status
    ];
    worksheet["!cols"] = columnWidths;

    // Add the worksheet to workbook with sheet name
    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        `${monthName} ${options.year}`
    );

    // Write the file
    XLSX.writeFile(workbook, fileName, { compression: true });

    return fileName;
}

export function useExportSalaryReport() {
    const exportToExcel = (
        data: SalarySheetData[],
        options: ExportOptions
    ): string | null => {
        if (!data || data.length === 0) {
            return null;
        }

        try {
            return exportAsdmNescSalaryReport(data, options);
        } catch (error) {
            console.error("Error exporting salary report:", error);
            return null;
        }
    };

    return { exportToExcel };
}
