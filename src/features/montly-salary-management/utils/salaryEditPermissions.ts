/**
 * Salary field edit permission utility.
 *
 * Rules:
 * - stepTrack 3 or 4 → NOTHING is editable for ANY role
 * - Role 98 (e.g. Level-1 approver): editable when stepTrack is null or 1
 * - Role 36 (e.g. Level-2 approver): editable ONLY when stepTrack === 2
 * - otherDeduction: role 98 editable when stepTrack null/1; role 36 editable when stepTrack 2
 * - incomeTax: NEVER editable
 */

export type FieldName = "incomeTax" | "otherDeduction" | "general";

export interface SalaryEditPermissions {
  /** Whether general fields (attendance, lwp, arrear, basicPay, comment) are editable */
  isEditable: boolean;
  /** Income Tax is NEVER editable */
  isIncomeTaxEditable: false;
  /** Other Deduction: role 98 → stepTrack null/1; role 36 → stepTrack 2 */
  isOtherDeductionEditable: boolean;
}

/**
 * Returns the full set of edit permissions for the salary sheet
 * based on the current user's role and the salary track step.
 */
export function getSalaryEditPermissions(
  roleId: number,
  stepTrack: number | null
): SalaryEditPermissions {
  // Global lock: stepTrack 3 or 4 → nothing editable
  if (stepTrack === 3 || stepTrack === 4) {
    return {
      isEditable: false,
      isIncomeTaxEditable: false,
      isOtherDeductionEditable: false,
    };
  }

  // Income Tax is permanently read-only
  const isIncomeTaxEditable = false as const;

  // Other Deduction: role-specific stepTrack rules
  // Role 98 → editable when stepTrack is null or 1
  // Role 36 → editable ONLY when stepTrack === 2
  const isOtherDeductionEditable =
    (roleId === 98 && (stepTrack === null || stepTrack === 1)) ||
    (roleId === 36 && stepTrack === 2);

  // Role 98: general fields editable on null or 1
  if (roleId === 98) {
    const isEditable = stepTrack === null || stepTrack === 1;
    return { isEditable, isIncomeTaxEditable, isOtherDeductionEditable };
  }

  // Role 36: general fields editable ONLY on stepTrack === 2
  if (roleId === 36) {
    const isEditable = stepTrack === 2;
    return { isEditable, isIncomeTaxEditable, isOtherDeductionEditable };
  }

  // All other roles: read-only
  return {
    isEditable: false,
    isIncomeTaxEditable,
    isOtherDeductionEditable: false,
  };
}

/**
 * Helper: check if a specific named field is editable.
 *
 * @param fieldName - "incomeTax" | "otherDeduction" | "general"
 * @param roleId    - the current user's role ID
 * @param stepTrack - the current salary processing step (null if not yet started)
 * @returns true if the field is editable
 */
export function canEditField(
  fieldName: FieldName,
  roleId: number,
  stepTrack: number | null
): boolean {
  const permissions = getSalaryEditPermissions(roleId, stepTrack);

  switch (fieldName) {
    case "incomeTax":
      return permissions.isIncomeTaxEditable;
    case "otherDeduction":
      return permissions.isOtherDeductionEditable;
    case "general":
      return permissions.isEditable;
    default:
      return false;
  }
}
