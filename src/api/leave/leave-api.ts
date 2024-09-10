import API from "..";
import {
  ILeaveApplicationParam,
  ILeaveApproveParam,
  ITempLeaveApproveParam,
  LeaveDetailData,
  LeaveType,
} from "./leave-types";

export async function fetchLeaves(type: LeaveType) {
  const response = await API.post(`LeaveApproval/leaveList/${type}`);
  return response.data;
}

export async function fetchLeaveDetail(
  id: string | number,
  type: "CL" | "ML" | "PL",
  tab: "pending" | "approved" | "reject",
  empCode?: any,
  appliedDate?: string
): Promise<LeaveDetailData> {
  const requestData: any = {
    applicationId: id,
    type: tab,
  };

  if (tab === "approved" && empCode && appliedDate) {
    Object.assign(requestData, {
      type: "approved",
      empCode,
      appliedDate,
    });
  }
  const response = await API.post(
    type === "PL"
      ? "LeaveApproval/leavedetails/parental"
      : "LeaveApproval/leave/detail",
    requestData
  );

  return response.data;
}

export async function leaveApprove({
  id,
  type,
  employeeId,
  reason,
  file,
}: ILeaveApproveParam) {
  const formData = new FormData();

  formData.append("employeeId", employeeId.toString());
  formData.append("id", id.toString());
  formData.append("type", type);
  formData.append("reason", reason || "");
  formData.append("file", file || "");

  const response = await API.post("LeaveApproval/submitApprove", formData, {
    headers: {
      "Content-Type": "multipart/form-data;",
    },
  });
  return response.data;
}

export async function leaveTApprove({
  id,
  Tapprove,
  type,
}: ITempLeaveApproveParam) {
  const response = await API.post("LeaveApproval/tempApprove", {
    id,
    Tapprove,
    type,
  });
  return response.data;
}

export async function exportPendingLeave() {
  const response = await API.post("LeaveApproval/pendingLeaveExport");
  return response.data;
}

export async function leaveApplicationDetails(
  id: ILeaveApplicationParam
): Promise<any> {
  const response = await API.post("LeaveApproval/pdfData", {
    applicationId: id,
  });
  return response.data;
}
