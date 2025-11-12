import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import { fetchAllApplicants } from "../../../api/recruitment/recruitment-api";
import { formatDate } from "../../../utils/formatter";

export default function Applicants() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch applicants
  const { data, isLoading, error } = useQuery({
    queryKey: ["applicants"],
    queryFn: fetchAllApplicants,
    retry: false,
  });

  const applicants = data?.data || [];

  // Pagination
  const totalPages = Math.ceil(applicants.length / pageSize);
  const paginatedApplicants = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return applicants.slice(startIndex, startIndex + pageSize);
  }, [applicants, currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "warning";
      case "approved":
      case "accepted":
        return "success";
      case "rejected":
      case "declined":
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

  if (error) {
    return (
      <Stack alignItems="center" justifyContent="center" py={8}>
        <Typography color="error">
          Error loading applicants. Please try again.
        </Typography>
      </Stack>
    );
  }

  return (
    <Paper elevation={0} sx={{ bgcolor: "transparent", p: { xs: 2, md: 3 } }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        mb={3}
        spacing={{ xs: 2, sm: 0 }}
      >
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Applicants
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View and manage all job applications
          </Typography>
        </Box>
      </Stack>

      {/* Table */}
      {paginatedApplicants.length > 0 ? (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem" }}>
                  #
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem" }}>
                  Name
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem" }}>
                  Email
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem" }}>
                  Job Post
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem" }}>
                  Apply Date
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
              {paginatedApplicants.map((applicant, index) => (
                <TableRow
                  key={applicant.pklApplicationId}
                  hover
                  sx={{ "&:hover": { bgcolor: "action.hover" } }}
                >
                  <TableCell>
                    {(currentPage - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {applicant.vsName || "N/A"}
                    </Typography>
                  </TableCell>
                  <TableCell>{applicant.vsEmail || "N/A"}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ color: "primary.main", fontWeight: 500 }}
                    >
                      {applicant.vsJobPostName || "N/A"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {applicant.dtAppliedAt
                      ? formatDate(applicant.dtAppliedAt)
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={applicant.vsApplicationStatus || "N/A"}
                      size="small"
                      color={getStatusColor(
                        applicant.vsApplicationStatus || ""
                      )}
                      sx={{
                        height: 20,
                        fontSize: "0.7rem",
                        "& .MuiChip-label": { px: 1 },
                        bgcolor: getStatusColor(applicant.vsApplicationStatus || "") === "success" 
                          ? "rgba(46, 125, 50, 0.1)" 
                          : getStatusColor(applicant.vsApplicationStatus || "") === "warning"
                          ? "rgba(237, 108, 2, 0.1)"
                          : getStatusColor(applicant.vsApplicationStatus || "") === "error"
                          ? "rgba(211, 47, 47, 0.1)"
                          : "rgba(158, 158, 158, 0.1)",
                        color: getStatusColor(applicant.vsApplicationStatus || "") === "success"
                          ? "rgb(46, 125, 50)"
                          : getStatusColor(applicant.vsApplicationStatus || "") === "warning"
                          ? "rgb(237, 108, 2)"
                          : getStatusColor(applicant.vsApplicationStatus || "") === "error"
                          ? "rgb(211, 47, 47)"
                          : "rgb(97, 97, 97)",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      sx={{ color: "text.secondary" }}
                      onClick={() => {
                        navigate(`/recruitment/applicants/${applicant.pklApplicationId}`);
                      }}
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
                <select
                  value={pageSize}
                  onChange={(e) =>
                    handlePageSizeChange(Number(e.target.value))
                  }
                  style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    fontSize: "0.875rem",
                  }}
                >
                  {[10, 25, 50, 100].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1}>
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </Box>
          <Typography variant="h6" color="text.primary" fontWeight={500}>
            No Applicants Found
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            There are no applicants at the moment.
          </Typography>
        </Stack>
      )}
    </Paper>
  );
  }
  