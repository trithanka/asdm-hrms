import API, { IStatus } from "..";
import {
  FetchDepartmentDataParam,
  IAttendaceRateDepartmentWiseData,
  IDashboardData,
  IDepartment,
} from "./dashboar-types";

export async function fetchDashboard(): Promise<IDashboardData> {
  const response = await API.post("Dashboard/get");
  return response.data;
}

export async function fetchEmployeesCount(): Promise<{
  departmentWiseCount: [];
  designationWiseCount: IDepartment[];
  status: IStatus;
  message?: string;
}> {
  const response = await API.post("Dashboard/get/employeeGroup");
  return response.data;
}

export async function fetchMonthlyAttendance(month: number): Promise<{
  data: any[];
  status: IStatus;
  message?: string;
}> {
  const response = await API.post("Dashboard/get/attendanceChart", { month });
  return response.data;
}

export async function fetchAttendanceRateDepartmentWise(): Promise<IAttendaceRateDepartmentWiseData> {
  const response = await API.post("Dashboard/get/attendanceRateDepartmentWise");
  return response.data;
}

export async function fetchDepartmentData({postParam}:FetchDepartmentDataParam){
  const response = await API.post("Dashboard/employerdata",{postParam});
  return response.data;
}

export async function fetchEmployeeActivity(activity:string){
  const response = await API.post("Dashboard/leave/activities",{staff:activity});
  return response.data;
}