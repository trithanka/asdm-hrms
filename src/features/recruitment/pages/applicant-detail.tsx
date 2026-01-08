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
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import HistoryIcon from "@mui/icons-material/History";
import EventIcon from "@mui/icons-material/Event";
import RoomIcon from "@mui/icons-material/Room";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import GroupsIcon from "@mui/icons-material/Groups";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
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

  // Parse document paths (they come as strings, JSON strings or arrays)
  const parseDocuments = (docPath: any) => {
    if (!docPath) return [];
    if (Array.isArray(docPath)) return docPath;
    if (typeof docPath === "string") {
      try {
        const parsed = JSON.parse(docPath);
        if (Array.isArray(parsed)) return parsed;
        return [parsed];
      } catch {
        return [docPath];
      }
    }
    return [];
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
        justifyContent="space-between"
        mb={3}
        sx={{ flexWrap: "wrap", gap: 2 }}
      >
        <Box textAlign="left">
          <Typography variant="h5" fontWeight={700} color="text.primary">
            Applicant Profile
          </Typography>
          <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ textTransform: 'uppercase', letterSpacing: '0.05rem' }}>
            ID: {id} • Tracking recruitment progress
          </Typography>
        </Box>
      </Stack>

      {/* Two Column Layout */}
      <Grid container spacing={3}>
        {/* Left Column - Applicant Details */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent sx={{ p: 2.5 }}>
              <Stack spacing={2.5}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <PersonIcon sx={{ color: "primary.main" }} />
                  <Typography variant="subtitle1" fontWeight={700}>
                    Personal Information
                  </Typography>
                </Stack>
                <Divider />

                {/* Content Rows */}
                <Grid container spacing={2.5}>
                  {[
                    { label: "Status", value: applicantDetails?.applicationStatus, icon: <FiberManualRecordIcon sx={{ fontSize: 10 }} />, isStatus: true },
                    { label: "Full Name", value: applicantDetails?.name, icon: <PersonIcon fontSize="small" /> },
                    { label: "Email Address", value: applicantDetails?.email, icon: <EmailIcon fontSize="small" /> },
                    { label: "Mobile Number", value: applicantDetails?.mobile, icon: <PhoneIcon fontSize="small" /> },
                    { label: "Qualification", value: applicantDetails?.applicantQualification, icon: <SchoolIcon fontSize="small" /> },
                    { label: "Work Experience", value: applicantDetails?.experienceYears !== undefined ? `${applicantDetails.experienceYears} years` : null, icon: <HistoryIcon fontSize="small" /> },
                    { label: "Applied On", value: applicantDetails?.appliedAt ? formatDate(applicantDetails.appliedAt) : null, icon: <EventIcon fontSize="small" /> },
                    { label: "Resident Address", value: applicantDetails?.address, icon: <HomeIcon fontSize="small" />, fullWidth: true },
                  ].map((item, idx) => item.value && (
                    <Grid item xs={12} sm={item.fullWidth ? 12 : 6} key={idx}>
                      <Stack direction="row" spacing={1.5} alignItems="flex-start">
                        <Box sx={{ color: "text.secondary", mt: 0.3 }}>{item.icon}</Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04rem', mb: 0.2 }}>
                            {item.label}
                          </Typography>
                          {item.isStatus ? (
                            <Chip
                              label={item.value}
                              size="small"
                              sx={{
                                height: 24,
                                fontWeight: 700,
                                fontSize: '0.7rem',
                                bgcolor: getStatusColor(item.value) === "success" ? "rgba(46, 125, 50, 0.08)" : getStatusColor(item.value) === "warning" ? "rgba(237, 108, 2, 0.08)" : "rgba(211, 47, 47, 0.08)",
                                color: getStatusColor(item.value) === "success" ? "#2e7d32" : getStatusColor(item.value) === "warning" ? "#ed6c02" : "#d32f2f",
                                border: `1px solid ${getStatusColor(item.value) === "success" ? "rgba(46, 125, 50, 0.2)" : getStatusColor(item.value) === "warning" ? "rgba(237, 108, 2, 0.2)" : "rgba(211, 47, 47, 0.2)"}`
                              }}
                            />
                          ) : (
                            <Typography variant="body2" fontWeight={600} color="text.primary">
                              {item.value}
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>

                {/* Cover Letter */}
                {applicantDetails?.coverLetter && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04rem', mb: 1 }}>
                      Cover Letter
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ lineHeight: 1.6, color: 'text.primary', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                        {applicantDetails.coverLetter}
                      </Typography>
                    </Paper>
                  </Box>
                )}

                {/* Applicant Documents */}
                {applicantDocs.length > 0 && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04rem', mb: 1.5 }}>
                      Attachments & Resume
                    </Typography>
                    <Grid container spacing={2}>
                      {applicantDocs.map((doc: any, index: number) => {
                        const docPath = typeof doc === "string" ? doc : doc.fileUrl || doc.docPath || "";
                        const fileName = typeof doc === "string" ? doc.split("/").pop() : doc.fileName || docPath.split("/").pop() || `Document ${index + 1}`;

                        // Construct full URL
                        const fileUrl = (() => {
                          if (!docPath) return "";
                          if (docPath.startsWith("http")) return docPath;
                          const baseUrl = (import.meta.env.VITE_CDN_URL || "").trim().replace(/\/$/, "");
                          const path = docPath.startsWith("/") ? docPath : `/${docPath}`;
                          return `${baseUrl}${path}`;
                        })();

                        const isImage = isImageFile(fileName, docPath);

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
                                    height: 100,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    bgcolor: "white",
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
                                        e.target.style.display = "none";
                                        e.target.parentElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor" style="color: var(--mui-palette-text-secondary);"><path d="M13 9H11V7H13V9ZM13 17H11V11H13V17ZM12 2C6.47 2 2 6.47 2 12C2 17.53 6.47 22 12 22C17.53 22 22 17.53 22 12C22 6.47 17.53 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"></path></svg>';
                                      }}
                                    />
                                  ) : (
                                    getFileIcon(fileName, docPath)
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
                                      WebkitLineClamp: 1,
                                      WebkitBoxOrient: "vertical",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      lineHeight: 1.3,
                                      fontWeight: 600,
                                      color: 'text.primary'
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
            <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
              <Stack spacing={2}>
                {/* Header with Link */}
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <WorkOutlineIcon sx={{ color: "primary.main" }} />
                    <Typography variant="subtitle1" fontWeight={700}>
                      Application Context
                    </Typography>
                  </Stack>
                  {jobDetails?.jobPostId && (
                    <Button
                      component={Link}
                      to={`/recruitment/jobs/${jobDetails.jobPostId}`}
                      variant="text"
                      size="small"
                      startIcon={<VisibilityIcon />}
                      sx={{ fontWeight: 600 }}
                    >
                      Job Detail
                    </Button>
                  )}
                </Stack>
                <Divider />

                <Grid container spacing={2}>
                  {[
                    { label: "Job Post", value: jobDetails?.jobPostName, icon: <FiberManualRecordIcon sx={{ fontSize: 8, color: 'primary.main' }} />, color: 'primary.main' },
                    { label: "Department", value: jobDetails?.departmentName, icon: <BusinessIcon fontSize="small" /> },
                    { label: "Designation", value: jobDetails?.designationName, icon: <WorkOutlineIcon fontSize="small" /> },
                    { label: "Required Education", value: jobDetails?.postQualification, icon: <SchoolIcon fontSize="small" /> },
                    { label: "Vacancies", value: jobDetails?.numberOfPost, icon: <GroupsIcon fontSize="small" /> },
                    { label: "Min Experience", value: jobDetails?.minimumExperience !== undefined ? `${jobDetails.minimumExperience} years` : null, icon: <HistoryIcon fontSize="small" /> },
                    { label: "Posting Period", value: jobDetails?.applicationStartDate && jobDetails?.applicationEndDate ? `${formatDate(jobDetails.applicationStartDate)} — ${formatDate(jobDetails.applicationEndDate)}` : null, icon: <EventIcon fontSize="small" /> },
                    { label: "Interview Date", value: jobDetails?.interviewDate ? formatDate(jobDetails.interviewDate) : null, icon: <RoomIcon fontSize="small" /> },
                  ].map((item, idx) => item.value && (
                    <Grid item xs={12} key={idx}>
                      <Stack direction="row" spacing={1.5} alignItems="flex-start">
                        <Box sx={{ color: "text.secondary", mt: 0.3 }}>{item.icon}</Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04rem', mb: 0.2 }}>
                            {item.label}
                          </Typography>
                          <Typography variant="body2" fontWeight={600} color={item.color || "text.primary"}>
                            {item.value}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
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

