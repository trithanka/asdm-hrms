import * as yup from "yup";
import { AddEmployeeFormValues } from "./types";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const addEmployeeFormSchema: yup.ObjectSchema<AddEmployeeFormValues> | any =
  yup
    .object({
      firstName: yup.string().required("First Name is required"),
      middleName: yup.string().optional(),
      lastName: yup.string().required("Last Name is required"),
      fatherName: yup.string().required("Father Name is required"),
      motherName: yup.string().required("Mother Name is required"),
      phoneNumber: yup
        .string()
        .required("required")
        .matches(phoneRegExp, "Phone number is not valid")
        .min(10, "too short")
        .max(10, "too long"),
      altPhoneNumber: yup
        .string()
        .matches(phoneRegExp, "Phone number is not valid")
        .min(10, "too short")
        .max(10, "too long"),
      gender: yup.string().required("Gender is required"),
      dob: yup.string().required("Date of Birth is required"),
      email: yup.string().email().required("Email is required"),

      uuid: yup.string().required("ID number is required"),
      idType: yup
        .number()
        .required("ID is required")
        .typeError("Invalid  Number"),
      maritalStatus: yup
        .number()
        .required("Marital Status is required")
        .typeError("Invalid ID"),

      relationship: yup.string().required("Relationship is required"),
      emergencyContactName: yup
        .string()
        .required("Emergency Name is required")
        .typeError("Please eneter a valid contact name"),
      emergencyContactNumber: yup
        .string()
        .required("Phone Number is required")
        .matches(phoneRegExp, "Phone number is not valid")
        .min(10, "too short")
        .max(10, "too long"),
      emergencyHomeAddress: yup.string().required("Home Address is required").min(50,"Home address cannot be less than 50 character"),
      emergencyOfficeAddress: yup
        .string().optional(),

      addressLine1: yup.string().required("Address Line is required"),
      addressLine2: yup.string(),
      city: yup.string().required("City Name is required"),
      district: yup.string().required("District Name is required"),
      pin: yup.number().required("Pin Number is required"),

      addressLine1Permanent: yup.string(),
      addressLine2Permanent: yup.string(),
      cityPermanent: yup.string(),
      districtPermanent: yup.string(),
      pinPermanent: yup.number(),

      designation: yup.string().required("Designation is required"),
      dateOfJoining: yup.string().required("Date is required"),

      department: yup.string().required("Department is required"),
      supervisorId1: yup.string().required("Supervisor is required"),
      qualification: yup.string().required("Qualification is required"),

      blood: yup.string().required("Blood group is required"),
      religion: yup.string().required("Religion is required"),
      caste: yup.string().required("Caste is required"),
      bank: yup.string().required("Bank Name is required"),
      accountNumber: yup
        .number()
        .required("Account number is required")
        .typeError("Invalid Account Number"),
      ifsc: yup.string().required("IFSC Code is required"),
      branch: yup.string().required("Branch Name is required"),
    })
    .required();
    addEmployeeFormSchema