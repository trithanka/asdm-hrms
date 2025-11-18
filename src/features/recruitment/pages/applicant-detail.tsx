import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import DescriptionIcon from "@mui/icons-material/Description";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { LoadingButton } from "@mui/lab";
import toast from "react-hot-toast";
import {
  fetchApplicantById,
  updateApplicantStatus,
} from "../../../api/recruitment/recruitment-api";
import { formatDate } from "../../../utils/formatter";

export default function ApplicantDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["applicant", id],
    queryFn: () => fetchApplicantById(id!),
    enabled: !!id,
    retry: false,
  });

  const { mutate: updateStatus, isPending: isUpdating } = useMutation({
    mutationFn: (status: "1" | "2") => updateApplicantStatus(id!, status),
    onSuccess(data: any) {
      if (data?.status === "success" || data?.statusCode === 200) {
        const statusName = data?.data?.status === "1" ? "Shortlist" : data?.data?.status === "2" ? "Rejected" : "updated";
        toast.success(`Applicant status updated to ${statusName} successfully!`);
        queryClient.invalidateQueries({ queryKey: ["applicant", id] });
        queryClient.invalidateQueries({ queryKey: ["applicants"] });
      } else {
        toast.error(data?.message || "Failed to update applicant status");
      }
    },
    onError(error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to update applicant status"
      );
    },
  });

  const applicantDetails = data?.data?.applicantDetails;
  const jobDetails = data?.data?.jobDetails;

  // Parse document paths (they come as JSON strings)
  const parseDocuments = (docPath: string) => {
    try {
      if (!docPath) return [];
      const parsed = JSON.parse(docPath);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const applicantDocs = applicantDetails?.docPath
    ? parseDocuments(applicantDetails.docPath)
    : [];

  // Get file type icon
  const getFileIcon = (fileName: string, fileUrl: string) => {
    const file = fileName || fileUrl || "";
    const extension = file.split(".").pop()?.toLowerCase() || "";
    
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension)) {
      return <ImageIcon sx={{ fontSize: 40, color: "primary.main" }} />;
    } else if (extension === "pdf") {
      return <PictureAsPdfIcon sx={{ fontSize: 40, color: "error.main" }} />;
    } else if (["doc", "docx"].includes(extension)) {
      return <DescriptionIcon sx={{ fontSize: 40, color: "info.main" }} />;
    } else {
      return <InsertDriveFileIcon sx={{ fontSize: 40, color: "text.secondary" }} />;
    }
  };

  // Check if file is an image
  const isImageFile = (fileName: string, fileUrl: string) => {
    const file = fileName || fileUrl || "";
    const extension = file.split(".").pop()?.toLowerCase() || "";
    return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "warning";
      case "approved":
      case "accepted":
      case "shortlist":
      case "shortlisted":
        return "success";
      case "rejected":
      case "declined":
        return "error";
      default:
        return "default";
    }
  };

  const handleStatusUpdate = (status: "1" | "2") => {
    updateStatus(status);
  };

  const currentStatus = applicantDetails?.applicationStatus?.toLowerCase() || "";
  const canUpdateStatus = currentStatus === "pending";

  if (isLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" py={8}>
        <CircularProgress />
      </Stack>
    );
  }

  if (error || !data) {
    return (
      <Stack alignItems="center" justifyContent="center" py={8} spacing={2}>
        <Typography color="error">
          Error loading applicant details. Please try again.
        </Typography>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Stack>
    );
  }

  return (
    <Paper elevation={0} sx={{ bgcolor: "transparent", p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        mb={3}
        sx={{ flexWrap: "wrap", gap: 2 }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          variant="outlined"
          size="small"
        >
          Back
        </Button>
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Applicant Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View detailed information about the applicant and job post
          </Typography>
        </Box>
      </Stack>

      {/* Two Column Layout */}
      <Grid container spacing={3}>
        {/* Left Column - Applicant Details */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Applicant Information
                </Typography>
                <Divider />

                {/* Application Status */}
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140 }}>
                    Application Status:
                  </Typography>
                  <Chip
                    label={applicantDetails?.applicationStatus || "N/A"}
                    size="small"
                    color={getStatusColor(
                      applicantDetails?.applicationStatus || ""
                    )}
                    sx={{
                      bgcolor: getStatusColor(applicantDetails?.applicationStatus || "") === "success" 
                        ? "rgba(46, 125, 50, 0.1)" 
                        : getStatusColor(applicantDetails?.applicationStatus || "") === "warning"
                        ? "rgba(237, 108, 2, 0.1)"
                        : getStatusColor(applicantDetails?.applicationStatus || "") === "error"
                        ? "rgba(211, 47, 47, 0.1)"
                        : "rgba(158, 158, 158, 0.1)",
                      color: getStatusColor(applicantDetails?.applicationStatus || "") === "success"
                        ? "rgb(46, 125, 50)"
                        : getStatusColor(applicantDetails?.applicationStatus || "") === "warning"
                        ? "rgb(237, 108, 2)"
                        : getStatusColor(applicantDetails?.applicationStatus || "") === "error"
                        ? "rgb(211, 47, 47)"
                        : "rgb(97, 97, 97)",
                    }}
                  />
                </Box>

                {/* Name */}
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140 }}>
                    Full Name:
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {applicantDetails?.name || "N/A"}
                  </Typography>
                </Box>

                {/* Email */}
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140 }}>
                    Email Address:
                  </Typography>
                  <Typography variant="body1">
                    {applicantDetails?.email || "N/A"}
                  </Typography>
                </Box>

                {/* Mobile */}
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140 }}>
                    Mobile Number:
                  </Typography>
                  <Typography variant="body1">
                    {applicantDetails?.mobile || "N/A"}
                  </Typography>
                </Box>

                {/* Address */}
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140 }}>
                    Address:
                  </Typography>
                  <Typography variant="body1">
                    {applicantDetails?.address || "N/A"}
                  </Typography>
                </Box>

                {/* Qualification */}
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140 }}>
                    Qualification:
                  </Typography>
                  <Typography variant="body1">
                    {applicantDetails?.applicantQualification || "N/A"}
                  </Typography>
                </Box>

                {/* Experience Years */}
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140 }}>
                    Years of Experience:
                  </Typography>
                  <Typography variant="body1">
                    {applicantDetails?.experienceYears ?? "N/A"} years
                  </Typography>
                </Box>

                {/* Applied Date */}
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140 }}>
                    Applied Date:
                  </Typography>
                  <Typography variant="body1">
                    {applicantDetails?.appliedAt
                      ? formatDate(applicantDetails.appliedAt)
                      : "N/A"}
                  </Typography>
                </Box>

                {/* Cover Letter */}
                {applicantDetails?.coverLetter && (
                <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140 }}>
                      Cover Letter:
                    </Typography>
                    <Typography variant="body1">
                      {applicantDetails.coverLetter}
                    </Typography>
                  </Box>
                )}

                {/* Applicant Documents */}
                {applicantDocs.length > 0 && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      Documents:
                    </Typography>
                    <Grid container spacing={2}>
                      {applicantDocs.map((doc: any, index: number) => {
                        const fileName = doc.fileName || doc.fileUrl || `Document ${index + 1}`;
                        const fileUrl = doc.fileUrl || "";
                        const isImage = isImageFile(fileName, fileUrl);
                        
                        return (
                          <Grid item xs={6} sm={4} md={3} key={index}>
                            <Box
                              component="a"
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                display: "block",
                                textDecoration: "none",
                                color: "inherit",
                                "&:hover": {
                                  "& .thumbnail-container": {
                                    boxShadow: 3,
                                    transform: "translateY(-2px)",
                                  },
                                },
                              }}
                            >
                              <Box
                                className="thumbnail-container"
                                sx={{
                                  border: 1,
                                  borderColor: "divider",
                                  borderRadius: 2,
                                  overflow: "hidden",
                                  bgcolor: "background.paper",
                                  transition: "all 0.2s ease-in-out",
                                  height: "100%",
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                {/* Thumbnail Preview */}
                                <Box
                                  sx={{
                                    width: "100%",
                                    height: 120,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    bgcolor: "action.hover",
                                    position: "relative",
                                    overflow: "hidden",
                                  }}
                                >
                                  {isImage && fileUrl ? (
                                    <Box
                                      component="img"
                                      src={fileUrl}
                                      alt={fileName}
                                      sx={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                      }}
                                      onError={(e: any) => {
                                        // Fallback to icon if image fails to load
                                        e.target.style.display = "none";
                                        e.target.parentElement.style.display = "flex";
                                      }}
                                    />
                                  ) : (
                                    getFileIcon(fileName, fileUrl)
                                  )}
                                </Box>
                                
                                {/* File Name */}
                                <Box
                                  sx={{
                                    p: 1.5,
                                    textAlign: "center",
                                    borderTop: 1,
                                    borderColor: "divider",
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      display: "-webkit-box",
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: "vertical",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      lineHeight: 1.3,
                                      fontWeight: 500,
                                    }}
                                  >
                                    {fileName}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Job Post Details */}
        <Grid item xs={12} md={6}>
          <Card 
            variant="outlined"
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent sx={{ flexGrow: 1, p: 2 }}>
              <Stack spacing={1.5}>
                {/* Header with Link */}
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                  <Typography variant="h6" fontWeight={600}>
                    Applied Job
                  </Typography>
                  {jobDetails?.jobPostId && (
                    <Button
                      component={Link}
                      to={`/recruitment/jobs/${jobDetails.jobPostId}`}
                      variant="outlined"
                      size="small"
                      startIcon={<VisibilityIcon />}
                    >
                      View Details
                    </Button>
                  )}
                </Box>
                <Divider />

                {/* Compact Job Info */}
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Typography variant="caption" color="text.secondary" sx={{ minWidth: 100, fontSize: "0.75rem" }}>
                    Job Name:
                  </Typography>
                  <Typography variant="body2" fontWeight={500} color="primary">
                    {jobDetails?.jobPostName || "N/A"}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1.5}>
                  <Typography variant="caption" color="text.secondary" sx={{ minWidth: 100, fontSize: "0.75rem" }}>
                    Department:
                  </Typography>
                  <Typography variant="body2">
                    {jobDetails?.departmentName || "N/A"}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1.5}>
                  <Typography variant="caption" color="text.secondary" sx={{ minWidth: 100, fontSize: "0.75rem" }}>
                    Designation:
                  </Typography>
                  <Typography variant="body2">
                    {jobDetails?.designationName || "N/A"}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1.5}>
                  <Typography variant="caption" color="text.secondary" sx={{ minWidth: 100, fontSize: "0.75rem" }}>
                    Qualification:
                  </Typography>
                  <Typography variant="body2">
                    {jobDetails?.postQualification || "N/A"}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1.5}>
                  <Typography variant="caption" color="text.secondary" sx={{ minWidth: 100, fontSize: "0.75rem" }}>
                    Posts:
                  </Typography>
                  <Typography variant="body2">
                    {jobDetails?.numberOfPost ?? "N/A"}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1.5}>
                  <Typography variant="caption" color="text.secondary" sx={{ minWidth: 100, fontSize: "0.75rem" }}>
                    Experience:
                  </Typography>
                  <Typography variant="body2">
                    {jobDetails?.minimumExperience ?? "N/A"} years
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1.5}>
                  <Typography variant="caption" color="text.secondary" sx={{ minWidth: 100, fontSize: "0.75rem" }}>
                    Start Date:
                  </Typography>
                  <Typography variant="body2">
                    {jobDetails?.applicationStartDate
                      ? formatDate(jobDetails.applicationStartDate)
                      : "N/A"}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1.5}>
                  <Typography variant="caption" color="text.secondary" sx={{ minWidth: 100, fontSize: "0.75rem" }}>
                    End Date:
                  </Typography>
                  <Typography variant="body2">
                    {jobDetails?.applicationEndDate
                      ? formatDate(jobDetails.applicationEndDate)
                      : "N/A"}
                  </Typography>
                </Box>

                {jobDetails?.interviewDate && (
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Typography variant="caption" color="text.secondary" sx={{ minWidth: 100, fontSize: "0.75rem" }}>
                      Interview:
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(jobDetails.interviewDate)}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      {canUpdateStatus && (
        <Stack
          direction="row"
          justifyContent="center"
          spacing={2}
          mt={4}
          sx={{ flexWrap: "wrap", gap: 2 }}
        >
          <LoadingButton
            variant="contained"
            color="success"
            startIcon={<CheckCircleIcon />}
            onClick={() => handleStatusUpdate("1")}
            loading={isUpdating}
            disabled={isUpdating}
            size="large"
          >
            Shortlist
          </LoadingButton>
          <LoadingButton
            variant="contained"
            color="error"
            startIcon={<CancelIcon />}
            onClick={() => handleStatusUpdate("2")}
            loading={isUpdating}
            disabled={isUpdating}
            size="large"
          >
            Rejected
          </LoadingButton>
        </Stack>
      )}
    </Paper>
  );
}

