import { SalarySlipData } from "../../../api/salary/salary-file-api";
// @ts-ignore
import html2pdf from 'html2pdf.js';
import moment from "moment";

export const generateSalarySlip = async (data: SalarySlipData) => {
    const logoUrl = `${window.location.origin}/asdm-logo.png`;
    const dateOfJoing = data.dateOfJoing ? moment(data.dateOfJoing).format("DD-MM-YYYY") : moment().format("DD-MM-YYYY");
    const generatedDate = data.generatedOn ? moment(data.generatedOn).format("DD-MM-YYYY") : moment().format("DD-MM-YYYY");

    const content = `
    <style>
        .salary-slip-container {
            font-family: Arial, sans-serif;
            padding: 40px;
            color: #333;
            line-height: 1.2;
            position: relative;
            font-size: 18px;
            background-color: white;
            width: 210mm;
            min-height: 296mm;
            overflow: hidden;
            box-sizing: border-box;
        }
        .watermark {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 0;
            pointer-events: none;
        }
        .watermark img {
            width: 400px;
            opacity: 0.1;
        }
        .content-wrapper {
            position: relative;
            z-index: 1;
        }
        .header-container {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 35px;
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
            font-size: 20px;
            font-weight: bold;
        }
        .header-text p {
            margin: 2px 0;
            font-size: 16px;
        }
        .slip-title {
            text-align: center;
            margin-top: 10px;
            margin-bottom: 60px;
        }
        .slip-title h3 {
            margin: 0;
            font-size: 18px;
            text-decoration: underline; 
            text-transform: uppercase;
        }
        .info-section {
            width: 100%;
            margin-bottom: 10px;
            font-size: 16px;
        }
        .info-row {
            display: flex;
            justify-content: flex-start;
            margin-bottom: 3px;
        }
        .info-label {
            width: 180px;
            margin-bottom: 2px;
            font-weight: 600;
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
            font-size: 16px;
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
    </style>

    <div class="salary-slip-container">
        <div class="watermark">
            <img src="${logoUrl}" alt="Watermark">
        </div>
        <div class="content-wrapper">
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
                <h3>Salary Slip for the Month of ${data.salarySlipMonthString}</h3>
            </div>

            <div class="info-section">
                <div class="info-row">
                    <span class="info-label">Name of Employee:</span>
                    <span>${data.fullName}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Date of Joining:</span>
                    <span>${dateOfJoing}</span>
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
                        <th class="amount-col" style="text-align: right;">Amount (Rs.)</th>
                        <th class="total-col" style="text-align: right;">Total (Rs.)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="bold-text">Fixed Salary</td>
                        <td class="amount-col" style="text-align: right;">${(data.fixedSalary ?? 0).toLocaleString()}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td class="bold-text">Add: Allowances</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td class="sub-item">1. House Rent Allowance @12% on Fixed Salary</td>
                        <td class="amount-col" style="text-align: right;">${(data.houseRent ?? 0).toLocaleString()}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td class="sub-item">2. Mobile & Internet Allowance</td>
                        <td class="amount-col" style="text-align: right;">${(data.mobileInternet ?? 0).toLocaleString()}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td class="sub-item">3. Newspaper & Magazine Allowance</td>
                        <td class="amount-col" style="text-align: right;">${(data.newspaperMagazine ?? 0).toLocaleString()}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td class="sub-item">4. Conveyance Allowance</td>
                        <td class="amount-col" style="text-align: right;">${(data.conveyanceAllowance ?? 0).toLocaleString()}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td class="sub-item">5. Children Education Allowance</td>
                        <td class="amount-col" style="text-align: right;">${(data.educationAllowance ?? 0).toLocaleString()}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td class="bold-text">Gross Salary</td>
                        <td></td>
                        <td class="total-col" style="text-align: right;">${(data.grossSalary ?? 0).toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td class="bold-text">Less: Deductions</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td class="sub-item">1. Assam Professional Tax</td>
                        <td class="amount-col" style="text-align: right;">${(data.deductionPtax ?? 0).toLocaleString()}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td class="sub-item">2. Income Tax deducted at Source</td>
                        <td class="amount-col" style="text-align: right;">${(data.deductionIncomeTax ?? 0).toLocaleString()}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td class="sub-item">3. Advance</td>
                        <td class="amount-col" style="text-align: right;">${(data.ddvancesOtherDeductions ?? 0).toLocaleString()}</td>
                        <td></td>
                    </tr>
                    <tr style="height: 40px; background-color: #f2f2f2;">
                        <td class="bold-text">Net Salary</td>
                        <td></td>
                        <td class="total-col bold-text" style="text-align: right;">${(data.netAmount ?? 0).toLocaleString()}</td>
                    </tr>
                </tbody>
            </table>

            <div class="info-section" style="margin-top: 10px;">
                <div class="info-row">
                    <span class="info-label">Place:</span>
                    <span>Guwahati</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Date:</span>
                    <span>${generatedDate}</span>
                </div>
            </div>

            <div style="margin-top: 150px;text-align: center; font-size: 12px; ">THIS IS SYSTEM GENERATED SLIP. NO SIGNATURE REQUIRED</div>
        </div>
    </div>
    `;

    // 1. Create container
    const element = document.createElement('div');
    element.innerHTML = content;

    // 2. Positioning: Absolute at 0,0 with high z-index
    // This ensures html2canvas can "see" it at the top of the document


    document.body.appendChild(element);

    // 3. Image Preloading Strategy
    // Critical: Wait for all images to fully load before generating PDF
    const images = Array.from(element.querySelectorAll('img'));
    const imagePromises = images.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve; // Continue even if image fails
        });
    });

    await Promise.all(imagePromises);

    // 4. Scroll to top to ensure viewport alignment
    window.scrollTo(0, 0);

    // 5. Configuration
    const opt = {
        margin: 0,
        filename: `Salary_Slip_${data.salarySlipMonthString}_${data.fullName}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            scrollY: 0,
            scrollX: 0,
            windowWidth: document.documentElement.offsetWidth, // Capture full width
            windowHeight: document.documentElement.offsetHeight // Capture full height
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // 6. Generate with a small buffer for rendering
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
        await html2pdf().set(opt).from(element).save();
    } catch (error) {
        console.error("PDF Generation failed:", error);
    } finally {
        // 7. Cleanup
        document.body.removeChild(element);
    }
};
