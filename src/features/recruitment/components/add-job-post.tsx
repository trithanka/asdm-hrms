import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Stack,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { useForm } from "react-hook-form";
import Input from "../../../components/ui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoadingButton } from "@mui/lab";
import toast from "react-hot-toast";
import {
  createJobPost,
  fetchRecruitmentMasterData,
  formatDateLocal,
} from "../../../api/recruitment/recruitment-api";
import { ICreateJobPost } from "../../../api/recruitment/recruitment-types";
import Select from "../../../components/ui/select";
import { useState } from "react";

// Helper to get tomorrow's date in YYYY-MM-DD
const getTomorrowDateStr = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatDateLocal(tomorrow);
};

const tomorrowDateStr = getTomorrowDateStr();
const todayDateStr = formatDateLocal(new Date());

const schema = yup
  .object({
    vsJobPostName: yup.string().required("Job Post Name is required"),
    department: yup.number().required("Department is required"),
    designation: yup.number().required("Designation is required"),
    qualification: yup.number().optional(),
    minYearExp: yup.number().min(0, "Must be 0 or greater").optional(),
    numberOfPost: yup
      .number()
      .min(1, "Must be at least 1")
      .required("Number of Posts is required"),
    ageLimit: yup.number().min(18, "Must be at least 18").optional(),
    jobDescription: yup.string().optional(),
    applicationStartDate: yup
      .date()
      .required("Application Start Date is required")
      .typeError("Invalid date")
      .test("is-future", "Application Start Date must be a future date", (value) => {
        if (!value) return false;
        return formatDateLocal(value) > todayDateStr;
      }),
    applicationEndDate: yup
      .date()
      .required("Application End Date is required")
      .typeError("Invalid date")
      .min(
        yup.ref("applicationStartDate"),
        "Application End Date must be on or after Application Start Date"
      ),
    interviewAt: yup
      .date()
      .optional()
      .typeError("Invalid date")
      .min(new Date(), "Interview Date must be today or a future date"),
    interviewDistrictId: yup.number().optional(),
    interviewAddress: yup.string().optional(),
  })
  .required();

interface Props {
  open: boolean;
  closeHandler: () => void;
}

type FormValues = {
  vsJobPostName: string;
  department: number;
  designation: number;
  qualification?: number;
  minYearExp?: number;
  numberOfPost: number;
  ageLimit?: number;
  jobDescription?: string;
  applicationStartDate: Date;
  applicationEndDate: Date;
  interviewAt?: Date;
  interviewDistrictId?: number;
  interviewAddress?: string;
};

export default function AddJobPost(props: Props) {
  const queryClient = useQueryClient();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const { control, handleSubmit, reset, watch } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      vsJobPostName: "",
      department: undefined,
      designation: undefined,
      qualification: undefined,
      minYearExp: undefined,
      numberOfPost: 1,
      ageLimit: undefined,
      jobDescription: "",
      interviewDistrictId: undefined,
      interviewAddress: "",
    },
  });

  // Watch application start date to set min date for end date
  const applicationStartDate = watch("applicationStartDate");

  // Get minimum date for application end date (start date or tomorrow, whichever is later)
  const getMinEndDate = () => {
    if (applicationStartDate) {
      return formatDateLocal(applicationStartDate);
    }
    return tomorrowDateStr;
  };

  // Fetch master data for dropdowns
  const { data: masterData } = useQuery({
    queryKey: ["recruitmentMaster"],
    queryFn: fetchRecruitmentMasterData,
    retry: false,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ data, files }: { data: ICreateJobPost; files: File[] }) =>
      createJobPost(data, files),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["jobPosts"] });
      toast.success("Job Post created successfully!");
      reset();
      setSelectedFiles([]);
      props.closeHandler();
    },
    onError(error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to create job post"
      );
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Convert FileList to Array and add to existing files
    const fileArray = Array.from(files);
    setSelectedFiles((prev) => [...prev, ...fileArray]);

    toast.success(`${fileArray.length} file(s) selected`);

    // Reset the input to allow selecting the same file again if needed
    event.target.value = "";
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: FormValues) => {
    // Format dates to YYYY-MM-DD format using local time to avoid shift
    const formattedData: ICreateJobPost = {
      ...data,
      applicationStartDate: formatDateLocal(data.applicationStartDate),
      applicationEndDate: formatDateLocal(data.applicationEndDate),
      interviewAt: data.interviewAt
        ? formatDateLocal(data.interviewAt)
        : undefined,
    };
    mutate({ data: formattedData, files: selectedFiles });
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.closeHandler}
      fullWidth
      maxWidth="md"
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <DialogTitle>Create New Job Post</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please fill in the details below to create a new job post.
        </DialogContentText>

        <Stack py={3} gap={2}>
          <Grid container spacing={2}>
            {/* Job Post Name */}
            <Grid item xs={12} sm={6}>
              <Input
                control={control}
                label="Job Post Name"
                name="vsJobPostName"
                placeholder="Software Engineer"
                required
              />
            </Grid>

            {/* Department */}
            <Grid item xs={12} sm={6}>
              <Select
                control={control}
                label="Department"
                name="department"
                required
                options={
                  masterData?.department?.map((dept: any) => ({
                    value: dept.internalDepartmentId,
                    label: dept.internalDepartmentName,
                  })) || []
                }
              />
            </Grid>

            {/* Designation */}
            <Grid item xs={12} sm={6}>
              <Select
                control={control}
                label="Designation"
                name="designation"
                required
                options={
                  masterData?.designation?.map((desig: any) => ({
                    value: desig.designationId,
                    label: desig.designationName,
                  })) || []
                }
              />
            </Grid>

            {/* Qualification */}
            <Grid item xs={12} sm={6}>
              <Select
                control={control}
                label="Qualification"
                name="qualification"
                options={
                  masterData?.qualification?.map((qual: any) => ({
                    value: qual.qualificationId,
                    label: qual.qualificationName,
                  })) || []
                }
              />
            </Grid>

            {/* Number of Posts */}
            <Grid item xs={12} sm={6}>
              <Input
                control={control}
                label="Number of Posts"
                name="numberOfPost"
                placeholder="5"
                type="number"
                required
              />
            </Grid>

            {/* Minimum Years of Experience */}
            <Grid item xs={12} sm={6}>
              <Input
                control={control}
                label="Minimum Years of Experience"
                name="minYearExp"
                placeholder="2"
                type="number"
              />
            </Grid>

            {/* Age Limit */}
            <Grid item xs={12} sm={6}>
              <Input
                control={control}
                label="Age Limit"
                name="ageLimit"
                placeholder="35"
                type="number"
              />
            </Grid>

            {/* Application Start Date */}
            <Grid item xs={12} sm={6}>
              <Input
                control={control}
                label="Application Start Date"
                name="applicationStartDate"
                type="date"
                placeholder=""
                required
                minDate={tomorrowDateStr}
              />
            </Grid>

            {/* Application End Date */}
            <Grid item xs={12} sm={6}>
              <Input
                control={control}
                label="Application End Date"
                name="applicationEndDate"
                type="date"
                placeholder=""
                required
                minDate={getMinEndDate()}
              />
            </Grid>

            {/* Interview Date */}
            <Grid item xs={12} sm={6}>
              <Input
                control={control}
                label="Interview Date"
                name="interviewAt"
                type="date"
                placeholder=""
                minDate={tomorrowDateStr}
              />
            </Grid>

            {/* Interview District */}
            <Grid item xs={12} sm={6}>
              <Select
                control={control}
                label="Interview District"
                name="interviewDistrictId"
                placeholder="Select Interview District"
                options={
                  masterData?.district?.map((district: any) => ({
                    value: district.districtId,
                    label: district.districtName,
                  })) || []
                }
              />
            </Grid>

            {/* Interview Address */}
            <Grid item xs={12} sm={6}>
              <Input
                control={control}
                label="Interview Address"
                name="interviewAddress"
                placeholder="Enter interview address"
              />
            </Grid>

            {/* Job Description */}
            <Grid item xs={12}>
              <Input
                control={control}
                label="Job Description"
                name="jobDescription"
                placeholder="Enter job description"
                multiline
              />
            </Grid>

            {/* Document Upload */}
            <Grid item xs={12}>
              <Typography variant="caption" fontWeight={500} gutterBottom>
                Upload Documents
              </Typography>
              <Box
                sx={{
                  border: "2px dashed",
                  borderColor: "divider",
                  borderRadius: 1,
                  p: 2,
                  mt: 1,
                  textAlign: "center",
                  bgcolor: "background.paper",
                }}
              >
                <input
                  type="file"
                  id="document-upload"
                  multiple
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <label htmlFor="document-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                  >
                    Choose Files
                  </Button>
                </label>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  mt={1}
                >
                  Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG
                </Typography>

                {/* Selected Files List */}
                {selectedFiles.length > 0 && (
                  <Box mt={2}>
                    <Stack spacing={1}>
                      {selectedFiles.map((file, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            bgcolor: "action.hover",
                            p: 1,
                            borderRadius: 1,
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <InsertDriveFileIcon fontSize="small" color="primary" />
                            <Box>
                              <Typography variant="body2" fontWeight={500}>
                                {file.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {(file.size / 1024).toFixed(2)} KB
                              </Typography>
                            </Box>
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveFile(index)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.closeHandler} disabled={isPending}>
          Cancel
        </Button>
        <LoadingButton loading={isPending} type="submit" variant="contained">
          Create Job Post
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
