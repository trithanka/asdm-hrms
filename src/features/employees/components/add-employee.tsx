import * as React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { addEmployee } from "../../../api/employee/employee-api";
import Input from "../../../components/ui/input";
import Select from "../../../components/ui/select";
import useFilters from "../hooks/useFilters";
import { addEmployeeFormSchema } from "../utils/schemas";
import { AddEmployeeFormValues } from "../utils/types";
import DropdownTextfield from "./ui/dropdown-textfield";
import BackButton from "../../../components/backbutton";

export default function AddEmployee() {
  const [isChecked, setIsChecked] = React.useState(false);

  const {
    isLoading,
    genders,
    districts,
    designations,
    relationships,
    qualifications,
    current_working_location,
    departments,
    banks,
    bloodGroups,
    castes,
    religions,
    idTypes,
    maritalStatues,
    supervisor,
  } = useFilters();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddEmployeeFormValues>({
    resolver: yupResolver(addEmployeeFormSchema),
    defaultValues: {
      idType: 3,
    },
  });


  const navigate = useNavigate();

  const { mutate, isPending: mutating } = useMutation({


    mutationFn: addEmployee,
    onSuccess(data) {
      if (data?.status === "success") {
        toast.success("Added Successfully");

        navigate("/success", {
          state: { message: data?.message },
        });
      } else {
        toast.error(data?.message ?? "Something went wrong");
      }
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: AddEmployeeFormValues) => {
    mutate(data);
  };

  console.log(errors);


  const city = watch("city");
  const pin = watch("pin");
  const district = watch("district");
  const addressLine1 = watch("addressLine1");
  const addressLine2 = watch("addressLine2");



  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setValue("cityPermanent", city);
      setValue("pinPermanent", pin);
      setValue("districtPermanent", district);
      setValue("addressLine1Permanent", addressLine1);
      setValue("addressLine2Permanent", addressLine2);
    }
    setIsChecked(event.target.checked);
  };


  React.useEffect(() => {
    if (isChecked) {
      setValue("cityPermanent", city);
      setValue("pinPermanent", pin);
      setValue("districtPermanent", district);
      setValue("addressLine1Permanent", addressLine1);
      setValue("addressLine2Permanent", addressLine2);
    }
  }, [city, pin, district, addressLine1, addressLine2]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const todayDate = new Date().toISOString().split('T')[0];
  return (
    <>
      <Grid
        container
        spacing={ 2 }
        component="form"
        onSubmit={ handleSubmit(onSubmit) }
      >
        <BackButton />
        <Grid item xs={ 12 }>
          <Paper sx={ { px: 3, py: 2 } } variant="outlined">
            <Typography fontWeight={ 500 } fontSize={ 26 } textAlign={ "center" }>New Employee Registration Form</Typography>
            <Typography fontWeight={ 500 }>
              Profile Details{ " " }
              <span style={ { color: "gray" } }>
                (Fields with <span style={ { color: "red" } }>*</span> are
                Mandatory)
              </span>
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Complete all the basic details of the employee
            </Typography>

            <Grid container spacing={ 2 } sx={ { py: 3 } }>
              <Grid item xs={ 12 } md={ 3 }>
                <Input
                  control={ control }
                  label="First Name"
                  name="firstName"
                  placeholder="First name"
                  required
                />
              </Grid>
              <Grid item xs={ 12 } md={ 3 }>
                <Input
                  control={ control }
                  label="Middle Name"
                  name="middleName"
                  placeholder="Middle Name"
                />
              </Grid>
              <Grid item xs={ 12 } md={ 3 }>
                <Input
                  control={ control }
                  label="Last Name"
                  name="lastName"
                  required
                  placeholder="Last Name"
                />
              </Grid>

              <Grid item xs={ 12 } sm={ 6 } md={ 3 }>
                <Input
                  control={ control }
                  type="date"
                  label="Date of birth"
                  name="dob"
                  placeholder="DOB"
                  required
                  maxDate={ todayDate }
                />
              </Grid>

              <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
                <Input
                  control={ control }
                  label="Father's Name"
                  name="fatherName"
                  required
                  placeholder="Father Name"
                />
              </Grid>
              <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
                <Input
                  control={ control }
                  label="Mother's Name"
                  name="motherName"
                  required
                  placeholder="Mother's Name"
                />
              </Grid>

              <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
                <Input
                  control={ control }
                  type="number"
                  label="Mobile Number"
                  name="phoneNumber"
                  required
                  placeholder="Phone Number"
                />
              </Grid>

              <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
                <Input
                  control={ control }
                  type="number"
                  label="Alt Mobile Number"
                  name="altPhoneNumber"
                  placeholder="Alt. Phone Number"
                />
              </Grid>

              <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
                <Select
                  control={ control }
                  label="Gender"
                  name="gender"
                  options={ genders! }
                  required
                />
                { errors.gender?.message && (
                  <p className="error">{ errors.gender?.message }</p>
                ) }
              </Grid>

              <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
                <Input
                  control={ control }
                  type="text"
                  label="Email"
                  name="email"
                  placeholder="Email"
                  required
                />
              </Grid>

              <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
                <Select
                  control={ control }
                  label="Religion"
                  name="religion"
                  required
                  options={ religions! }
                />
                { errors.religion?.message && (
                  <p className="error">{ errors.religion?.message }</p>
                ) }
              </Grid>

              <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
                <Select
                  control={ control }
                  label="Blood Group"
                  name="blood"
                  required
                  options={ bloodGroups! }
                />
                { errors.blood?.message && (
                  <p className="error">{ errors.blood?.message }</p>
                ) }
              </Grid>

              <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
                <Select
                  control={ control }
                  label="Caste"
                  name="caste"
                  required
                  options={ castes! }
                />
                { errors.caste?.message && (
                  <p className="error">{ errors.caste?.message }</p>
                ) }
              </Grid>

              <Grid item xs={ 12 } md={ 6 }>
                <Select
                  control={ control }
                  label="Martial Status"
                  name="maritalStatus"
                  required
                  options={ maritalStatues! }
                />
                { errors.maritalStatus?.message && (
                  <p className="error">{ errors.maritalStatus?.message }</p>
                ) }
              </Grid>

              <Grid item xs={ 12 } md={ 6 }>
                <DropdownTextfield
                  options={ idTypes! }
                  control={ control }
                  label="Enter ID"
                  optionName="idType"
                  required
                  valueName="uuid"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        {/* Professional Information */ }
        <Grid item xs={ 12 }>
          <Paper sx={ { px: 3, py: 2 } } variant="outlined">
            <Typography fontWeight={ 500 }>Professional Information</Typography>{ " " }
            <Typography variant="body2" color="text.secondary" gutterBottom>
              This data will be used in office tasks.
            </Typography>
            <Grid container spacing={ 2 } sx={ { py: 3 } }>
              <Grid item xs={ 12 } sm={ 7 }>
                <Select
                  control={ control }
                  label="Designation"
                  name="designation"
                  required
                  options={ designations! }
                />
                { errors.designation?.message && (
                  <p className="error">{ errors.designation?.message }</p>
                ) }
              </Grid>

              <Grid item xs={ 12 } sm={ 5 }>
                <Select
                  control={ control }
                  label="Department"
                  required
                  name="department"
                  options={ departments! }
                />
                { errors.department?.message && (
                  <p className="error">{ errors.department?.message }</p>
                ) }
              </Grid>

              <Grid item xs={ 12 } sm={ 4 }>
                <Input
                  control={ control }
                  type="date"
                  name="dateOfJoining"
                  label="Joining Date"
                  placeholder="Joining Date"
                  required
                  maxDate={ todayDate }
                />
              </Grid>

              <Grid item xs={ 12 } sm={ 4 }>
                <Select
                  control={ control }
                  label="Supervisor 1"
                  required
                  name="supervisorId1"
                  options={ supervisor! }
                />
                { errors.supervisorId1?.message && (
                  <p className="error">{ errors.supervisorId1?.message }</p>
                ) }
              </Grid>
              <Grid item xs={ 12 } sm={ 4 }>
                <Select
                  control={ control }
                  label="Supervisor 2"
                  name="supervisorId2"
                  options={ supervisor! }
                />
              </Grid>

              <Grid item xs={ 12 } sm={ 4 }>
                <Select
                  control={ control }
                  label="Qualifications"
                  required
                  name="qualification"
                  options={ qualifications! }
                />
                { errors.qualification?.message && (
                  <p className="error">{ errors.qualification?.message }</p>
                ) }
              </Grid>

              <Grid item xs={ 12 } sm={ 4 }>
                <Select
                  control={ control }
                  label="Current Working Location"
                  required
                  name="locationId"
                  options={ current_working_location! }
                />
                { errors.working_locations?.message && (
                  <p className="error">{ errors.qualification?.message }</p>
                ) }
              </Grid>

              <Grid item xs={ 12 } sm={ 4 }>
                <Input
                  control={ control }
                  type="date"
                  name="currentLocationJoiningDate"
                  label="Current Location Joining Date"
                  placeholder="Current Location Joining Date"
                  required
                  maxDate={ todayDate }
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Correspondence Address */ }
        <Grid item xs={ 12 }>
          <Paper sx={ { px: 3, py: 2 } } variant="outlined">
            <Typography fontWeight={ 500 }>Correspondence Address</Typography>{ " " }
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Enter your present address.
            </Typography>
            <Grid container spacing={ 2 } sx={ { py: 3 } }>
              <Grid item xs={ 12 }>
                <Input
                  control={ control }
                  label="Address Line 1"
                  name="addressLine1"
                  required
                  placeholder="Address Line 1"
                />
              </Grid>

              <Grid item xs={ 12 }>
                <Input
                  control={ control }
                  label="Address Line 2"
                  name="addressLine2"
                  placeholder="Address Line 2"
                />
              </Grid>

              <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
                <Input
                  control={ control }
                  label="City/Village/Town"
                  name="city"
                  required
                  placeholder="City"
                />
              </Grid>

              <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
                <Select
                  control={ control }
                  label="District"
                  name="district"
                  required
                  options={ districts! }
                />
                { errors.district?.message && (
                  <p className="error">{ errors.district?.message }</p>
                ) }
              </Grid>
              <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
                <Input
                  control={ control }
                  label="Pin Code"
                  name="pin"
                  type="number"
                  inputLength={ 6 }
                  required
                  placeholder="Pincode"
                />
              </Grid>
            </Grid>


            {/* Permanent Address */ }
            <Typography pt={ 2 } fontWeight={ 500 }>Permanent Address</Typography>{ " " }
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Enter your permanent address.
            </Typography>
            <Grid container spacing={ 2 } sx={ { py: 3 } }>
              <Grid item xs={ 12 }>
                <FormControlLabel
                  control={
                    <Checkbox
                      value={ isChecked }
                      onChange={ handleCheckboxChange }
                    />
                  }
                  label="Same as Correspondence Address"
                />
              </Grid>

              <Grid item xs={ 12 }>
                <Input
                  control={ control }
                  label="Address Line 1"
                  name="addressLine1Permanent"
                  placeholder="Address Line 1"
                  required
                  disabled={ isChecked }
                />
              </Grid>

              <Grid item xs={ 12 }>
                <Input
                  control={ control }
                  label="Address Line 2"
                  name="addressLine2Permanent"
                  placeholder="Address Line 2"
                  disabled={ isChecked }
                />
              </Grid>

              <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
                <Input
                  control={ control }
                  label="City/Village/Town"
                  name="cityPermanent"
                  placeholder="Permenant City"
                  required
                  disabled={ isChecked }
                />
              </Grid>

              <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
                <Select
                  control={ control }
                  label="District"
                  name="districtPermanent"
                  required
                  options={ districts! }
                  disabled={ isChecked }
                />
                { errors.districtPermanent?.message && (
                  <p className="error">{ errors.districtPermanent?.message }</p>
                ) }
              </Grid>
              <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
                <Input
                  control={ control }
                  label="Pin Code"
                  required
                  type="number"
                  inputLength={ 6 }
                  name="pinPermanent"
                  placeholder="Pincode"
                  disabled={ isChecked }
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Emergence Contact Details*/ }
        <Grid item xs={ 12 }>
          <Paper sx={ { px: 3, py: 2 } } variant="outlined">
            <Typography fontWeight={ 500 }>Emergency Contact Details</Typography>{ " " }
            <Typography variant="body2" color="text.secondary" gutterBottom>
              This data will be used in emergency conditions.
            </Typography>
            <Grid container spacing={ 2 } sx={ { py: 3 } }>


              <Grid item xs={ 12 } sm={ 4 }>
                <Input
                  control={ control }
                  label="Contact Name"
                  required
                  name="emergencyContactName"
                  placeholder="Emergency Contact Name"
                />
              </Grid>

              <Grid item xs={ 12 } sm={ 4 }>
                <Input
                  control={ control }
                  type="number"
                  label="Contact Number"
                  required
                  name="emergencyContactNumber"
                  placeholder="Emergency Contact Number"
                />
              </Grid>

              <Grid item xs={ 12 } sm={ 4 }>
                <Select
                  control={ control }
                  label="Relationship"
                  name="relationship"
                  required
                  options={ relationships! }
                />
                { errors.relationship?.message && (
                  <p className="error">{ errors.relationship?.message }</p>
                ) }
              </Grid>
              <Grid item xs={ 12 }>
                <Input
                  control={ control }
                  type="text"
                  label="Home Address"
                  name="emergencyHomeAddress"
                  required
                  placeholder="Emergency Address"
                />
              </Grid>
              <Grid item xs={ 12 }>
                <Input
                  control={ control }
                  type="text"
                  label="Office Address"
                  name="emergencyOfficeAddress"
                  placeholder="Emergency Office Address"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>



        <Grid item xs={ 12 }>
          <Paper sx={ { px: 3, py: 2 } } variant="outlined">
            <Typography fontWeight={ 500 }>Bank Information</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              This data will be used in banking transactions.
            </Typography>
            <Grid container spacing={ 2 } sx={ { py: 3 } }>
              <Grid item xs={ 12 } sm={ 7 }>
                <Select
                  control={ control }
                  label="Banks"
                  name="bank"
                  required
                  options={ banks! }
                />
                { errors.bank?.message && (
                  <p className="error">{ errors.bank?.message }</p>
                ) }
              </Grid>

              <Grid item xs={ 12 } sm={ 5 }>
                <Input
                  control={ control }
                  label="Account Number"
                  name="accountNumber"
                  required
                  placeholder="Account Number"
                />
              </Grid>

              <Grid item xs={ 12 } sm={ 4 }>
                <Input
                  control={ control }
                  label="IFSC Number"
                  name="ifsc"
                  required
                  placeholder="IFSC Number"
                />
              </Grid>

              <Grid item xs={ 12 } sm={ 8 }>
                <Input
                  control={ control }
                  label="Branch Name"
                  name="branch"
                  required
                  placeholder="Branch Name"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={ 12 }>
          <Paper sx={ { px: 3, py: 2 } } variant="outlined">
            <Typography fontWeight={ 500 }>Save Form</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Do you want to save the form.
            </Typography>

            <Stack direction="row" gap={ 2 } py={ 3 }>
              <LoadingButton
                loading={ mutating }
                variant="contained"
                type="submit"
              >
                Save Changes
              </LoadingButton>
              <Button variant="outlined" onClick={ () => navigate(0) }>
                Reset Form
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
