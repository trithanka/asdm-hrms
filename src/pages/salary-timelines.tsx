import { IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

type SalaryTimelineApiRow = {
  pklSalaryMonthTrackID: number;
  generateMonth: string;
  submittedDate: string;
  submittedBy: number;
  comment: string;
  verifyStatus: string;
  roleId: number;
  trackStep: number | null;
  fklSalarystructureType: number;
  created_at: string;
  updated_at: string;
};

export default function SalaryTimelinesPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const timelineResponse = location.state?.timelineData;
  const timelineRows: SalaryTimelineApiRow[] = Array.isArray(timelineResponse?.data)
    ? timelineResponse.data
    : [];

  const roleLabel = (roleId: number) => {
    if (roleId === 98) return "HR";
    if (roleId === 36) return "Finance";
    return `Role ${roleId}`;
  };

  const formatDateTime = (value: string) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;

    // Keep API timestamp clock as-is (UTC parts), avoid local timezone shift.
    const day = String(d.getUTCDate()).padStart(2, "0");
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const year = d.getUTCFullYear();
    const hour24 = d.getUTCHours();
    const minute = String(d.getUTCMinutes()).padStart(2, "0");
    const ampm = hour24 >= 12 ? "pm" : "am";
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    const hour = String(hour12).padStart(2, "0");

    return `${day}/${month}/${year}, ${hour}:${minute} ${ampm}`;
  };

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
            {timelineRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} sx={{ border: "1px solid #e0e0e0", textAlign: "center", py: 3 }}>
                  No timeline data found
                </TableCell>
              </TableRow>
            ) : timelineRows.map((row) => (
              <TableRow key={row.pklSalaryMonthTrackID}>
                <TableCell sx={{ border: "1px solid #e0e0e0" }}>
                  {row.submittedBy} ({roleLabel(row.roleId)})
                </TableCell>
                <TableCell sx={{ border: "1px solid #e0e0e0" }}>{row.comment}</TableCell>
                <TableCell sx={{ border: "1px solid #e0e0e0" }}>
                  {row.verifyStatus} (Step {row.trackStep ?? 1})
                </TableCell>
                <TableCell sx={{ border: "1px solid #e0e0e0" }}>
                  {formatDateTime(row.created_at || row.updated_at || row.submittedDate)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
