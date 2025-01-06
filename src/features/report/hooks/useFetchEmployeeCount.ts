import { useQuery } from "@tanstack/react-query";
import React from "react";
import QUERY_KEYS from "../../../data/queryKeys";
import { fetchEmployeesCount } from "../../../api/dashboard/dashboard-api";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import {
  emloyeeAttendanceData,
  employeeDeatils,
  employeeLeaveReport,
} from "../../../api/employee/employee-api";
import { formatDate } from "../../../utils/formatter";
import moment from "moment";

export function useFetchEmployeeCount() {
  const query = useQuery({
    queryKey: [QUERY_KEYS.EMPLOYEE_COUNT],
    queryFn: fetchEmployeesCount,
    meta: {
      errorMessage: "Failed to fetch dashboard data",
    },
  });

  React.useEffect(() => {
    if (query?.isSuccess) {
      if (query?.data?.status !== "success" && query?.data?.status) {
        toast?.error(query?.data?.message ?? "Something went wrong!");
      }
    }
  }, [query.isSuccess]);

  return query;
}
export async function useExportEmployeeData(
  bReleased: any,
  designation: string,
  locationName: string
) {
  const response = await employeeDeatils(bReleased, designation, locationName);

  const rows = response.employeeList?.map((emp: any, index: any) => ({
    id: index + 1,
    empId: emp.employeeId,
    name: `${emp.firstName} ${emp.lastName}`,
    designation: emp.designation,
    phoneNo: emp.phoneNumber,
    location: emp.locationName,
    joiningDate: emp.joiningDate,
  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, "employees");
  XLSX.utils.sheet_add_aoa(worksheet, [
    [
      "Sl.No",
      "Employee ID",
      "Name",
      "Designation",
      "Phone Number",
      "Location",
      "Joining Date",
    ],
  ]);

  XLSX.writeFile(workbook, "Total Employees.xlsx", { compression: true });
}

export async function useAttendanceData(
  staff: any,
  startDate: any,
  endDate: any,
  dataById?: any,
  type?: boolean
) {
  let rows: any[] = [];

  if (type !== true) {
    const response = await emloyeeAttendanceData(staff, startDate, endDate);
    rows = response?.data?.map((emp: any, index: any) => {
      const punchInFormatted = emp.punchIn
        ? `${moment.utc(emp.punchIn).format("DD/MM/YYYY hh:mm A")} (${
            emp.punchInOutdoor === 1 ? "Indoor" : "Outdoor"
          })`
        : "N/A";

      const punchOutFormatted = emp.punchOut
        ? `${moment.utc(emp.punchOut).format("DD/MM/YYYY hh:mm A")} (${
            emp.punchOutOutdoor === 1 ? "Indoor" : "Outdoor"
          })`
        : "N/A";

      return {
        id: index + 1,
        empId: emp.empId,
        name: `${emp.firstName} ${emp.middleName} ${emp.lastName}`,
        designation: emp.designation,
        phoneNo: emp.phone,
        department: emp.departmentName,
        punchIn: punchInFormatted,
        punchOut: punchOutFormatted,
        location: emp.location,
      };
    });
  } else {
    rows = dataById?.data?.map((emp: any, index: number) => {
      const punchInFormatted = emp.punchIn
        ? `${moment.utc(emp.punchIn).format("hh:mm A")} (${
            emp.punchInOutdoor === 1 ? "Indoor" : "Outdoor"
          })`
        : "-- --";

      const punchOutFormatted = emp.punchOut
        ? `${moment.utc(emp.punchOut).format("hh:mm A")} (${
            emp.punchOutOutdoor === 1 ? "Indoor" : "Outdoor"
          })`
        : "-- --";
      return {
        id: index + 1,
        empId: emp.empId,
        name: emp.empName,
        attendance_date: formatDate(emp.attendanceDate),
        punchInTime: emp.punchIn === null ? "-- --" : punchInFormatted,
        PunchOutTime: emp.punchOut === null ? "-- --" : punchOutFormatted,
        attendance_status:
          emp.punchOutOutdoor === 1 || emp.punchOutdoor === 0
            ? "Present"
            : "Absent",
      };
    });
  }
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, "employees");
  if (type !== true) {
    XLSX.utils.sheet_add_aoa(worksheet, [
      [
        "Sl.No",
        "Employee ID",
        "Name",
        "Designation",
        "Phone Number",
        "Department",
        "Punch In",
        "Punch Out",
        "Location",
      ],
    ]);
  } else {
    XLSX.utils.sheet_add_aoa(worksheet, [
      [
        "Sl.No",
        "Employee Id",
        "Name",
        "Attendance Date",
        "Punch In Time",
        "Punch Out Time",
        "Attendance Status",
      ],
    ]);
  }
  XLSX.writeFile(workbook, "Attendace-Report.xlsx", { compression: true });
}

export async function useLeaveReport(
  type: string,
  startDate: any,
  endDate: any
) {
  const response = await employeeLeaveReport(type, startDate, endDate);

  console.log(response?.data);

  const rows = response?.data?.map((emp: any, index: number) => ({
    id: index + 1,
    empId: emp.empName,
    name: emp.name,
    designation: emp.designation,
    type: emp.type,
    appliedDate: emp.appliedDate,
    startDate: emp.startDate,
    endDate: emp.endDate,
    reason: emp.reason,
    location: emp.location,
    lastCLDate: emp.lastCLDate,
    lastMLDate: emp.lastMLDate,
    clLeaveBalance: emp.clLeaveBalance,
    mlLeaveBalance: emp.mlLeaveBalance,
  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, "employee");
  XLSX.utils.sheet_add_aoa(worksheet, [
    [
      "Sl.No",
      "Employee Id",
      "Name",
      "Designation",
      "Type of Leave",
      "Applied Date",
      "Start Date",
      "End Date",
      "Reason",
      "Location",
      "Last CL Date",
      "Last ML Date",
      "Cl Leave Balance",
      "Ml Leave Balance",
    ],
  ]);
  XLSX.writeFile(workbook, "Leave-Report.xlsx", { compression: true });
}
