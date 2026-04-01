import * as XLSX from "xlsx";
// @ts-ignore
import html2pdf from "html2pdf.js";

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
        "Net Amount (₹)": Math.round(emp.netAmount ?? 0),
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
            netAmount: acc.netAmount + Math.round(emp.netAmount ?? 0),
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
    const merges = worksheet["!merges"] ?? [];

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

    // Add signature + address footer block below the data table (always visible)
    const totalRowsIncludingHeader = rows.length + 1;
    const footerStartRow = totalRowsIncludingHeader + 3;
    const footerStartCol = 0; // Column A
    const footerEndCol = 22; // Up to last export column

    const footerLines = [
        "Signature: __________________________",
        "",
        "Mission Director",
        "Assam Skill Development Mission",
        "Katabari (Assam), GHY-35",
    ];

    footerLines.forEach((line, index) => {
        const currentRow = footerStartRow + index;
        XLSX.utils.sheet_add_aoa(
            worksheet,
            [[line]],
            { origin: { r: currentRow - 1, c: footerStartCol } }
        );
        merges.push({
            s: { r: currentRow - 1, c: footerStartCol },
            e: { r: currentRow - 1, c: footerEndCol },
        });
    });

    worksheet["!merges"] = merges;

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
    const exportToPdf = async (
        data: SalarySheetData[],
        options: ExportOptions
    ): Promise<string | null> => {
        if (!data || data.length === 0) {
            return null;
        }

        try {
            const monthName = MONTH_NAMES[parseInt(options.month) - 1] || options.month;
            const fileName = `ASDM_NESC_Salary_Report_${monthName}_${options.year}.pdf`;
            const generatedOn = new Date().toLocaleDateString("en-IN");

            const bodyRows = data
                .map(
                    (emp, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${emp.employeeId}</td>
                        <td style="white-space:nowrap;">${emp.fullName ?? ""}</td>
                        <td style="white-space:nowrap;">${emp.designationName ?? ""}</td>
                        <td>${emp.designationCategory ?? ""}</td>
                        <td style="text-align:right;">${(emp.attendance ?? 0).toLocaleString()}</td>
                        <td style="text-align:right;">${(emp.lwpDays ?? 0).toLocaleString()}</td>
                        <td style="text-align:right;">${(emp.basicPay ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td style="text-align:right;">${(emp.incrementPercentValueFy ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td style="text-align:right;">${(emp.salary ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td style="text-align:right;">${(emp.houseRentPercentValue ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td style="text-align:right;">${(emp.mobileInternet ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td style="text-align:right;">${(emp.newsPaperMagazine ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td style="text-align:right;">${(emp.conveyanceAllowances ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td style="text-align:right;">${(emp.educationAllowance ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td style="text-align:right;">${(emp.arrear ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td style="text-align:right;">${(emp.totalSalary ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td style="text-align:right;">${(emp.deductionOfPtax ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td style="text-align:right;">${(emp.deductionIncomeTax ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td style="text-align:right;">${(emp.ddvancesOtherDeductions ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td style="text-align:right;">${(emp.totalDeduction ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td style="text-align:right; font-weight:bold;">${Math.round(emp.netAmount ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td>${emp.salaryStatus ?? ""}</td>
                    </tr>
                `
                )
                .join("");

            const totals = data.reduce(
                (acc, emp) => ({
                    attendance: acc.attendance + (emp.attendance ?? 0),
                    lwpDays: acc.lwpDays + (emp.lwpDays ?? 0),
                    basicPay: acc.basicPay + (emp.basicPay ?? 0),
                    increment: acc.increment + (emp.incrementPercentValueFy ?? 0),
                    salary: acc.salary + (emp.salary ?? 0),
                    houseRent: acc.houseRent + (emp.houseRentPercentValue ?? 0),
                    mobileInternet: acc.mobileInternet + (emp.mobileInternet ?? 0),
                    newsPaperMagazine: acc.newsPaperMagazine + (emp.newsPaperMagazine ?? 0),
                    conveyanceAllowances: acc.conveyanceAllowances + (emp.conveyanceAllowances ?? 0),
                    educationAllowance: acc.educationAllowance + (emp.educationAllowance ?? 0),
                    arrear: acc.arrear + (emp.arrear ?? 0),
                    totalSalary: acc.totalSalary + (emp.totalSalary ?? 0),
                    deductionOfPtax: acc.deductionOfPtax + (emp.deductionOfPtax ?? 0),
                    deductionIncomeTax: acc.deductionIncomeTax + (emp.deductionIncomeTax ?? 0),
                    otherDeductions: acc.otherDeductions + (emp.ddvancesOtherDeductions ?? 0),
                    totalDeduction: acc.totalDeduction + (emp.totalDeduction ?? 0),
                    netAmount: acc.netAmount + Math.round(emp.netAmount ?? 0),
                }),
                {
                    attendance: 0, lwpDays: 0, basicPay: 0, increment: 0, salary: 0,
                    houseRent: 0, mobileInternet: 0, newsPaperMagazine: 0,
                    conveyanceAllowances: 0, educationAllowance: 0, arrear: 0,
                    totalSalary: 0, deductionOfPtax: 0, deductionIncomeTax: 0,
                    otherDeductions: 0, totalDeduction: 0, netAmount: 0
                }
            );

            const content = `
            <style>
                .payroll-pdf {
                    font-family: Arial, sans-serif;
                    color: #222;
                    font-size: 8px;
                    padding: 20px;
                }
                .header {
                    text-align: center;
                    margin-bottom: 12px;
                }
                .header h2 {
                    margin: 0;
                    font-size: 16px;
                }
                .header p {
                    margin: 4px 0 0;
                    font-size: 10px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 12px;
                }
                th, td {
                    border: 1px solid #333;
                    padding: 4px;
                    font-size: 8px;
                }
                th {
                    background: #f2f2f2;
                    text-align: left;
                }
                .footer {
                    margin-top: 40px;
                    display: flex;
                    justify-content: flex-end;
                }
                .signature-block {
                    text-align: center;
                    font-weight: bold;
                    font-size: 10px;
                }
                .signature-block p {
                    margin: 0;
                }
            </style>

            <div class="payroll-pdf">
                <div class="header">
                    <h2>Employee Wise Payroll Report</h2>
                    <p>Month: <strong>${monthName}</strong> | Financial Year: <strong>${options.year}</strong> | Generated On: <strong>${generatedOn}</strong></p>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Sl. No.</th>
                            <th>Emp ID</th>
                            <th>Name</th>
                            <th>Designation</th>
                            <th>Category</th>
                            <th>Att.</th>
                            <th>LWP</th>
                            <th>Basic Pay</th>
                            <th>Inc.</th>
                            <th>Salary</th>
                            <th>HRA</th>
                            <th>Mob/Int</th>
                            <th>News</th>
                            <th>Conv. All.</th>
                            <th>Edu. All.</th>
                            <th>Arrear</th>
                            <th>Total Pay</th>
                            <th>PTax</th>
                            <th>ITax</th>
                            <th>Other Ded.</th>
                            <th>Total Ded.</th>
                            <th>Net Amt.</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${bodyRows}
                        <tr>
                            <td colspan="5" style="font-weight:700;">TOTAL</td>
                            <td style="text-align:right;font-weight:700;">${totals.attendance.toLocaleString()}</td>
                            <td style="text-align:right;font-weight:700;">${totals.lwpDays.toLocaleString()}</td>
                            <td style="text-align:right;font-weight:700;">${totals.basicPay.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td style="text-align:right;font-weight:700;">${totals.increment.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td style="text-align:right;font-weight:700;">${totals.salary.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td style="text-align:right;font-weight:700;">${totals.houseRent.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td style="text-align:right;font-weight:700;">${totals.mobileInternet.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td style="text-align:right;font-weight:700;">${totals.newsPaperMagazine.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td style="text-align:right;font-weight:700;">${totals.conveyanceAllowances.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td style="text-align:right;font-weight:700;">${totals.educationAllowance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td style="text-align:right;font-weight:700;">${totals.arrear.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td style="text-align:right;font-weight:700;">${totals.totalSalary.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td style="text-align:right;font-weight:700;">${totals.deductionOfPtax.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td style="text-align:right;font-weight:700;">${totals.deductionIncomeTax.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td style="text-align:right;font-weight:700;">${totals.otherDeductions.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td style="text-align:right;font-weight:700;">${totals.totalDeduction.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td style="text-align:right;font-weight:700;">${totals.netAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>

                <div class="footer">
                    <div class="signature-block">
                        <p>Mission Director</p>
                        <p>Assam Skill Development Mission</p>
                        <p>Katabari (Assam), GHY-35</p>
                    </div>
                </div>
            </div>
            `;

            const element = document.createElement("div");
            element.innerHTML = content;
            document.body.appendChild(element);

            const opt = {
                margin: [8, 8, 8, 8],
                filename: fileName,
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: "mm", format: "a3", orientation: "landscape" },
            };

            await html2pdf().set(opt).from(element).save();
            document.body.removeChild(element);
            return fileName;
        } catch (error) {
            console.error("Error exporting salary PDF report:", error);
            return null;
        }
    };

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

    return { exportToExcel, exportToPdf };
}
