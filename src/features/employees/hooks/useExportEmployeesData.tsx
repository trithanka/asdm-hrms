import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { fetchEmployees } from "../../../api/employee/employee-api";
import * as XLSX from "xlsx";
import moment from "moment";
// import { fetchEmployeeActivity } from "../../../api/dashboard/dashboard-api";

export function useExportEmployeeList() {

  const { mutate, isPending } = useMutation({
    mutationFn: fetchEmployees,
    onSuccess(data) {
      if (data?.status === "error") {
        toast.error(data?.message ?? "Something went wrong!");
        return;
      }


      const rows = data.employeeList?.map((emp, index) => ({
        id: index + 1,
        empId: emp.employeeId,
        name: `${emp.firstName} ${emp.lastName}`,
        designation: emp.designation,
        email: emp.emailId,
        phoneNo: emp.phoneNumber,
        location: emp.locationName,
        joiningDate: emp.joiningDate
      }));

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(rows);

      XLSX.utils.book_append_sheet(workbook, worksheet, "employees");

      XLSX.utils.sheet_add_aoa(worksheet, [
        ["Sl.No", "Employee ID", "Name", "Designation", "Email", "Phone Number", "Location", "Joining Date"],
      ]);

      XLSX.writeFile(workbook, "Total Employees as on Date.xlsx", { compression: true });
    },
    onError(error) {
      toast.error(error.message ?? "Something went wrong!");
    },
  });

  return {
    exportEmployeesData: mutate,
    isPending,
  };
}

export function useExportStaffList(data: any, param: string) {

  const rows = data?.map((emp: any, index: number) => {


    const punchInFormatted = emp.punchIn
      ? `${moment.utc(emp.punchIn).format("DD/MM/YYYY hh:mm A")} (${emp.punchInOutdoor === 1 ? "Indoor" : "Outdoor"})`
      : null;

    const punchOutFormatted = emp.punchOut ? moment.utc(emp.punchOut).format("DD/MM/YYYY hh:mm A") : "N/A";

    return {
      id: index + 1,
      name: `${emp.firstName} ${emp.lastName}`,
      empId: emp.empId,
      phoneNo: emp.phone,
      departmentName: emp.departmentName,
      designation: emp.designation,
      punchIn: punchInFormatted,
      punchOut: punchOutFormatted,
      location:emp.location,
    };
  });

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);

  XLSX.utils.book_append_sheet(workbook, worksheet, "employees");

  XLSX.utils.sheet_add_aoa(worksheet, [
    ["Sl.No", "Name", "Employee ID", "Phone Number", "Department Name","Designation","Punch In", "Punch Out","Location"],
  ]);

  XLSX.writeFile(workbook, `Staff ${param} list.xlsx`, { compression: true });
  //   },
  //   onError(error) {
  //     toast.error(error.message ?? "Something went wrong!");
  //   },
  // });

  // return {
  //   exportLeaveEmployeesData: mutate,
  //   isPending,
  // };
}
