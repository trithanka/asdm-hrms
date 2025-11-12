import { IStatus } from "..";

export interface IJobPost {
  pklHrmsJobPostId: number;
  vsJobPostName: string;
  fklDepartmentId: number;
  fklDesignationId: number;
  fklQualificationId: number;
  bEnable: number;
  iMinimumYearExp: number;
  iNumberOfPost: number;
  iAgeLimit: number;
  vsJobDescription: string;
  dtApplicationStartDate: string;
  dtApplicationEndDate: string;
  fklModifiedByLoginId: number;
  vsInterviewType: string;
  dtInterviewAt: string;
  dtCreatedAt: string;
  dtUpdatedAt: string;
  vsDocPath: string[];
  vsJobLocation: string;
  vsJobAddress: string;
  vsDesignationName: string;
  vsQualification: string;
}

export interface IJobPostResponse {
  message: string | null;
  statusCode: number;
  status: string;
  data: IJobPost[];
}

export interface IJobPostFilters {
  search?: string;
  designation?: string;
  department?: string;
}

export interface IDesignation {
  designationId: number;
  designationName: string;
}

export interface IDepartment {
  internalDepartmentId: number;
  internalDepartmentName: string;
}

export interface IQualification {
  qualificationId: number;
  qualificationName: string;
}

export interface IDistrict {
  districtId: number;
  districtName: string;
}

export interface IRecruitmentMasterData {
  designation?: IDesignation[];
  department?: IDepartment[];
  qualification?: IQualification[];
  district?: IDistrict[];
  status: IStatus;
  message?: string;
}

export interface ICreateJobPost {
  vsJobPostName: string;
  department: number;
  designation: number;
  qualification?: number;
  minYearExp?: number;
  numberOfPost: number;
  ageLimit?: number;
  jobDescription?: string;
  applicationStartDate: string;
  applicationEndDate: string;
  interviewAt?: string;
  interviewDistrictId?: number;
  interviewAddress?: string;
}

export interface IApplicant {
  pklApplicationId: number;
  fklJobPostId: number;
  vsName: string;
  vsEmail: string;
  vsMobile: string;
  vsAddress: string;
  fklQualificationId: number;
  iExperienceYears: number;
  vsDocPath: string;
  vsCoverLetter: string;
  dtAppliedAt: string;
  vsApplicationStatus: string;
  dtCreatedAt: string;
  dtUpdatedAt: string;
  vsJobPostName: string;
  vsDesignationName: string;
  departName: string;
}

export interface IApplicantResponse {
  message: string | null;
  statusCode: number;
  status: string;
  data: IApplicant[];
}

