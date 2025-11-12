import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Input,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  fetchAllJobPosts,
  fetchRecruitmentMasterData,
} from "../../../api/recruitment/recruitment-api";
import { formatDate } from "../../../utils/formatter";
import AddJobPost from "../components/add-job-post";

export default function JobList() {
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [filters, setFilters] = useState({
    designation: "",
    department: "",
  });

  // Fetch master data for filters
  const { data: masterData } = useQuery({
    queryKey: ["recruitmentMaster"],
    queryFn: fetchRecruitmentMasterData,
    retry: false,
  });

  // Build filter params for API
  const filterParams = useMemo(() => {
    const params: {
      search?: string;
      designation?: string;
      department?: string;
    } = {};

    if (searchInput.trim()) {
      params.search = searchInput.trim();
    }
    if (filters.designation) {
      params.designation = filters.designation;
    }
    if (filters.department) {
      params.department = filters.department;
    }

    return params;
  }, [searchInput, filters]);

  // Fetch job posts with filters
  const { data, isLoading, error } = useQuery({
    queryKey: ["jobPosts", filterParams],
    queryFn: () => fetchAllJobPosts(filterParams),
    retry: false,
  });

  const jobPosts = data?.data || [];

  // Pagination
  const totalPages = Math.ceil(jobPosts.length / pageSize);
  const paginatedJobPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return jobPosts.slice(startIndex, startIndex + pageSize);
  }, [jobPosts, currentPage, pageSize]);

  // Handlers
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setFilters({
      designation: "",
      department: "",
    });
    setSearchInput("");
    setCurrentPage(1);
  };

  const hasActiveFilters = () => {
    return (
      filters.designation !== "" ||
      filters.department !== "" ||
      searchInput.trim() !== ""
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setCurrentPage(1);
    }
  };

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  if (isLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" py={8}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary" mt={2}>
          Loading job posts...
        </Typography>
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack alignItems="center" justifyContent="center" py={8}>
        <Typography variant="body2" color="error">
          Error loading job posts. Please try again.
        </Typography>
      </Stack>
    );
  }
    
return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Job Posts
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and track all job postings in one place
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddDialog(true)}
          sx={{ bgcolor: "#10b981", "&:hover": { bgcolor: "#059669" } }}
        >
          Create New Job Post
        </Button>
      </Stack>

      {/* Search and Filters */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Stack direction={{ xs: "column", lg: "row" }} spacing={3}>
          {/* Search Input */}
          <Box sx={{ flex: 1, maxWidth: 400 }}>
            <Input
              fullWidth
              placeholder="Search by job name, designation, location..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleSearchKeyPress}
              startAdornment={
                <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
              }
              sx={{ fontSize: "0.875rem" }}
            />
          </Box>

          {/* Filters */}
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {/* Designation Filter */}
            <Select
              value={filters.designation || "all"}
              onChange={(e) =>
                handleFilterChange(
                  "designation",
                  e.target.value === "all" ? "" : e.target.value
                )
              }
              displayEmpty
              size="small"
              sx={{ minWidth: 150, fontSize: "0.875rem" }}
            >
              <MenuItem value="all">All Designations</MenuItem>
              {masterData?.designation?.map((designation) => (
                <MenuItem
                  key={designation.designationId}
                  value={designation.designationId.toString()}
                >
                  {designation.designationName}
                </MenuItem>
              ))}
            </Select>

            {/* Department Filter */}
            <Select
              value={filters.department || "all"}
              onChange={(e) =>
                handleFilterChange(
                  "department",
                  e.target.value === "all" ? "" : e.target.value
                )
              }
              displayEmpty
              size="small"
              sx={{ minWidth: 150, fontSize: "0.875rem" }}
            >
              <MenuItem value="all">All Departments</MenuItem>
              {masterData?.department?.map((department) => (
                <MenuItem
                  key={department.internalDepartmentId}
                  value={department.internalDepartmentId.toString()}
                >
                  {department.internalDepartmentName}
                </MenuItem>
              ))}
            </Select>

            {/* Clear Filters Button */}
            {hasActiveFilters() && (
              <IconButton
                size="small"
                  onClick={clearAllFilters}
                sx={{ color: "text.secondary" }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>
        </Stack>
      </Paper>

  {/* Table */}
      {paginatedJobPosts.length > 0 ? (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem" }}>
                  #
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem" }}>
                  Job Post Name
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem" }}>
                  Designation
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem" }}>
                  Department
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem" }}>
                  No. of Posts
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem" }}>
                  Application Start
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem" }}>
                  Application End
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem" }}>
                  Interview Date
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem" }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedJobPosts.map((job, index) => (
                <TableRow
                  key={job.pklHrmsJobPostId}
                  hover
                  sx={{ "&:hover": { bgcolor: "action.hover" } }}
                >
                  <TableCell>
                    {(currentPage - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ color: "primary.main", fontWeight: 500 }}
                    >
                      {job.vsJobPostName || "N/A"}
                    </Typography>
                  </TableCell>
                  <TableCell>{job.vsDesignationName || "N/A"}</TableCell>
                  <TableCell>
                    {masterData?.department?.find(
                      (dept) => dept.internalDepartmentId === job.fklDepartmentId
                    )?.internalDepartmentName || "N/A"}
                  </TableCell>
                  <TableCell>{job.iNumberOfPost || "N/A"}</TableCell>
                  <TableCell>
                    {job.dtApplicationStartDate
                      ? formatDate(job.dtApplicationStartDate)
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {job.dtApplicationEndDate
                      ? formatDate(job.dtApplicationEndDate)
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {job.dtInterviewAt ? formatDate(job.dtInterviewAt) : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={job.bEnable === 1 ? "Active" : "Inactive"}
                      size="small"
                      color={job.bEnable === 1 ? "success" : "default"}
                      sx={{
                        height: 20,
                        fontSize: "0.7rem",
                        "& .MuiChip-label": { px: 1 },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      component={Link}
                      to={`/recruitment/jobs/${job.pklHrmsJobPostId}`}
                      size="small"
                      sx={{ color: "text.secondary" }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

  {/* Pagination */}
  {totalPages > 1 && (
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              p={2}
              borderTop={1}
              borderColor="divider"
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  Rows per page:
                </Typography>
                <Select
          value={pageSize}
                  onChange={(e) =>
                    handlePageSizeChange(Number(e.target.value))
                  }
                  size="small"
                  sx={{ minWidth: 70, fontSize: "0.875rem" }}
        >
          {[10, 25, 50, 100].map((num) => (
                    <MenuItem key={num} value={num}>
              {num}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={2}>
                <Button
                  variant="outlined"
                  size="small"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
                </Button>
                <Typography variant="body2" color="text.secondary">
                  Page <strong>{currentPage}</strong> of{" "}
                  <strong>{totalPages}</strong>
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
                </Button>
              </Stack>
            </Stack>
          )}
        </TableContainer>
      ) : (
        /* No Data Found Section */
        <Stack alignItems="center" justifyContent="center" py={8} spacing={2}>
          <Box
            component="svg"
            sx={{ width: 128, height: 128, color: "grey.300" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
          </Box>
          <Typography variant="h6" color="text.primary" fontWeight={500}>
            No Job Posts Found
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            There are no job posts at the moment.
            <br /> Start by creating a new job post to get started.
          </Typography>
        </Stack>
      )}

      {/* Add Job Post Dialog */}
      <AddJobPost
        open={openAddDialog}
        closeHandler={() => setOpenAddDialog(false)}
      />
    </Paper>
  );
}
  