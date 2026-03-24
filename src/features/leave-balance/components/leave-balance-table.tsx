import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import {
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent } from "react";
import { LeaveBalanceRow, LeaveFieldErrors } from "../types";

type LeaveBalanceTableProps = {
  rows: LeaveBalanceRow[];
  savedRowIds: string[];
  fieldErrors: LeaveFieldErrors;
  totalEmployees: number;
  page: number;
  rowsPerPage: number;
  isSubmitting: boolean;
  getYearLabel: (yearId: string) => string;
  isMale: (gender: string) => boolean;
  isFemale: (gender: string) => boolean;
  onFieldChange: (
    id: string,
    field: keyof LeaveBalanceRow
  ) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSaveRow: (id: string) => void;
  onPageChange: (_event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const stickyCellStyles = {
  border: "1px solid #ddd",
  backgroundColor: "white",
  zIndex: 11,
};

export function LeaveBalanceTable({
  rows,
  savedRowIds,
  fieldErrors,
  totalEmployees,
  page,
  rowsPerPage,
  isSubmitting,
  getYearLabel,
  isMale,
  isFemale,
  onFieldChange,
  onSaveRow,
  onPageChange,
  onRowsPerPageChange,
}: LeaveBalanceTableProps) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" stickyHeader sx={{ minWidth: 1120 }}>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                fontWeight: 700,
                border: "1px solid #ddd",
                position: "sticky",
                left: 0,
                zIndex: 12,
                backgroundColor: "#f5f5f5",
                minWidth: 80,
              }}
            >
              ID
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 700,
                border: "1px solid #ddd",
                position: "sticky",
                left: 80,
                zIndex: 12,
                backgroundColor: "#f5f5f5",
                minWidth: 280,
              }}
            >
              Employee Details
            </TableCell>
            <TableCell sx={{ fontWeight: 700, border: "1px solid #ddd", backgroundColor: "#e3f2fd", minWidth: 120, textAlign: "center" }}>
              Casual Leave
            </TableCell>
            <TableCell sx={{ fontWeight: 700, border: "1px solid #ddd", backgroundColor: "#e8f5e9", minWidth: 120, textAlign: "center" }}>
              Medical Leave
            </TableCell>
            <TableCell sx={{ fontWeight: 700, border: "1px solid #ddd", backgroundColor: "#fff8e1", minWidth: 130, textAlign: "center" }}>
              Restricted Leave
            </TableCell>
            <TableCell sx={{ fontWeight: 700, border: "1px solid #ddd", backgroundColor: "#fce4ec", minWidth: 130, textAlign: "center" }}>
              Maternity Leave
            </TableCell>
            <TableCell sx={{ fontWeight: 700, border: "1px solid #ddd", backgroundColor: "#ede7f6", minWidth: 130, textAlign: "center" }}>
              Paternity Leave
            </TableCell>
            <TableCell sx={{ fontWeight: 700, border: "1px solid #ddd", backgroundColor: "#e0f2f1", minWidth: 130, textAlign: "center" }}>
              Year
            </TableCell>
            <TableCell sx={{ fontWeight: 700, border: "1px solid #ddd", backgroundColor: "#f5f5f5", minWidth: 90, textAlign: "center" }}>
              Save
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            const isSaved = savedRowIds.includes(row.id);
            const disableMaternity = isMale(row.gender);
            const disablePaternity = isFemale(row.gender);

            return (
              <TableRow key={row.id} hover>
                <TableCell sx={{ ...stickyCellStyles, position: "sticky", left: 0 }}>
                  {row.id}
                </TableCell>
                <TableCell
                  sx={{
                    ...stickyCellStyles,
                    position: "sticky",
                    left: 80,
                    minWidth: 280,
                  }}
                >
                  <Stack spacing={0.25}>
                    <Typography variant="body2" fontWeight={600}>
                      {row.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {row.designation}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {row.gender} | {row.mobile}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell sx={{ border: "1px solid #ddd", p: 0.5 }}>
                  <TextField
                    type="text"
                    size="small"
                    fullWidth
                    value={row.casualLeave}
                    onChange={onFieldChange(row.id, "casualLeave")}
                    error={Boolean(fieldErrors[row.id]?.casualLeave)}
                    helperText={fieldErrors[row.id]?.casualLeave ?? ""}
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*", style: { textAlign: "center" } }}
                  />
                </TableCell>
                <TableCell sx={{ border: "1px solid #ddd", p: 0.5 }}>
                  <TextField
                    type="text"
                    size="small"
                    fullWidth
                    value={row.medicalLeave}
                    onChange={onFieldChange(row.id, "medicalLeave")}
                    error={Boolean(fieldErrors[row.id]?.medicalLeave)}
                    helperText={fieldErrors[row.id]?.medicalLeave ?? ""}
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*", style: { textAlign: "center" } }}
                  />
                </TableCell>
                <TableCell sx={{ border: "1px solid #ddd", p: 0.5 }}>
                  <TextField
                    type="text"
                    size="small"
                    fullWidth
                    value={row.restrictedLeave}
                    onChange={onFieldChange(row.id, "restrictedLeave")}
                    error={Boolean(fieldErrors[row.id]?.restrictedLeave)}
                    helperText={fieldErrors[row.id]?.restrictedLeave ?? ""}
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*", style: { textAlign: "center" } }}
                  />
                </TableCell>
                <TableCell sx={{ border: "1px solid #ddd", p: 0.5 }}>
                  <TextField
                    type="text"
                    size="small"
                    fullWidth
                    value={row.maternityLeave}
                    onChange={onFieldChange(row.id, "maternityLeave")}
                    placeholder="Enter value"
                    disabled={disableMaternity}
                    error={Boolean(fieldErrors[row.id]?.maternityLeave)}
                    helperText={fieldErrors[row.id]?.maternityLeave ?? ""}
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*", style: { textAlign: "center" } }}
                  />
                </TableCell>
                <TableCell sx={{ border: "1px solid #ddd", p: 0.5 }}>
                  <TextField
                    type="text"
                    size="small"
                    fullWidth
                    value={row.paternityLeave}
                    onChange={onFieldChange(row.id, "paternityLeave")}
                    placeholder="Enter value"
                    disabled={disablePaternity}
                    error={Boolean(fieldErrors[row.id]?.paternityLeave)}
                    helperText={fieldErrors[row.id]?.paternityLeave ?? ""}
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*", style: { textAlign: "center" } }}
                  />
                </TableCell>
                <TableCell sx={{ border: "1px solid #ddd", p: 0.5 }}>
                  <TextField
                    size="small"
                    fullWidth
                    value={getYearLabel(row.yearEnd)}
                    error={Boolean(fieldErrors[row.id]?.yearEnd)}
                    helperText={fieldErrors[row.id]?.yearEnd ?? ""}
                    InputProps={{
                      readOnly: true,
                      tabIndex: -1,
                      sx: { cursor: "not-allowed", backgroundColor: "#d0d0d0" },
                    }}
                    inputProps={{
                      tabIndex: -1,
                      style: { textAlign: "center", cursor: "not-allowed", pointerEvents: "none" },
                    }}
                    onFocus={(event) => event.target.blur()}
                    sx={{
                      cursor: "not-allowed",
                      "& .MuiOutlinedInput-root": { backgroundColor: "#d0d0d0" },
                    }}
                  />
                </TableCell>
                <TableCell sx={{ border: "1px solid #ddd", textAlign: "center" }}>
                  <IconButton
                    color={isSaved ? "success" : "primary"}
                    disabled={isSubmitting}
                    onClick={() => onSaveRow(row.id)}
                  >
                    {isSaved ? <CheckCircleIcon /> : <SaveOutlinedIcon />}
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={totalEmployees}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[10, 25, 50, 100]}
      />
    </TableContainer>
  );
}
