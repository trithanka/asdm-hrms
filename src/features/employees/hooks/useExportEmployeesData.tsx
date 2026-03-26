import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { fetchEmployees } from "../../../api/employee/employee-api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import moment from "moment";

export function useExportEmployeeList() {
  const { mutate, isPending } = useMutation({
    mutationFn: () => fetchEmployees(0, 100000),
    onSuccess(data: any) {
      if (data?.status === "error") {
        toast.error(data?.message ?? "Something went wrong!");
        return;
      }

      const doc = new jsPDF("landscape");
      doc.text("Employees List", 14, 15);

      if (!data?.employeeList || data.employeeList.length === 0) {
        toast.error("No data available to export");
        return;
      }

      const firstItem = data.employeeList[0];
      let head = [];
      let body = [];

      // Check if it's the specific salary response the user provided, or standard employee response
      if (firstItem.fullName && firstItem.internalDept) {
        // Salary / New Response Format
        head = [["Sl.No", "Employee ID", "Name", "Designation", "Department", "Basic Pay", "Total Salary", "Net Amount", "Status"]];
        body = data.employeeList.map((emp: any, index: number) => [
          index + 1,
          emp.employeeId,
          emp.fullName,
          emp.designationName,
          emp.internalDept,
          emp.basicPay ?? "N/A",
          emp.totalSalary ?? "N/A",
          emp.netAmount ?? "N/A",
          emp.salaryStatus ?? "N/A"
        ]);
      } else if (firstItem.firstName !== undefined) {
        // Standard Employee Response Format
        head = [["Sl.No", "Employee ID", "Name", "Designation", "Email", "Phone Number", "Location", "Joining Date"]];
        body = data.employeeList.map((emp: any, index: number) => [
          index + 1,
          emp.employeeId,
          `${emp.firstName} ${emp.lastName}`,
          emp.designation,
          emp.emailId,
          emp.phoneNumber,
          emp.locationName,
          emp.joiningDate
        ]);
      } else {
        // Generic fallback for any other structure: Export all response keys
        const keys = Object.keys(firstItem);
        head = [["Sl.No", ...keys]];
        body = data.employeeList.map((emp: any, index: number) => {
          return [index + 1, ...keys.map(k => emp[k] !== null && emp[k] !== undefined ? String(emp[k]) : "N/A")];
        });
      }

      autoTable(doc, {
        head: head,
        body: body,
        startY: 20,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185] }
      });

      const finalY = (doc as any).lastAutoTable.finalY || 40;
      doc.setFontSize(10);
      doc.text("Mission Director", 250, finalY + 20, { align: "center" });
      doc.text("Assam Skill Development Mission", 250, finalY + 25, { align: "center" });
      doc.text("Katabari (Assam), GHY-35", 250, finalY + 30, { align: "center" });

      doc.save("Employees_List.pdf");
      toast.success("Exported to PDF successfully");
    },
    onError(error: any) {
      toast.error(error.message ?? "Something went wrong!");
    },
  });

  return {
    exportEmployeesData: mutate,
    isPending,
  };
}

export function useExportStaffList(data: any, param: string) {
  if (!data || data.length === 0) {
    toast.error("No data to export");
    return;
  }

  const doc = new jsPDF("landscape");
  doc.text(`Staff ${param} List`, 14, 15);

  const head = [["Sl.No", "Name", "Employee ID", "Phone Number", "Department Name", "Designation", "Punch In", "Punch Out", "Location"]];
  const body = data.map((emp: any, index: number) => {
    const punchInFormatted = emp.punchIn
      ? `${moment.utc(emp.punchIn).format("DD/MM/YYYY hh:mm A")} (${emp.punchInOutdoor === 1 ? "Indoor" : "Outdoor"})`
      : "N/A";
    const punchOutFormatted = emp.punchOut ? moment.utc(emp.punchOut).format("DD/MM/YYYY hh:mm A") : "N/A";

    return [
      index + 1,
      `${emp.firstName} ${emp.lastName}`,
      emp.empId,
      emp.phone,
      emp.departmentName,
      emp.designation,
      punchInFormatted,
      punchOutFormatted,
      emp.location ?? "N/A"
    ];
  });

  autoTable(doc, {
    head: head,
    body: body,
    startY: 20,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] }
  });

  const finalY = (doc as any).lastAutoTable.finalY || 40;
  doc.setFontSize(10);
  doc.text("Mission Director", 250, finalY + 20, { align: "center" });
  doc.text("Assam Skill Development Mission", 250, finalY + 25, { align: "center" });
  doc.text("Katabari (Assam), GHY-35", 250, finalY + 30, { align: "center" });

  doc.save(`Staff_${param}_List.pdf`);
}
