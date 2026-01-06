import { SalarySlipData } from "../../../api/salary/salary-file-api";

export const generateSalarySlip = (data: SalarySlipData) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert("Please allow popups to generate the salary slip.");
        return;
    }

    const logoUrl = `${window.location.origin}/asdm-logo.png`;

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Salary Slip</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
            line-height: 1.2;
            position: relative;
            font-size: 13px;
        }
        body::before {
            content: "";
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url('${logoUrl}');
            background-repeat: no-repeat;
            background-position: center;
            background-size: 400px;
            opacity: 0.1;
            z-index: -1;
            pointer-events: none;
        }
        .header-container {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 15px;
            position: relative;
        }
        .logo-container {
            position: absolute;
            left: 0;
            top: 0;
        }
        .logo-container img {
            width: 80px;
            height: auto;
        }
        .header-text {
            text-align: center;
            width: 100%;
        }
        .header-text h1 {
            margin: 0;
            font-size: 18px;
            font-weight: bold;
        }
        .header-text p {
            margin: 2px 0;
            font-size: 12px;
        }
        .slip-title {
            text-align: center;
            margin-top: 10px;
            margin-bottom: 10px;
        }
        .slip-title h3 {
            margin: 0;
            font-size: 16px;
            text-decoration: underline;
        }
        .info-section {
            width: 100%;
            margin-bottom: 10px;
            font-size: 13px;
        }
        .info-row {
            display: flex;
            justify-content: flex-start;
            margin-bottom: 3px;
        }
        .info-label {
            width: 150px;
            font-weight: normal;
        }
        .salary-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 5px;
        }
        .salary-table th, .salary-table td {
            border: 1px solid #000;
            padding: 5px;
            text-align: left;
            vertical-align: top;
            font-size: 13px;
        }
        .salary-table th {
            text-align: center;
            background-color: #f2f2f2;
            font-weight: bold;
        }
        .amount-col {
            width: 120px;
            text-align: right;
            font-weight: bold;
        }
        .total-col {
            width: 120px;
            text-align: right;
            font-weight: bold;
        }
        .sub-item {
            padding-left: 15px;
        }
        .bold-text {
            font-weight: bold;
        }
        @media print {
            .no-print {
                display: none;
            }
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            @page {
                margin: 10mm;
            }
        }
    </style>
</head>
<body>

    <div class="header-container">
        <div class="logo-container">
            <img src="${logoUrl}" alt="ASDM Logo">
        </div>
        <div class="header-text">
            <h1>Assam Skill Development Mission</h1>
            <p>(Under Skill, Employment & Entrepreneurship Department, Govt. of Assam)</p> 
            <p>Katabari, DPS Road, NH-27, Gorchuk, Guwahati</p> 
            <p>Assam 781035</p>
        </div>
    </div>

    <div class="slip-title">
        <h3>Salary Slip for the Month of: ${data.salarySlipMonthString}</h3> 
    </div>

    <div class="info-section">
        <div class="info-row">
            <span class="info-label">Name of Employee:</span> 
            <span>${data.fullName}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Date of Joining:</span>
            <span>${data.dateOfJoing}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Designation:</span>
            <span>${data.designation}</span>
        </div>
    </div>

    <table class="salary-table">
        <thead>
            <tr>
                <th>Particulars</th> 
                <th class="amount-col">Amount (Rs.)</th> 
                <th class="total-col">Total (Rs.)</th> 
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="bold-text">Fixed Salary</td> 
                <td class="amount-col">${(data.fixedSalary ?? 0).toLocaleString()}</td>
                <td></td>
            </tr>
            <tr>
                <td class="bold-text">Add: Allowances</td> 
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td class="sub-item">1. House Rent Allowance @12% on Fixed Salary</td> 
                <td class="amount-col">${(data.houseRent ?? 0).toLocaleString()}</td>
                <td></td>
            </tr>
            <tr>
                <td class="sub-item">2. Mobile & Internet Allowance</td> 
                <td class="amount-col">${(data.mobileInternet ?? 0).toLocaleString()}</td>
                <td></td>
            </tr>
            <tr>
                <td class="sub-item">3. Newspaper & Magazine Allowance</td> 
                <td class="amount-col">${(data.newspaperMagazine ?? 0).toLocaleString()}</td>
                <td></td>
            </tr>
            <tr>
                <td class="sub-item">4. Conveyance Allowance</td> 
                <td class="amount-col">${(data.conveyanceAllowance ?? 0).toLocaleString()}</td>
                <td></td>
            </tr>
            <tr>
                <td class="sub-item">5. Children Education Allowance</td> 
                <td class="amount-col">${(data.educationAllowance ?? 0).toLocaleString()}</td>
                <td></td>
            </tr>
            <tr>
                <td class="bold-text">Gross Salary</td> 
                <td></td>
                <td class="total-col">${(data.grossSalary ?? 0).toLocaleString()}</td>
            </tr>
            <tr>
                <td class="bold-text">Less: Deductions</td> 
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td class="sub-item">1. Assam Professional Tax</td> 
                <td class="amount-col">${(data.deductionPtax ?? 0).toLocaleString()}</td>
                <td></td>
            </tr>
            <tr>
                <td class="sub-item">2. Income Tax deducted at Source</td> 
                <td class="amount-col">${(data.deductionIncomeTax ?? 0).toLocaleString()}</td>
                <td></td>
            </tr>
            <tr>
                <td class="sub-item">3. Advance</td> 
                <td class="amount-col">${(data.ddvancesOtherDeductions ?? 0).toLocaleString()}</td>
                <td></td>
            </tr>
            <tr style="height: 30px;">
                <td class="bold-text">Net Salary</td> 
                <td></td>
                <td class="total-col bold-text">${(data.netAmount ?? 0).toLocaleString()}</td>
            </tr>
        </tbody>
    </table>

    <script>
        window.onload = function() {
            window.print();
        }
    </script>
</body>
</html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
};
