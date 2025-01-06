import API, { IStatus } from "..";
import { AddEmployeeFormValues } from "../../features/employees/utils/types";
import { ILeaveSingle } from "../leave/leave-types";
import { ILocation } from "../location/location-types";
import {
  IAttendance,
  IDevice,
  IEmployee,
  IEmployeeLocation,
  IEmployeeSingle,
  IFilterData,
} from "./employee-types";

export async function fetchEmployees(): Promise<{
  employeeList: IEmployee[];
  status: IStatus;
  message?: string;
}> {
  const response = await API.post("EmployeeManagement/get");
  return response.data;
}

export async function fetchDevices(id?: number): Promise<{
  deviceList: IDevice[];
  status: IStatus;
}> {
  if (id !== undefined) {
    const response = await API.post("EmployeeManagement/device/get", { id });
    return response.data;
  } else {
    const response = await API.post("EmployeeManagement/device/getAll");
    return response.data;
  }
}

export async function enableDevice({
  id,
  empCode,
}: {
  id: number;
  empCode: number;
}) {
  const response = await API.post("EmployeeManagement/device/update", {
    id,
    empCode,
  });
  return response.data;
}

export async function fetchAttendance(
  empId: string,
  month: number,
  year: string
): Promise<{
  attendanceList: IAttendance[];
  yearList: number[];
  status: IStatus;
}> {
  const response = await API.post("EmployeeManagement/attendance/get", {
    id: empId,
    month,
    year,
  });
  return response.data;
}

export async function postReleseEmployee(postData: {
  id: number;
  reason: string;
  release_date: string;
}) {
  const response = await API.post(
    "EmployeeManagement/release/releaseEmployee",
    postData
  );
  return response.data;
}

interface IParentalLeaveSingle extends ILeaveSingle {
  startDate: string;
  endDate: string;
}

export async function fetchEmployeeLeaves(id: number): Promise<{
  status: IStatus;
  leaveList: ILeaveSingle[];
  parentalLeaveList: IParentalLeaveSingle[];
  employeeListSingle: IEmployeeSingle;
  message?: string;
}> {
  const response = await API.post("EmployeeManagement/leave/get", {
    id,
  });
  return response.data;
}

export async function fetchEmployeeLocation(id: number): Promise<{
  locationHistory: IEmployeeLocation[];
  locationActive: ILocation;
  status: IStatus;
  message?: string;
}> {
  const response = await API.post("EmployeeManagement/location/history", {
    id,
  });
  return response.data;
}

export async function fetchFilters(): Promise<IFilterData> {
  const response = await API.post("EmployeeManagement/master");
  return response.data;
}

export async function addEmployee(data: AddEmployeeFormValues) {
  const response = await API.post("EmployeeManagement/add", data);
  return response.data;
}

export async function editEmployee(data: any) {
  const response = await API.post("EmployeeManagement/update", data);
  return response.data;
}

export async function getEmployeeById(empId: string) {
  const response = await API.post("/EmployeeManagement/getById", {
    postParam: {
      empId,
    },
  });
  return response.data;
}

export async function employeeDeatils(
  bReleased: any,
  designation: string,
  locationName: string
) {
  const response = await API.post("EmployeeManagement/getReport", {
    postParam: {
      bReleased,
      designation,
      locationName,
    },
  });
  return response.data;
}

export async function emloyeeAttendanceData(
  staff: any,
  startDate: any,
  endDate: any
) {
  const response = await API.post("Dashboard/leave/activities", {
    staff: staff,
    startDate: startDate,
    endDate: endDate,
  });
  return response.data;
}

export async function employeeLeaveReport(
  type: string,
  startDate: any,
  endDate: any
) {
  const response = await API.post(`LeaveApproval/leaveList/${type}`, {
    startDate: startDate,
    endDate: endDate,
  });
  return response.data;
}
