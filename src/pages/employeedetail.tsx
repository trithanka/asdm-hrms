import { useNavigate, useParams } from "react-router-dom";
import "../styles/employeedetail.css";
import { Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { editEmployee, getEmployeeById } from "../api/employee/employee-api";
import BackButton from "../components/backbutton";
import { useEffect, useState } from "react";
import useFilters from "../features/employees/hooks/useFilters";
import { MenuItem, Select as MuiSelect } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { EditEmployeeFormValues } from "../features/employees/utils/types";
import { addEmployeeFormSchema } from "../features/employees/utils/schemas";
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done'
import toast from "react-hot-toast";

export default function EmployeeDetail() {
  const [enableEdit, setEnableEdit] = useState(false);
  const [employeeDetails, setEmployeeDetails] = useState({
    designationId: "",
    phoneNumber: "",
    email: "",
    branch: "",
    ifsc: "",
    accountNumber: "",
    bankId: "",
    empId: "",
  })
  const params = useParams();
  const navigate = useNavigate();

  const empId = params.empId;

  const {
    isLoading: pending,
    designations,
    banks,
  } = useFilters();

  const {
    formState: { errors },
  } = useForm<EditEmployeeFormValues>({
    resolver: yupResolver(addEmployeeFormSchema),
  });

  if (!empId) return <>{ navigate(-1) }</>;

  const { data, isLoading, refetch } = useQuery({
    queryKey: [`employee${empId}`],
    queryFn: () => getEmployeeById(empId),
    retry: false,
  });

  const { mutate, isPending: mutating } = useMutation({
    mutationFn: editEmployee,
    onSuccess(data) {

      if (data?.status === "Success") {
        toast.success("Details save successfully");
        refetch();
      } else {
        toast.error(data?.message ?? "Something went wrong");
      }
    },
    onError(error) {
      toast.error(error.message)
    }
  })

  const handleSaveData = () => {
    mutate(employeeDetails);
  }

  useEffect(() => {
    if (data) {
      const employeeData = data.getEmployeData[0];
      if (employeeData) {
        setEmployeeDetails({
          designationId: employeeData.designationId,
          phoneNumber: employeeData.phone || '',
          email: employeeData.email || '',
          branch: employeeData.branch || '',
          ifsc: employeeData.IFSC || '',
          accountNumber: employeeData.accountNumber || '',
          bankId: employeeData.bankId || '',
          empId: empId,
        });
      }
    }
  }, [data])

  const handleDetailsChange = (event: any, fieldName: any) => {
    const { value } = event.target;
    setEmployeeDetails((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }))
  }

  return isLoading || mutating ? (
    <p>Loading...</p>
  ) : (
    <Grid container spacing={ 2 }>
      <BackButton />
      <Grid item xs={ 12 } sm={ 6 } md={ 12 } gap={ 1 } display="flex" justifyContent="flex-end">
        { enableEdit ?
          <Button onClick={ () => { setEnableEdit(false), handleSaveData() } }>
            <DoneIcon />
            <Typography>Save</Typography>
          </Button>
          :
          <Button onClick={ () => setEnableEdit(true) }>
            <EditIcon />
            <Typography>Edit</Typography>
          </Button>
        }
      </Grid>
      <Grid item xs={ 12 }>
        <Paper sx={ { px: 3, py: 2 } } variant="outlined">
          <Typography fontWeight={ 500 }>Profile Details </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Employee Profile Details
          </Typography>

          <Grid container spacing={ 2 } sx={ { py: 3 } }>
            <Grid item xs={ 12 } md={ 3 }>
              <Typography
                variant="caption"
                fontWeight={ 500 }
                gutterBottom
                sx={ { color: "gray" } }
              >
                Name
              </Typography>

              <Typography>
                { data?.getEmployeData[0]?.firstName } { " " }
                { data?.getEmployeData[0]?.middleName } { " " }
                { data?.getEmployeData[0]?.vslastName } { " " }
              </Typography>
            </Grid>
            {/* { data?.getEmployeData[0]?.middleName &&
              <Grid item xs={ 12 } md={ 3 }>
                <Typography
                  variant="caption"
                  fontWeight={ 500 }
                  gutterBottom
                  sx={ { color: "gray" } }
                >
                  Middle Name
                </Typography>

                <Typography>
                  { data?.getEmployeData[0]?.middleName ?? "N/A" }
                </Typography>
              </Grid>
            } */}
            {/* <Grid item xs={ 12 } md={ 3 }>
              <Typography
                variant="caption"
                fontWeight={ 500 }
                gutterBottom
                sx={ { color: "gray" } }
              >
                Last Name
              </Typography>
              <Typography>
                { data?.getEmployeData[0]?.vslastName ?? "N/A" }
              </Typography>
            </Grid> */}

            <Grid item xs={ 12 } sm={ 6 } md={ 3 }>
              <Typography
                variant="caption"
                fontWeight={ 500 }
                gutterBottom
                sx={ { color: "gray" } }
              >
                Date of birth
              </Typography>
              <Typography>{ data?.getEmployeData[0]?.vsDOB ?? "N/A" }</Typography>
            </Grid>

            <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
              <Typography
                variant="caption"
                fontWeight={ 500 }
                gutterBottom
                sx={ { color: "gray" } }
              >
                Father Name
              </Typography>
              <Typography>
                { data?.getEmployeData[0]?.fatherName ?? "N/A" }
              </Typography>
            </Grid>

            <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
              <Typography
                variant="caption"
                fontWeight={ 500 }
                gutterBottom
                sx={ { color: "gray" } }
              >
                Mother Name
              </Typography>
              <Typography>
                { data?.getEmployeData[0]?.motherName ?? "N/A" }
              </Typography>
            </Grid>
            { enableEdit ?
              <Grid item display={ "flex" } direction={ "column" } xs={ 12 } sm={ 2 } md={ 3 }>
                <Typography
                  variant="caption"
                  fontWeight={ 500 }
                  gutterBottom
                  sx={ { color: "gray" } }
                >
                  Phone Number
                  <Typography variant="caption" fontWeight={ 500 } gutterBottom>
                    <span style={ { color: "red" } }>*</span>
                  </Typography>
                </Typography>

                <TextField
                  size="small"
                  value={ employeeDetails?.phoneNumber }
                  onChange={ (e) => handleDetailsChange(e, "phoneNumber") }
                  InputProps={ {
                    inputProps: {
                      maxLength: "10"
                    }
                  } }

                />
              </Grid>
              :
              <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
                <Typography
                  variant="caption"
                  fontWeight={ 500 }
                  gutterBottom
                  sx={ { color: "gray" } }
                >
                  Phone Number
                </Typography>
                <Typography>{ data?.getEmployeData[0]?.phone ?? "N/A" }</Typography>
              </Grid>
            }

            <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
              <Typography
                variant="caption"
                fontWeight={ 500 }
                gutterBottom
                sx={ { color: "gray" } }
              >
                Alt Phone Number
              </Typography>
              <Typography>
                { data?.getEmployeData[0]?.alternetPhone ?? "N/A" }
              </Typography>
            </Grid>

            <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
              <Typography
                variant="caption"
                fontWeight={ 500 }
                gutterBottom
                sx={ { color: "gray" } }
              >
                Gender
              </Typography>
              <Typography>
                { data?.getEmployeData[0]?.vsGenderName ?? "N/A" }
              </Typography>
            </Grid>

            { enableEdit ?
              <Grid item display={ "flex" } direction={ "column" } xs={ 12 } sm={ 2 } md={ 3 }>
                <Typography
                  variant="caption"
                  fontWeight={ 500 }
                  gutterBottom
                  sx={ { color: "gray" } }
                >
                  Email
                  <Typography variant="caption" fontWeight={ 500 } gutterBottom>
                    <span style={ { color: "red" } }>*</span>
                  </Typography>
                </Typography>

                <TextField
                  size="small"
                  value={ employeeDetails?.email }
                  onChange={ (e) => handleDetailsChange(e, "email") }
                />
              </Grid>
              :

              <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
                <Typography
                  variant="caption"
                  fontWeight={ 500 }
                  gutterBottom
                  sx={ { color: "gray" } }
                >
                  Email
                </Typography>
                <Typography>{ data?.getEmployeData[0]?.email ?? "N/A" }</Typography>
              </Grid>
            }
            <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
              <Typography
                variant="caption"
                fontWeight={ 500 }
                gutterBottom
                sx={ { color: "gray" } }
              >
                Religion
              </Typography>
              <Typography>
                { data?.getEmployeData[0]?.religion ?? "N/A" }
              </Typography>
            </Grid>

            <Grid item xs={ 12 } sm={ 4 }>
              <Typography
                variant="caption"
                fontWeight={ 500 }
                gutterBottom
                sx={ { color: "gray" } }
              >
                Bloog Group
              </Typography>
              <Typography>
                { data?.getEmployeData[0]?.bloodGroup ?? "N/A" }
              </Typography>
            </Grid>

            <Grid item xs={ 12 } sm={ 4 }>
              <Typography
                variant="caption"
                fontWeight={ 500 }
                gutterBottom
                sx={ { color: "gray" } }
              >
                Caste
              </Typography>
              <Typography>{ data?.getEmployeData[0]?.caste ?? "N/A" }</Typography>
            </Grid>

            <Grid item xs={ 12 } md={ 6 }>
              <Typography
                variant="caption"
                fontWeight={ 500 }
                gutterBottom
                sx={ { color: "gray" } }
              >
                Maratial Status
              </Typography>
              <Typography>
                { data?.getEmployeData[0]?.vsMaritalStatusName ?? "N/A" }
              </Typography>
            </Grid>

            <Grid item xs={ 12 } md={ 6 }>
              <Typography
                variant="caption"
                fontWeight={ 500 }
                gutterBottom
                sx={ { color: "gray" } }
              >
                Employee ID
              </Typography>
              <Typography>
                { data?.getEmployeData[0]?.EmployeId ?? "N/A" }
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Correspondence Address */ }
      <Grid item xs={ 12 }>
        <Paper sx={ { px: 3, py: 2 } } variant="outlined">
          <Typography fontWeight={ 500 }>Correspondence Address</Typography>{ " " }
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Employee Present address.
          </Typography>
          <Grid container spacing={ 2 } sx={ { py: 3 } }>
            <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
              <Typography
                variant="caption"
                fontWeight={ 500 }
                gutterBottom
                sx={ { color: "gray" } }
              >
                Address Line 1
              </Typography>
              <Typography sx={ { overflowWrap: "break-word" } }>
                { data?.getEmployeData[0]?.presentAddress1 ?? "N/A" }
              </Typography>
            </Grid>

            <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
              <Typography
                variant="caption"
                fontWeight={ 500 }
                gutterBottom
                sx={ { color: "gray" } }
              >
                Address Line 2
              </Typography>
              <Typography sx={ { overflowWrap: "break-word" } }>
                { data?.getEmployeData[0]?.presentAddress2 ?? "N/A" }
              </Typography>
            </Grid>

            <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
              <Typography
                variant="caption"
                fontWeight={ 500 }
                gutterBottom
                sx={ { color: "gray" } }
              >
                City
              </Typography>
              <Typography>
                { data?.getEmployeData[0]?.presentCity ?? "N/A" }
              </Typography>
            </Grid>

            <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
              <Typography
                variant="caption"
                fontWeight={ 500 }
                gutterBottom
                sx={ { color: "gray" } }
              >
                District
              </Typography>
              <Typography>
                { data?.getEmployeData[0]?.presentDistrict ?? "N/A" }
              </Typography>
            </Grid>
            <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
              <Typography
                variant="caption"
                fontWeight={ 500 }
                gutterBottom
                sx={ { color: "gray" } }
              >
                Pincode
              </Typography>
              <Typography>
                { data?.getEmployeData[0]?.presentPIN ?? "N/A" }
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Permanent Address */ }
      <Grid item xs={ 12 }>
        <Paper sx={ { px: 3, py: 2 } } variant="outlined">
          <Typography fontWeight={ 500 }>Permanent Address</Typography>{ " " }
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Enter your permanent address.
          </Typography>
          <Grid container spacing={ 2 } sx={ { py: 3 } }>
            <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
              <Typography
                variant="caption"
                fontWeight={ 500 }
                gutterBottom
                sx={ { color: "gray" } }
              >
                Address Line 1
              </Typography>
              <Typography sx={ { overflowWrap: "break-word" } }>
                { data?.getEmployeData[0]?.permanentAddress1 ?? "N/A" }
              </Typography>
            </Grid>
            <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
              <Typography
                variant="caption"
                fontWeight={ 500 }
                gutterBottom
                sx={ { color: "gray" } }
              >
                Address Line 2
              </Typography>
              <Typography sx={ { overfflowWrap: "break-word" } }>
                { data?.getEmployeData[0]?.permanentAddress2 ?? "N/A" }
              </Typography>
            </Grid>

            <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
              <Typography
                variant="caption"
                fontWeight={ 500 }
                gutterBottom
                sx={ { color: "gray" } }
              >
                City
              </Typography>
              <Typography>
                { data?.getEmployeData[0]?.permanentCity ?? "N/A" }
              </Typography>
            </Grid>

            <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
              <Typography
                variant="caption"
                fontWeight={ 500 }
                gutterBottom
                sx={ { color: "gray" } }
              >
                District
              </Typography>
              <Typography>
                { data?.getEmployeData[0]?.permanentDistrict ?? "N/A" }
              </Typography>
            </Grid>
            <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
              <Typography
                variant="caption"
                fontWeight={ 500 }
                gutterBottom
                sx={ { color: "gray" } }
              >
                Pincode
              </Typography>
              <Typography>
                { data?.getEmployeData[0]?.presentPIN ?? "N/A" }
              </Typography>
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
              <Typography
                variant="caption"
                fontWeight={ 500 }
                gutterBottom
                sx={ { color: "gray" } }
              >
                Home Address
              </Typography>
              <Typography sx={ { overflowWrap: "break-word" } }>
                { data?.getEmployeData[0]?.homeAddress ?? "N/A" }
              </Typography>
            </Grid>

            <Grid item xs={ 12 } sm={ 4 }>
              <Typography
                variant="caption"
                fontWeight={ 500 }
                gutterBottom
                sx={ { color: "gray" } }
              >
                Office Address
              </Typography>
              <Typography sx={ { overflowWrap: "break-word" } }>
                { data?.getEmployeData[0]?.officeAddress ?? "N/A" }
              </Typography>
            </Grid>

            <Grid item xs={ 12 } sm={ 4 }>
              <Typography
                variant="caption"
                fontWeight={ 500 }
                gutterBottom
                sx={ { color: "gray" } }
              >
                Contact Name
              </Typography>
              <Typography>
                { data?.getEmployeData[0]?.emergencyContactName ?? "N/A" }
              </Typography>
            </Grid>

            <Grid item xs={ 12 } sm={ 4 }>
              <Typography
                variant="caption"
                fontWeight={ 500 }
                gutterBottom
                sx={ { color: "gray" } }
              >
                Contact Number
              </Typography>
              <Typography>
                { data?.getEmployeData[0]?.emergencyContactNumber ?? "N/A" }
              </Typography>
            </Grid>

            <Grid item xs={ 12 } sm={ 4 }>
              <Typography
                variant="caption"
                fontWeight={ 500 }
                gutterBottom
                sx={ { color: "gray" } }
              >
                Relationship
              </Typography>
              <Typography>
                { data?.getEmployeData[0]?.relation ?? "N/A" }
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      <Grid item xs={ 12 }>
        <Paper sx={ { px: 3, py: 2 } } variant="outlined">
          <Typography fontWeight={ 500 }>Professional Information</Typography>{ " " }
          <Typography variant="body2" color="text.secondary" gutterBottom>
            This data will be used in office tasks.
          </Typography>
          <Grid container spacing={ 2 } sx={ { py: 3 } }>
            { enableEdit && !pending ?
              <Grid item xs={ 12 } sm={ 4 }>
                <Typography
                  variant="caption"
                  fontWeight={ 500 }
                  gutterBottom
                  sx={ { color: "gray" } }
                >
                  Designation
                </Typography>
                <Grid>
                  <MuiSelect
                    key={ employeeDetails?.designationId }
                    size="small"
                    onChange={ (e) => {
                      handleDetailsChange(e, "designationId")
                    }
                    }
                    value={ employeeDetails?.designationId }
                    // disabled={ disabled }
                    defaultValue={ employeeDetails?.designationId }
                  >
                    <MenuItem selected disabled value={ "none" } sx={ { textTransform: "capitalize" } }>
                      Select Designation
                    </MenuItem>
                    { designations?.map((option, idx: number) => (
                      <MenuItem key={ idx } value={ option.value }>
                        { option.label }
                      </MenuItem>
                    )) }
                  </MuiSelect>
                </Grid>

                { errors.designation?.message &&
                  <p className="error">{ errors.designation?.message }</p>
                }
              </Grid>
              :
              <Grid item xs={ 12 } sm={ 4 }>
                <Typography
                  variant="caption"
                  fontWeight={ 500 }
                  gutterBottom
                  sx={ { color: "gray" } }
                >
                  Designation
                </Typography>
                <Typography>
                  { data?.getEmployeData[0]?.designation ?? "N/A" }
                </Typography>
              </Grid>
            }


            <Grid item xs={ 12 } sm={ 4 }>
              <Typography
                variant="caption"
                fontWeight={ 500 }
                gutterBottom
                sx={ { color: "gray" } }
              >
                Department
              </Typography>
              <Typography>
                { data?.getEmployeData[0]?.departmentName ?? "N/A" }
              </Typography>
            </Grid>

            <Grid item xs={ 12 } sm={ 4 }>
              <Typography
                variant="caption"
                fontWeight={ 500 }
                gutterBottom
                sx={ { color: "gray" } }
              >
                Date Of Joining
              </Typography>
              <Typography>
                { data?.getEmployeData[0]?.joiningDate ?? "N/A" }
              </Typography>
            </Grid>

            <Grid item xs={ 12 } sm={ 4 }>
              <Typography variant="caption"
                fontWeight={ 500 }
                gutterBottom
                sx={ { color: "gray" } }>
                Current Working Location
              </Typography>
              <Typography>
                { data?.getEmployeData[0]?.current_working_location ?? "N/A" }
              </Typography>
            </Grid>

            <Grid item xs={ 12 } sm={ 4 }>
              <Typography variant="caption"
                fontWeight={ 500 }
                gutterBottom
                sx={ { color: "gray" } }>
                Current Location Date of Joining
              </Typography>
              <Typography>
                { data?.getEmployeData[0]?.joiningDate ?? "N/A" }
              </Typography>
            </Grid>
            { data?.getEmployeData[0]?.release_date &&
              <Grid item xs={ 12 } sm={ 4 }>
                <Typography variant="caption"
                  fontWeight={ 500 }
                  gutterBottom
                  sx={ { color: "gray" } }>
                  Date of Release
                </Typography>
                <Typography>
                  { data?.getEmployeData[0]?.release_date ?? "N/A" }
                </Typography>
              </Grid>
            }

            <Grid item xs={ 12 } sm={ 4 }>
              <Typography
                variant="caption"
                fontWeight={ 500 }
                gutterBottom
                sx={ { color: "gray" } }
              >
                Supervisor Name
              </Typography>
              <Typography>
                { data?.getEmployeData[0]?.supervisorName1 ?? "N/A" }
              </Typography>
            </Grid>
            { data?.getEmployeData[0]?.supervisorName2 &&
              <Grid item xs={ 12 } sm={ 4 }>
                <Typography
                  variant="caption"
                  fontWeight={ 500 }
                  gutterBottom
                  sx={ { color: "gray" } }
                >
                  Supervisor Name 2
                </Typography>
                <Typography>
                  { data?.getEmployeData[0]?.supervisorName2 ?? "N/A" }
                </Typography>
              </Grid>
            }

            <Grid item xs={ 12 } sm={ 4 }>
              <Typography
                variant="caption"
                fontWeight={ 500 }
                gutterBottom
                sx={ { color: "gray" } }
              >
                Qualifications
              </Typography>
              <Typography>
                { data?.getEmployeData[0]?.qualification ?? "N/A" }
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      <Grid item xs={ 12 }>
        <Paper sx={ { px: 3, py: 2 } } variant="outlined">
          <Typography fontWeight={ 500 }>Bank Information</Typography>{ " " }
          <Typography variant="body2" color="text.secondary" gutterBottom>
            This data will be used in banking transactions.
          </Typography>
          <Grid container spacing={ 2 } sx={ { py: 3 } }>
            { enableEdit ?
              <Grid item xs={ 5 } sm={ 3 }>
                <Typography
                  variant="caption"
                  fontWeight={ 500 }
                  gutterBottom
                  sx={ { color: "gray" } }
                >
                  Banks
                </Typography>
                <Grid>
                  <MuiSelect
                    key={ employeeDetails?.bankId }
                    size="small"
                    onChange={ (e) => {
                      handleDetailsChange(e, "bank"),
                        handleDetailsChange(e, "bankId")
                    }
                    }
                    value={ employeeDetails?.bankId }
                    // disabled={ disabled }
                    defaultValue={ employeeDetails?.bankId }
                  >
                    <MenuItem selected disabled value={ "none" } sx={ { textTransform: "capitalize" } }>
                      Select Banks
                    </MenuItem>
                    { banks?.map((option, idx: number) => (
                      <MenuItem key={ idx } value={ option.value }>
                        { option.label }
                      </MenuItem>
                    )) }
                  </MuiSelect>
                </Grid>
              </Grid>

              :
              <Grid item xs={ 12 } sm={ 7 }>
                <Typography
                  variant="caption"
                  fontWeight={ 500 }
                  gutterBottom
                  sx={ { color: "gray" } }
                >
                  Banks
                </Typography>
                <Typography>{ data?.getEmployeData[0]?.bank ?? "N/A" }</Typography>
              </Grid>
            }

            { enableEdit ?
              <Grid item display={ "flex" } direction={ "column" } xs={ 12 } sm={ 2 } md={ 3 }>
                <Typography
                  variant="caption"
                  fontWeight={ 500 }
                  gutterBottom
                  sx={ { color: "gray" } }
                >
                  Account Number
                  <Typography variant="caption" fontWeight={ 500 } gutterBottom>
                    <span style={ { color: "red" } }>*</span>
                  </Typography>
                </Typography>

                <TextField
                  size="small"
                  value={ employeeDetails?.accountNumber }
                  onChange={ (e) => handleDetailsChange(e, "accountNumber") }
                />
              </Grid>
              :

              <Grid item xs={ 12 } sm={ 5 }>
                <Typography
                  variant="caption"
                  fontWeight={ 500 }
                  gutterBottom
                  sx={ { color: "gray" } }
                >
                  Account Number
                </Typography>
                <Typography>
                  { data?.getEmployeData[0]?.accountNumber ?? "N/A" }
                </Typography>
              </Grid>
            }

            { enableEdit ?
              <Grid item display={ "flex" } direction={ "column" } xs={ 12 } sm={ 2 } md={ 3 }>
                <Typography
                  variant="caption"
                  fontWeight={ 500 }
                  gutterBottom
                  sx={ { color: "gray" } }
                >
                  IFSC Number
                  <Typography variant="caption" fontWeight={ 500 } gutterBottom>
                    <span style={ { color: "red" } }>*</span>
                  </Typography>
                </Typography>

                <TextField
                  size="small"
                  value={ employeeDetails?.ifsc }
                  onChange={ (e) => handleDetailsChange(e, "ifsc") }
                />
              </Grid>
              :
              <Grid item xs={ 12 } sm={ 4 }>
                <Typography
                  variant="caption"
                  fontWeight={ 500 }
                  gutterBottom
                  sx={ { color: "gray" } }
                >
                  IFSC Number
                </Typography>
                <Typography>{ data?.getEmployeData[0]?.IFSC ?? "N/A" }</Typography>
              </Grid>
            }
            { enableEdit ?
              <Grid item display={ "flex" } direction={ "column" } xs={ 12 } sm={ 2 } md={ 3 }>
                <Typography
                  variant="caption"
                  fontWeight={ 500 }
                  gutterBottom
                  sx={ { color: "gray" } }
                >
                  Branch Name
                  <Typography variant="caption" fontWeight={ 500 } gutterBottom>
                    <span style={ { color: "red" } }>*</span>
                  </Typography>
                </Typography>

                <TextField
                  size="small"
                  value={ employeeDetails?.branch }
                  onChange={ (e) => handleDetailsChange(e, "branch") }
                />
              </Grid>
              :
              <Grid item xs={ 12 } sm={ 8 }>
                <Typography
                  variant="caption"
                  fontWeight={ 500 }
                  gutterBottom
                  sx={ { color: "gray" } }
                >
                  Branch Name
                </Typography>
                <Typography>
                  { data?.getEmployeData[0]?.branch ?? "N/A" }
                </Typography>
              </Grid>
            }
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
