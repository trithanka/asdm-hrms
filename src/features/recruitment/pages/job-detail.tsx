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
  List,
  ListItem,
  ListItemText,
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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InfoIcon from "@mui/icons-material/Info";
import PersonIcon from "@mui/icons-material/Person";
import DescriptionIcon from "@mui/icons-material/Description";
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

  const jobDocs = jobPost?.jobDocPath ? parseDocuments(jobPost.jobDocPath) : [];

  // Generate summary list from job details
  const generateJobSummary = () => {
    const items: string[] = [];

    if (jobPost?.department) {
      items.push(`Department: ${jobPost.department}`);
    }

    if (jobPost?.designation) {
      items.push(`Designation: ${jobPost.designation}`);
    }

    if (jobPost?.qualification) {
      items.push(`Qualification Required: ${jobPost.qualification}`);
    }

    if (jobPost?.numberOfPost) {
      items.push(`Number of Vacancies: ${jobPost.numberOfPost}`);
    }

    if (jobPost?.minExperience !== undefined) {
      items.push(`Minimum Experience: ${jobPost.minExperience} year${jobPost.minExperience > 1 ? 's' : ''}`);
    }

    if (jobPost?.interviewType) {
      items.push(`Interview Type: ${jobPost.interviewType}`);
    }

    if (jobPost?.interviewAt) {
      items.push(`Interview Date: ${formatDate(jobPost.interviewAt)}`);
    }

    if (jobPost?.interviewAddress) {
      items.push(`Interview Address: ${jobPost.interviewAddress}`);
    }

    return items;
  };

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
  const isClosed = endDate && endDate < today;

  // Generate summary list once
  const jobSummaryItems = generateJobSummary();

  return (
    <Paper elevation={0} sx={{ bgcolor: "transparent" }}>
      {/* Header with Back Button */}
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ minWidth: "auto" }}
        >
          Back
        </Button>
      </Stack>

      {/* Job Title and Status */}

      <Typography variant="h4" fontWeight={600} mb={1}>
          {jobPost?.name || "Job Post Information"}
        </Typography>
      <Stack direction="row" alignItems="center" spacing={0} mb={2} sx={{ flexWrap: "wrap", gap: 1 }}>
        <Chip
          label={isOpen && !isClosed ? "Open" : "Closed"}
          color={isOpen && !isClosed ? "success" : "default"}
          sx={{
            height: 28,
            fontSize: "0.875rem",
            fontWeight: 500,
            bgcolor: isOpen && !isClosed ? "rgba(46, 125, 50, 0.1)" : "rgba(158, 158, 158, 0.1)",
            color: isOpen && !isClosed ? "rgb(46, 125, 50)" : "rgb(97, 97, 97)",
          }}
        />
        {jobPost?.designation && (
          <Chip
            label={`Created By: ${jobPost.designation}`}
            variant="outlined"
            size="small"
            sx={{ height: 28 }}
          />
        )}
        {jobPost?.department && (
          <Chip
            label={`Department: ${jobPost.department}`}
            variant="outlined"
            size="small"
            sx={{ height: 28 }}
          />
        )}
      </Stack>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={activeTab} onChange={(_e, newValue) => setActiveTab(newValue)}>
          <Tab icon={<FaBriefcase />} iconPosition="start" sx={{ minHeight: 'auto', fontSize: '.75rem' }} label="Job Info" />
          <Tab icon={<PersonIcon />} iconPosition="start" sx={{ minHeight: 'auto', fontSize: '.75rem' }} label={`Applications (${applicants.length})`} />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Stack spacing={1}>

          {/* Hiring Period Section */}
          <Card variant="outlined">
            <CardContent sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
                <AccessTimeIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                <Typography variant="h7" fontWeight={600}>
                  Hiring period
                </Typography>
              </Stack>
              <Divider sx={{ mb: 2.5 }} />
              <Stack direction="row" alignItems="center" spacing={3} sx={{ flexWrap: "wrap", gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem", display: "block", mb: 0.5 }}>
                    Posted at
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {jobPost?.startDate ? formatDate(jobPost.startDate) : "N/A"}
                  </Typography>
                </Box>
                <Box sx={{ color: "text.secondary" }}>→</Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem", display: "block", mb: 0.5 }}>
                    Closed at
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {jobPost?.endDate ? formatDate(jobPost.endDate) : "N/A"}
                  </Typography>
                </Box>
                {endDate && endDate >= today && (
                  <Box sx={{ ml: "auto" }}>
                    <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <AccessTimeIcon sx={{ fontSize: 16 }} />
                      {Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))} Days to go
                    </Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>

          {/* About this job Section */}
          <Card variant="outlined">
            <CardContent sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
                <InfoIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                <Typography variant="h7" fontWeight={600}>
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
                    mb: jobSummaryItems.length > 0 ? 2.5 : 0,
                  }}
                >
                  {jobPost.description}
                </Typography>
              )}

              {/* Dynamic Summary List */}
              {jobSummaryItems.length > 0 && (
                <Box sx={{ mt: jobPost?.description ? 2.5 : 0 }}>
                  <List dense sx={{ py: 0 }}>
                    {jobSummaryItems.map((item, index) => (
                      <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                        <ListItemText
                          primary={item}
                          primaryTypographyProps={{
                            variant: "body2",
                            sx: { lineHeight: 1.7 },
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Documents/Advertisements Section */}
          {jobDocs.length > 0 && (
            <Card variant="outlined">
              <CardContent sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
                  <DescriptionIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                  <Typography variant="h7" fontWeight={600}>
                    Documents / Advertisements
                  </Typography>
                </Stack>
                <Divider sx={{ mb: 2.5 }} />
                <Grid container spacing={2}>
                  {jobDocs.map((doc: any, index: number) => {
                    const docUrl = typeof doc === "string" ? doc : doc.fileUrl || "";
                    const docName = typeof doc === "string" ? doc.split("/").pop() : doc.fileName || `Document ${index + 1}`;
                    
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
                          <Card variant="outlined" sx={{ "&:hover": { boxShadow: 2 } }}>
                            <CardContent sx={{ p: 1.5, textAlign: "center" }}>
                              <Typography variant="caption" sx={{ wordBreak: "break-word" }}>
                                {docName}
                              </Typography>
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
                      <TableCell sx={{ fontWeight: 600, fontSize: "0.65rem", textTransform: 'uppercase', bgcolor: '#eee', color: '#555' }}>#</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: "0.65rem", textTransform: 'uppercase', bgcolor: '#eee', color: '#555' }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: "0.65rem", textTransform: 'uppercase', bgcolor: '#eee', color: '#555' }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: "0.65rem", textTransform: 'uppercase', bgcolor: '#eee', color: '#555' }}>Mobile</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: "0.65rem", textTransform: 'uppercase', bgcolor: '#eee', color: '#555' }}>Experience</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: "0.65rem", textTransform: 'uppercase', bgcolor: '#eee', color: '#555' }}>Qualification</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: "0.65rem", textTransform: 'uppercase', bgcolor: '#eee', color: '#555' }}>Applied Date</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: "0.65rem", textTransform: 'uppercase', bgcolor: '#eee', color: '#555' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: "0.65rem", textTransform: 'uppercase', bgcolor: '#eee', color: '#555' }}>Action</TableCell>
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
                            variant="outlined"
                            startIcon={<VisibilityIcon />}
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
                <Stack alignItems="center" justifyContent="center" py={4} spacing={2}>
                  <Typography variant="h7" color="text.secondary">
                    No Applicants Yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This job has no applicants at the moment.
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

