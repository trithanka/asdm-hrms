import html2pdf from "html2pdf.js";
import { convertTo12HourFormat } from "./formatter";

// Define the types for the attendance data
interface AttendanceData {
  empId: string;
  name: string;
  designation: string;
  departmentName: string;
  attendance: {
    date: string;
    punchInOutdoor: number;
    punchOutOutdoor: number;
    punch: { inTime: string; outTime: string };
  }[];
}

const generateAttendancePDF = (
  attendanceData: AttendanceData[],
  startDate: string,
  endDate: string
): void => {
  const allDates = Array.from(
    new Set(
      attendanceData.flatMap((data) =>
        data.attendance
          .map((att) => att.date)
          .filter((date) => date !== "Invalid date")
      )
    )
  );

  const tableRows = attendanceData.map(
    (data, index) =>
      `<tr key=${data.empId}>
            <td>${index + 1}</td>
            <td>${data.empId}</td>
            <td>${data.name}</td>
            <td>${data.designation}</td>
             ${allDates
               .map((date) => {
                 const attendance = data.attendance.find(
                   (att) => att.date === date
                 );
                 return `<td>${
                   attendance
                     ? `In Time: ${
                         convertTo12HourFormat(attendance.punch.inTime) ?? "N/A"
                       } ${
                         attendance.punchInOutdoor === 1 ? "Indoor" : "Outdoor"
                       } <br/> Out Time: ${
                         attendance.punch.outTime === "null"
                           ? "N/A"
                           : convertTo12HourFormat(attendance.punch.outTime)
                       } ${
                         attendance.punch.outTime === "null"
                           ? ""
                           : attendance.punchOutOutdoor === 1
                           ? "Indoor"
                           : "Outdoor"
                       }`
                     : "No Data"
                 }</td>`;
               })
               .join("")}
        </tr>`
  );

  const tableHeaders = allDates.map((date) => `<th>${date}</th>`).join("");

  // Create the HTML content with dynamic data
  const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Attendance Form</title>
            <style>
                body { font-family: Arial; font-size: 10px; sans-serif; margin: 0; padding: 0;}
                .container {margin: 50px auto; background-color: white; padding: 20px;}
                h1 { text-align: center; color: #333; }
                h2 { text-align:center, color: #333 }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { padding: 12px; text-align: center; border: 1px solid #ddd; }
                th { font-weight: bold; }
                td input { width: 100%; padding: 5px; border: 1px solid #ddd; border-radius: 5px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Attendance Report ${startDate} - ${endDate}</h1>
                <table id="attendance-table">
                    <thead>
                        <tr>
                            <th>S No</th>
                            <th>Employee Id</th>
                            <th>Name</th>
                            <th>Designation</th>
                            ${tableHeaders}
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows.join("")}
                    </tbody>
                </table>
            </div>
        </body>
        </html>
    `;

  // Create a blob of the content and initiate PDF download
  const element = document.createElement("div");
  element.innerHTML = htmlContent;
  document.body.appendChild(element);

  html2pdf()
    .from(element)
    .set({
      orientation: "landscape", // Set the orientation to landscape
      filename: "attendance-report.pdf", // Optional: set the filename
    })
    .save()
    .then(() => {
      document.body.removeChild(element);
    });
};

export default generateAttendancePDF;
