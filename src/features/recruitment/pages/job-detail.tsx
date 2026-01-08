import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
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
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InfoIcon from "@mui/icons-material/Info";
import PersonIcon from "@mui/icons-material/Person";
import DescriptionIcon from "@mui/icons-material/Description";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import BusinessIcon from "@mui/icons-material/Business";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import HistoryIcon from "@mui/icons-material/History";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { fetchJobPostById } from "../../../api/recruitment/recruitment-api";
import { formatDate } from "../../../utils/formatter";
import { FaBriefcase } from "react-icons/fa";

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["jobPost", id],
    queryFn: () => fetchJobPostById(id!),
    enabled: !!id,
    retry: false,
  });

  const jobPost = data?.data?.jobPost;
  const applicants = data?.data?.applicants || [];

  // Parse document paths (they come as JSON strings or direct arrays)
  const parseDocuments = (docPath: any) => {
    if (!docPath) return [];
    if (Array.isArray(docPath)) return docPath;
    try {
      const parsed = JSON.parse(docPath);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const jobDocs = parseDocuments(jobPost?.jobDocPath);
  // Generate summary list for the Info card
  const getJobDetails = () => {
    return [
      { label: "Department", value: jobPost?.department, icon: <BusinessIcon fontSize="small" /> },
      { label: "Designation", value: jobPost?.designation, icon: <WorkOutlineIcon fontSize="small" /> },
      { label: "Qualification Required", value: jobPost?.qualification, icon: <SchoolIcon fontSize="small" /> },
      { label: "Number of Vacancies", value: jobPost?.numberOfPost, icon: <GroupsIcon fontSize="small" /> },
      { label: "Minimum Experience", value: jobPost?.minExperience !== undefined ? `${jobPost.minExperience} year${jobPost.minExperience > 1 ? 's' : ''}` : null, icon: <HistoryIcon fontSize="small" /> },
      { label: "Interview Date", value: jobPost?.interviewAt ? formatDate(jobPost.interviewAt) : null, icon: <EventIcon fontSize="small" /> },
      { label: "Interview Address", value: jobPost?.interviewAddress, icon: <LocationOnIcon fontSize="small" />, fullWidth: true },
    ].filter(item => item.value);
  };

  const jobDetails = getJobDetails();

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "warning";
      case "shortlisted":
      case "shortlist":
        return "success";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

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
          Error loading job post details. Please try again.
        </Typography>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Stack>
    );
  }

  // Determine if job is open or closed
  const isOpen = jobPost?.postStatus === "Enabled";
  const today = new Date();
  const endDate = jobPost?.endDate ? new Date(jobPost.endDate) : null;
  const interviewDate = jobPost?.interviewAt ? new Date(jobPost.interviewAt) : null;
  const isClosed = endDate && endDate < today;

  return (
    <Paper elevation={0} sx={{ bgcolor: "transparent" }}>

      {/* Job Title and Status */}

      <Typography variant="h5" fontWeight={700} color="text.primary" mb={1}>
        {jobPost?.name || "Job Post Information"}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={1.5} mb={3} sx={{ flexWrap: "wrap" }}>
        {/* Status Badge */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1.5,
            py: 0.5,
            borderRadius: "20px",
            fontSize: "0.75rem",
            fontWeight: 600,
            bgcolor: isOpen && !isClosed ? "rgba(46, 125, 50, 0.08)" : "rgba(108, 117, 125, 0.08)",
            color: isOpen && !isClosed ? "#2e7d32" : "#6c757d",
            border: `1px solid ${isOpen && !isClosed ? "rgba(46, 125, 50, 0.2)" : "rgba(108, 117, 125, 0.2)"}`,
          }}
        >
          <FiberManualRecordIcon sx={{ fontSize: 10, color: isOpen && !isClosed ? "#2e7d32" : "#6c757d" }} />
          {isOpen && !isClosed ? "OPEN" : "CLOSED"}
        </Box>

        {/* Designation Badge */}
        {jobPost?.designation && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: 0.5,
              borderRadius: "20px",
              fontSize: "0.75rem",
              fontWeight: 500,
              bgcolor: "rgba(25, 118, 210, 0.06)",
              color: "#1976d2",
              border: "1px solid rgba(25, 118, 210, 0.15)",
            }}
          >
            <WorkOutlineIcon sx={{ fontSize: 16 }} />
            {jobPost.designation}
          </Box>
        )}

        {/* Department Badge */}
        {jobPost?.department && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: 0.5,
              borderRadius: "20px",
              fontSize: "0.75rem",
              fontWeight: 500,
              bgcolor: "rgba(156, 39, 176, 0.06)",
              color: "#9c27b0",
              border: "1px solid rgba(156, 39, 176, 0.15)",
            }}
          >
            <BusinessIcon sx={{ fontSize: 16 }} />
            {jobPost.department}
          </Box>
        )}
      </Stack>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={activeTab} onChange={(_e, newValue) => setActiveTab(newValue)}>
          <Tab icon={<FaBriefcase />} iconPosition="start" sx={{ minHeight: 'auto', fontSize: '.75rem' }} label="Overview" />
          <Tab icon={<PersonIcon />} iconPosition="start" sx={{ minHeight: 'auto', fontSize: '.75rem' }} label={`Applications (${applicants.length})`} />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Stack spacing={2}>
          {/* Info Section */}
          <Card variant="outlined">
            <CardContent sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} mb={1.5}>
                <InfoIcon sx={{ color: "primary.main", fontSize: 20 }} />
                <Typography variant="subtitle1" fontWeight={700}>
                  Job Information
                </Typography>
              </Stack>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={3}>
                {jobDetails.map((item, index) => (
                  <Grid item xs={12} sm={item.fullWidth ? 12 : 6} md={item.fullWidth ? 12 : 4} key={index}>
                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                      <Box sx={{ color: "text.secondary", mt: 0.2 }}>
                        {item.icon}
                      </Box>
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: "block",
                            mb: 0.2,
                            textTransform: "uppercase",
                            letterSpacing: "0.05rem",
                            fontWeight: 700
                          }}
                        >
                          {item.label}
                        </Typography>
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                          {item.value}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Hiring Period Section */}
          <Card variant="outlined">
            <CardContent sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} mb={1}>
                <AccessTimeIcon sx={{ fontSize: 20 }} />
                <Typography variant="subtitle1" fontWeight={700}>
                  Hiring Period
                </Typography>

                {interviewDate && interviewDate >= today && (
                  <Box sx={{ ml: "auto" }}>
                    <Typography variant="body2" color="primary.main" fontWeight={600} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      Interview in {Math.ceil((interviewDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))} day(s)
                    </Typography>
                  </Box>
                )}
              </Stack>
              <Divider sx={{ mb: 2.5 }} />
              <Stack direction="row" alignItems="center" spacing={3} sx={{ flexWrap: "wrap", gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem", display: "block", mb: 0.5 }}>
                    Application Start Date
                  </Typography>
                  <Typography variant="body2" fontWeight={700} color="text.primary">
                    {jobPost?.startDate ? formatDate(jobPost.startDate) : "N/A"}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', color: "divider", px: 2 }}>
                  <Box sx={{ width: 40, height: 2, bgcolor: 'divider', position: 'relative' }}>
                    <Box sx={{
                      position: 'absolute',
                      right: -5,
                      top: -4,
                      width: 10,
                      height: 10,
                      borderTop: '2px solid',
                      borderRight: '2px solid',
                      borderColor: 'divider',
                      transform: 'rotate(45deg)'
                    }} />
                  </Box>
                </Box>

                <Box sx={{ px: 3 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem", display: "block", mb: 0.5, fontWeight: 700, textTransform: 'uppercase' }}>
                    Application End Date
                  </Typography>
                  <Typography variant="body2" fontWeight={700} color="text.primary">
                    {jobPost?.endDate ? formatDate(jobPost.endDate) : "N/A"}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', color: "divider", px: 2 }}>
                  <Box sx={{ width: 40, height: 2, bgcolor: 'divider', position: 'relative' }}>
                    <Box sx={{
                      position: 'absolute',
                      right: -5,
                      top: -4,
                      width: 10,
                      height: 10,
                      borderTop: '2px solid',
                      borderRight: '2px solid',
                      borderColor: 'divider',
                      transform: 'rotate(45deg)'
                    }} />
                  </Box>
                </Box>

                <Box sx={{ pl: 3 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem", display: "block", mb: 0.5, fontWeight: 700, textTransform: 'uppercase' }}>
                    Interview Date
                  </Typography>
                  <Typography variant="body2" fontWeight={700} color="text.primary">
                    {jobPost?.interviewAt ? formatDate(jobPost.interviewAt) : "N/A"}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* About this job Section */}
          <Card variant="outlined">
            <CardContent sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
                <DescriptionIcon sx={{ color: "primary.main", fontSize: 20 }} />
                <Typography variant="subtitle1" fontWeight={700}>
                  About this job
                </Typography>
              </Stack>
              <Divider sx={{ mb: 2.5 }} />

              {/* Job Description */}
              {jobPost?.description && (
                <Typography
                  variant="body2"
                  sx={{
                    lineHeight: 1.7,
                    color: "text.primary",
                    whiteSpace: "pre-wrap",
                    mb: 0,
                  }}
                >
                  {jobPost.description}
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Documents/Advertisements Section */}
          {jobDocs.length > 0 && (
            <Card variant="outlined">
              <CardContent sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
                  <DescriptionIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Documents / Advertisements
                  </Typography>
                </Stack>
                <Divider sx={{ mb: 2.5 }} />
                <Grid container spacing={2}>
                  {jobDocs.map((doc: any, index: number) => {
                    const docPath = typeof doc === "string" ? doc : doc.fileUrl || "";
                    const docName = typeof doc === "string" ? doc.split("/").pop() : doc.fileName || `Document ${index + 1}`;
                    // Construct full URL with ds1.skillmissionassam.org domain
                    const docUrl = (() => {
                      if (!docPath) return "";
                      if (docPath.startsWith("http")) return docPath;
                      const baseUrl = (import.meta.env.VITE_CDN_URL || "").trim().replace(/\/$/, "");
                      const path = docPath.startsWith("/") ? docPath : `/${docPath}`;
                      return `${baseUrl}${path}`;
                    })();

                    return (
                      <Grid item xs={6} sm={4} md={3} key={index}>
                        <Box
                          component="a"
                          href={docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            display: "block",
                            textDecoration: "none",
                            color: "inherit",
                          }}
                        >
                          <Card variant="outlined" sx={{ "&:hover": { boxShadow: 2, borderColor: 'primary.main' }, transition: 'all 0.2s' }}>
                            <CardContent sx={{ p: 2, textAlign: "center" }}>
                              <Stack spacing={1} alignItems="center">
                                <InsertDriveFileIcon color="primary" sx={{ fontSize: 32 }} />
                                <Typography variant="caption" sx={{ wordBreak: "break-word", fontWeight: 600, color: 'text.primary' }}>
                                  {docName}
                                </Typography>
                              </Stack>
                            </CardContent>
                          </Card>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              </CardContent>
            </Card>
          )}
        </Stack>
      )}

      {/* Applications Tab */}
      {activeTab === 1 && (
        <Box>
          {applicants.length > 0 ? (
            <Paper variant="outlined">
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {[
                        "#",
                        "Name",
                        "Email",
                        "Mobile",
                        "Experience",
                        "Qualification",
                        "Applied Date",
                        "Status",
                        "Action"
                      ].map((header) => (
                        <TableCell
                          key={header}
                          sx={{
                            fontWeight: 700,
                            fontSize: "0.7rem",
                            textTransform: "uppercase",
                            bgcolor: "#f8f9fa",
                            color: "text.secondary",
                            py: 1.5,
                            borderBottom: "2px solid",
                            borderColor: "divider",
                            letterSpacing: "0.02rem"
                          }}
                        >
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {applicants.map((applicant, index) => (
                      <TableRow key={applicant.id} hover>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {applicant.name || "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell>{applicant.email || "N/A"}</TableCell>
                        <TableCell>{applicant.mobile || "N/A"}</TableCell>
                        <TableCell>{applicant.experience ?? "N/A"} {applicant.experience ? "years" : ""}</TableCell>
                        <TableCell>{applicant.qualification || "N/A"}</TableCell>
                        <TableCell>
                          {applicant.appliedAt ? formatDate(applicant.appliedAt) : "N/A"}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={applicant.status || "N/A"}
                            size="small"
                            color={getStatusColor(applicant.status || "")}
                            sx={{
                              height: 20,
                              fontSize: "0.7rem",
                              "& .MuiChip-label": { px: 1 },
                              bgcolor: getStatusColor(applicant.status || "") === "success"
                                ? "rgba(46, 125, 50, 0.1)"
                                : getStatusColor(applicant.status || "") === "warning"
                                  ? "rgba(237, 108, 2, 0.1)"
                                  : getStatusColor(applicant.status || "") === "error"
                                    ? "rgba(211, 47, 47, 0.1)"
                                    : "rgba(158, 158, 158, 0.1)",
                              color: getStatusColor(applicant.status || "") === "success"
                                ? "rgb(46, 125, 50)"
                                : getStatusColor(applicant.status || "") === "warning"
                                  ? "rgb(237, 108, 2)"
                                  : getStatusColor(applicant.status || "") === "error"
                                    ? "rgb(211, 47, 47)"
                                    : "rgb(97, 97, 97)",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            component={Link}
                            to={`/recruitment/applicants/${applicant.id}`}
                            size="small"
                            variant="text"
                            startIcon={<VisibilityIcon sx={{ fontSize: 18 }} />}
                            sx={{ textTransform: 'none', fontWeight: 600 }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          ) : (
            <Paper variant="outlined">
              <CardContent>
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  py={6}
                  spacing={2}
                >
                  <PersonIcon
                    sx={{ fontSize: 48, color: "text.disabled" }}
                  />

                  <Typography variant="h6" color="text.primary">
                    No Applicants Found
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                    sx={{ maxWidth: 280 }}
                  >
                    There are currently no applications submitted for this job post.
                    Please check back later.
                  </Typography>
                </Stack>
              </CardContent>
            </Paper>
          )}
        </Box>
      )}
    </Paper>
  );
}

