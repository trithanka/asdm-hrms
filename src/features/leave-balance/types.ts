export type LeaveBalanceRow = {
  id: string;
  name: string;
  designation: string;
  mobile: string;
  gender: string;
  casualLeave: string;
  medicalLeave: string;
  restrictedLeave: string;
  maternityLeave: string;
  paternityLeave: string;
  yearEnd: string;
};

export type LeaveFieldKey =
  | "casualLeave"
  | "medicalLeave"
  | "restrictedLeave"
  | "maternityLeave"
  | "paternityLeave"
  | "yearEnd";

export type LeaveFieldErrors = Record<string, Partial<Record<LeaveFieldKey, string>>>;

export type EmployeeResponseItem = {
  id: number;
  full_name: string;
  vsGenderName: string;
  vsPhoneNumber: string;
  designationName: string;
  desCategoryName: string;
  casual?: number | null;
  madical?: number | null;
  Paternity?: number | null;
  maternity?: number | null;
  restricted?: number | null;
  unpaid?: number | null;
  vsYear?: string | null;
};

export type EmployeeListResponse = {
  status: string;
  message: string;
  statusCode: number;
  data: EmployeeResponseItem[];
  total?: number;
};

export type MasterYearItem = {
  pklYearId: number;
  vsYear: string;
};

export type MasterDesignationItem = {
  pklDesignationId: number;
  vsDesignationName: string;
  fklDesignationCategoryId: number | null;
};

export type MasterDataResponse = {
  status: string;
  message: string;
  statusCode: number;
  data: {
    year: MasterYearItem[];
    designation: MasterDesignationItem[];
  };
};

export type LeavePayloadItem = {
  employeeId: number;
  casualLeave: number;
  sickLeave: number;
  parentialLeave: number;
  maternityLeave: number;
  restrictedLeave: number;
  yearEnd: number;
};
