import { IStatus } from "..";

export interface IEmployee {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  emailId: string;
  designation: string;
  employeeId: string;
  locationName: string;
  joiningDate: string;
  status: "Active" | "Inactive";
}

export interface IDevice {
  deviceName: string;
  name: string;
  empCode: number;
  empId: string;
  empName: string;
  designation: string;
  date: string;
  id: number;
  uuid: string;
  status: 0 | 1;
}

export interface IAttendance {
  attendanceMarkerIn: string;
  attendanceMarkerOut: string;
  date: string;
  inTime: string;
  outTime: string;
}

export interface IEmployeeSingle {
  casualLeaves: number;
  designation: string;
  emailId: string;
  employeeId: string;
  firstName: string;
  id: number;
  lastName: string;
  medicalLeaves: number;
  middleName: string;
  parentalLeave: number;
  phoneNumber: string;
  status: string;
}

export interface IEmployeeLocation {
  date: string;
  name: string;
}

interface IDistrict {
  districtId: number;
  districtName: string;
}

interface IGender {
  genderId: number;
  genderName: string;
}

interface ICaste {
  casteId: number;
  casteName: string;
}

interface IBlood {
  bloodId: number;
  bloodName: string;
}

interface IReligion {
  religionId: number;
  religionName: string;
}

interface IState {
  stateId: 4;
  stateName: "Assam";
}

interface IRelationship {
  relationshipId: number;
  relationshipName: string;
}

interface IQualification {
  qualificationId: number;
  qualificationName: string;
}

interface IDepartment {
  internalDepartmentId: number;
  internalDepartmentName: string;
}

interface IDesignation {
  designationId: number;
  designationName: string;
}

interface IBank {
  bankId: number;
  bankName: string;
}

interface IIdType {
  value: number;
  label: string;
}
interface ICurrent_working_location {
  locationId: number;
  locationName: string;
}
interface ISupervisor {
  supervisorId: number;
  name: string;
}

export interface IFilterData {
  district: IDistrict[];
  gender: IGender[];
  caste: ICaste[];
  religion: IReligion[];
  blood: IBlood[];
  state: IState[];
  relationship: IRelationship[];
  qualification: IQualification[];
  location: ICurrent_working_location[];
  department: IDepartment[];
  designation: IDesignation[];
  supervisor: ISupervisor[];
  idType: IIdType[];
  marital: IIdType[];
  bank: IBank[];
  formDisabled: boolean;
  status: IStatus;
  message?: string;
}
