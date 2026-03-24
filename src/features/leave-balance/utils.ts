import { EmployeeResponseItem, LeaveBalanceRow, MasterYearItem } from "./types";

export const toInputValue = (value: number | null | undefined): string =>
  value === null || value === undefined ? "" : String(value);

export const toNumber = (value: string) => {
  if (!value.trim()) return 0;
  const parsedValue = Number(value);
  return Number.isNaN(parsedValue) ? 0 : parsedValue;
};

export const isMale = (gender: string) => gender.trim().toLowerCase() === "male";
export const isFemale = (gender: string) => gender.trim().toLowerCase() === "female";

export function mapEmployeeToLeaveRow(
  employee: EmployeeResponseItem,
  yearList: MasterYearItem[]
): LeaveBalanceRow {
  const mappedYearId = yearList.find((year) => year.vsYear === employee.vsYear)?.pklYearId;

  return {
    id: String(employee.id),
    name: employee.full_name,
    designation: employee.designationName,
    mobile: employee.vsPhoneNumber,
    gender: employee.vsGenderName,
    casualLeave: toInputValue(employee.casual),
    medicalLeave: toInputValue(employee.madical),
    restrictedLeave: toInputValue(employee.restricted),
    maternityLeave: toInputValue(employee.maternity),
    paternityLeave: toInputValue(employee.Paternity),
    yearEnd: mappedYearId ? String(mappedYearId) : (employee.vsYear ?? ""),
  };
}
