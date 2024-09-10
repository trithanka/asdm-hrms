export type AddEmployeeFormValues = {
  firstName: string;
  middleName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  phoneNumber: string;
  altPhoneNumber: string;
  gender: string;
  email: string;
  dob: string;
  maritalStatus:string

  uuid: string;
  idType: number;

  relationship: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  emergencyHomeAddress: string;
  emergencyOfficeAddress: string;

  addressLine1: string;
  addressLine2: string;
  city: string;
  district: string;
  pin: number;

  addressLine1Permanent: string;
  addressLine2Permanent: string;
  cityPermanent: string;
  districtPermanent: string;
  pinPermanent: number;

  designation: string;
  dateOfJoining: string;
  department: string;
  supervisorId1 :string;
  supervisorId2:string;
  qualification: string;
  working_locations: string;

  blood: string;
  religion: string;
  caste: string;
  bank: string;
  accountNumber: number;
  ifsc: string;
  branch: string;
};

export type EditEmployeeFormValues = {
  designation: string;
  idType: number;
  
};
