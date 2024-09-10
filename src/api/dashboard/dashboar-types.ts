import { IStatus } from "..";
import { TLeaveType } from "../leave/leave-types";

export interface IAttendanceData {
  count: number;
  date: string;
}

export interface IDepartment {
  departmentId: any;
  designationName: string;
  department: string;
  count: number;
}

export interface IHoliday {
  leaveDate: string;
  leaveName: string;
  id: number;
}

export interface ILeaveReason {
  count: 1;
  reason: string;
  release_date: string;
}

export interface IDashboardData {
  leaveCommonReason: ILeaveReason[];
  absentToday: number;
  employeeCount: number;
  leaveRequestPending: number;
  leaveRequestDecided: number;
  leaveRequestRejected: number;
  leaveRequestApproved: number;
  genderWise: {
    gender: string;
    count: number;
  }[];
  ageWise: {
    age: 1;
    count: 1;
  }[];
  leaveTodayCount: number;
  qualificationWise: number;
  presentToday: number;
  departmentGenderWise: {
    department: string;
    gender: string;
    count: number;
  }[];
  districtWise: {
    districtName: string;
    count: number;
  }[];
  holidays: IHoliday[];
  attendanceChart: {
    date: "2023-11-20";
    count: 1;
  }[];
  leavesToday: [];
  status: IStatus;
  message?: string;
  activeStatusCount:string
  regignationCount:string
}

interface IDepartmentWiseLeave {
  department: "MIS";
  type: "CL";
  count: 11;
}

export interface IAttendaceRateDepartmentWiseData {
  departmentWiseLeave: IDepartmentWiseLeave[];
  internalDepartment: {
    department: "Finance";
  }[];
  type: TLeaveType[];
  status: IStatus;
  message?: string;
}

export interface FetchDepartmentDataParam {
  postParam:{
    departmentId?:string | null | undefined,
    designationId?:string | null | undefined
  }
}