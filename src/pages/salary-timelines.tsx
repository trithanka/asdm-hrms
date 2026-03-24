import { IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const timelineDummyData = [
  {
    id: 1,
    lastActionBy: "Ritika Das",
    designation: "HR",
    comment: "Attendance verified and payroll draft prepared.",
    status: "Pending Finance Review",
    dateOfAction: "24-03-2026 10:15 AM",
  },
  {
    id: 2,
    lastActionBy: "Abhijit Kalita",
    designation: "Finance",
    comment: "Reviewed salary components and approved disbursement.",
    status: "Approved",
    dateOfAction: "24-03-2026 11:05 AM",
  },
  {
    id: 3,
    lastActionBy: "Nabanita Devi",
    designation: "HR",
    comment: "Updated arrear entries for two employees.",
    status: "Revised",
    dateOfAction: "24-03-2026 12:20 PM",
  },
  {
    id: 4,
    lastActionBy: "Partha Bhuyan",
    designation: "Finance",
    comment: "Final verification completed and marked for release.",
    status: "Released",
    dateOfAction: "24-03-2026 01:40 PM",
  },
];

export default function SalaryTimelinesPage() {
  const navigate = useNavigate();

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton
          aria-label="Go back"
          onClick={() => navigate("/salary-transfer")}
          sx={{ border: "1px solid #d9d9d9", borderRadius: 1 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M14.5 5L7.5 12L14.5 19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "primary.main" }}>
          Employee Wise Payroll Timelines
        </Typography>
      </Stack>

      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <Table size="small" sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, bgcolor: "#f1f1f1", border: "1px solid #e0e0e0" }}>
                Last Action By
              </TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: "#f1f1f1", border: "1px solid #e0e0e0" }}>
                Comment
              </TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: "#f1f1f1", border: "1px solid #e0e0e0" }}>
                Status
              </TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: "#f1f1f1", border: "1px solid #e0e0e0" }}>
                Date Of Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {timelineDummyData.map((row) => (
              <TableRow key={row.id}>
                <TableCell sx={{ border: "1px solid #e0e0e0" }}>
                  {row.lastActionBy} ({row.designation})
                </TableCell>
                <TableCell sx={{ border: "1px solid #e0e0e0" }}>{row.comment}</TableCell>
                <TableCell sx={{ border: "1px solid #e0e0e0" }}>{row.status}</TableCell>
                <TableCell sx={{ border: "1px solid #e0e0e0" }}>{row.dateOfAction}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
