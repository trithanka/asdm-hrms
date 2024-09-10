export type TLeaveType = "CL" | "ML" | "PL";

export interface ILeave {
  name: string;
  designation: string;
  applicationId: number;
  empCode: number;
  appliedDate: string;
  leaveDuration: number;
  startDate: string;
  endDate: string;
  reason: string;
  leaveDate: string;
  supporting: string;
  type: "CL" | "ML" | "PL";
}

export type LeaveType = "pending" | "approved" | "rejected";

export interface LeaveDetailData {
  data: {
    id: number;
    approval: number;
    appliedDate: string;
    duration: number;
    reason: string;
    leaveDate: string;
    leaveType: "CL" | "ML" | "PL";
    pending: number;
    employeeId: number;
    name: string;
    phoneNumber: string;
    email: string;
    parentalLeave: number;
    sickLeave: number;
    casualLeave: string;
    tempApproval: number;
  };
  leaveHistory: {
    type: string;
    startDate: string;
    endDate: string;
    applicationId: 16;
    leaveDate: "16-10-2023";
    leaveType: "ML";
    status: "Rejected";
  }[];
  message: "success" | "error";
}

export interface ILeaveApproveParam {
  id: string | number;
  type: "CL" | "ML" | "PL";
  employeeId: number;
  reason: string | null;
  file?: File | null;
}

export interface ITempLeaveApproveParam {
  id: string | number; // Leave application ID
  type: "CL" | "ML" | "PL";
  Tapprove: 1 | 0; // Approval status: 1 for approve, 0 for reject
  reason: string | null;
}

export interface ILeaveSingle {
  leaveDate: string;
  leaveType: "CL" | "ML" | "PL";
  reason: string;
  status: string;
}

export interface ILeaveApplicationParam {
  id: number;
}
