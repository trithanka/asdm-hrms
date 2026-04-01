import {
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
  fieldErrors: LeaveFieldErrors;
  totalEmployees: number;
  page: number;
  rowsPerPage: number;
  getYearLabel: (yearId: string) => string;
  selectedYearEnd: string;
  isMale: (gender: string) => boolean;
  isFemale: (gender: string) => boolean;
  onFieldChange: (
    id: string,
    field: keyof LeaveBalanceRow
  ) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onPageChange: (_event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const stickyCellStyles = {
  border: "1px solid #ddd",
  backgroundColor: "white",
  zIndex: 11,
};

const DECIMAL_2_PATTERN = "^\\d*(\\.\\d{0,2})?$";

export function LeaveBalanceTable({
  rows,
  fieldErrors,
  totalEmployees,
  page,
  rowsPerPage,
  getYearLabel,
  selectedYearEnd,
  isMale,
  isFemale,
  onFieldChange,
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
              SL No.
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
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => {
            const disableMaternity = isMale(row.gender);
            const disablePaternity = isFemale(row.gender);
            const maternityDisplayValue =
              disableMaternity && (!row.maternityLeave.trim() || Number(row.maternityLeave) === 0)
                ? ""
                : row.maternityLeave;
            const paternityDisplayValue =
              disablePaternity && (!row.paternityLeave.trim() || Number(row.paternityLeave) === 0)
                ? ""
                : row.paternityLeave;

            return (
              <TableRow key={`${row.id}-${index}`} hover>
                <TableCell sx={{ ...stickyCellStyles, position: "sticky", left: 0 }}>
                  {page * rowsPerPage + index + 1}
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
                    inputProps={{ inputMode: "decimal", pattern: DECIMAL_2_PATTERN, style: { textAlign: "center" } }}
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
                    inputProps={{ inputMode: "decimal", pattern: DECIMAL_2_PATTERN, style: { textAlign: "center" } }}
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
                    inputProps={{ inputMode: "decimal", pattern: DECIMAL_2_PATTERN, style: { textAlign: "center" } }}
                  />
                </TableCell>
                <TableCell sx={{ border: "1px solid #ddd", p: 0.5 }}>
                  <TextField
                    type="text"
                    size="small"
                    fullWidth
                    value={maternityDisplayValue}
                    onChange={onFieldChange(row.id, "maternityLeave")}
                    placeholder={disableMaternity ? "N/A" : ""}
                    disabled={disableMaternity}
                    error={Boolean(fieldErrors[row.id]?.maternityLeave)}
                    helperText={fieldErrors[row.id]?.maternityLeave ?? ""}
                    inputProps={{ inputMode: "decimal", pattern: DECIMAL_2_PATTERN, style: { textAlign: "center" } }}
                    sx={{
                      ...(disableMaternity
                        ? {
                            "& .MuiOutlinedInput-root": { backgroundColor: "#f3f4f6" },
                            "& .MuiInputBase-input.Mui-disabled": {
                              WebkitTextFillColor: "#5f6368",
                              cursor: "not-allowed",
                            },
                          }
                        : {}),
                    }}
                  />
                </TableCell>
                <TableCell sx={{ border: "1px solid #ddd", p: 0.5 }}>
                  <TextField
                    type="text"
                    size="small"
                    fullWidth
                    value={paternityDisplayValue}
                    onChange={onFieldChange(row.id, "paternityLeave")}
                    placeholder={disablePaternity ? "N/A" : ""}
                    disabled={disablePaternity}
                    error={Boolean(fieldErrors[row.id]?.paternityLeave)}
                    helperText={fieldErrors[row.id]?.paternityLeave ?? ""}
                    inputProps={{ inputMode: "decimal", pattern: DECIMAL_2_PATTERN, style: { textAlign: "center" } }}
                    sx={{
                      ...(disablePaternity
                        ? {
                            "& .MuiOutlinedInput-root": { backgroundColor: "#f3f4f6" },
                            "& .MuiInputBase-input.Mui-disabled": {
                              WebkitTextFillColor: "#5f6368",
                              cursor: "not-allowed",
                            },
                          }
                        : {}),
                    }}
                  />
                </TableCell>
                <TableCell sx={{ border: "1px solid #ddd", p: 0.5 }}>
                  <TextField
                    size="small"
                    fullWidth
                    value={getYearLabel(selectedYearEnd || row.yearEnd)}
                    error={Boolean(fieldErrors[row.id]?.yearEnd)}
                    helperText={fieldErrors[row.id]?.yearEnd ?? ""}
                    InputProps={{
                      readOnly: true,
                      tabIndex: -1,
                      sx: { cursor: "not-allowed", backgroundColor: "#f3f4f6" },
                    }}
                    inputProps={{
                      tabIndex: -1,
                      style: { textAlign: "center", cursor: "not-allowed", pointerEvents: "none", color: "#5f6368" },
                    }}
                    onFocus={(event) => event.target.blur()}
                    sx={{
                      cursor: "not-allowed",
                      "& .MuiOutlinedInput-root": { backgroundColor: "#f3f4f6" },
                    }}
                  />
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
