import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DownloadIcon from "@mui/icons-material/Download";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import API from "../api";

type LeaveBalanceRow = {
  id: string;
  name: string;
  designation: string;
  mobile: string;
  gender: string;
  casualLeave: string;
  medicalLeave: string;
  restrictedLeave: string;
  maternityLeave: string;
  paternityLeave: string;
  yearEnd: string;
};

type EmployeeResponseItem = {
  id: number;
  full_name: string;
  vsGenderName: string;
  vsPhoneNumber: string;
  designationName: string;
  desCategoryName: string;
  casual?: number | null;
  madical?: number | null;
  Paternity?: number | null;
  maternity?: number | null;
  restricted?: number | null;
  unpaid?: number | null;
  vsYear?: string | null;
};

type EmployeeListResponse = {
  status: string;
  message: string;
  statusCode: number;
  data: EmployeeResponseItem[];
};

type MasterYearItem = {
  pklYearId: number;
  vsYear: string;
};

type MasterDesignationItem = {
  pklDesignationId: number;
  vsDesignationName: string;
  fklDesignationCategoryId: number | null;
};

type MasterDataResponse = {
  status: string;
  message: string;
  statusCode: number;
  data: {
    year: MasterYearItem[];
    designation: MasterDesignationItem[];
  };
};

const toInputValue = (value: number | null | undefined): string =>
  value === null || value === undefined ? "" : String(value);

function mapEmployeeToLeaveRow(
  employee: EmployeeResponseItem,
  yearList: MasterYearItem[]
): LeaveBalanceRow {
  const mappedYearId = yearList.find((year) => year.vsYear === employee.vsYear)?.pklYearId;

  return {
    id: String(employee.id),
    name: employee.full_name,
    designation: employee.designationName,
    mobile: employee.vsPhoneNumber,
    gender: employee.vsGenderName,
    casualLeave: toInputValue(employee.casual),
    medicalLeave: toInputValue(employee.madical),
    restrictedLeave: toInputValue(employee.restricted),
    maternityLeave: toInputValue(employee.maternity),
    paternityLeave: toInputValue(employee.Paternity),
    yearEnd: mappedYearId ? String(mappedYearId) : (employee.vsYear ?? ""),
  };
}

type LeavePayloadItem = {
  employeeId: number;
  casualLeave: number;
  sickLeave: number;
  parentialLeave: number;
  maternityLeave: number;
  restrictedLeave: number;
  yearEnd: number;
};

const stickyCellStyles = {
  border: "1px solid #ddd",
  backgroundColor: "white",
  zIndex: 11,
};

export default function LeaveBalancePage() {
  const [rows, setRows] = useState<LeaveBalanceRow[]>([]);
  const [yearOptions, setYearOptions] = useState<MasterYearItem[]>([]);
  const [designationOptions, setDesignationOptions] = useState<MasterDesignationItem[]>([]);
  const [searchName, setSearchName] = useState("");
  const [debouncedSearchName, setDebouncedSearchName] = useState("");
  const [designationId, setDesignationId] = useState("");
  const [globalYearEnd, setGlobalYearEnd] = useState("");
  const [savedRowIds, setSavedRowIds] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const allRowsSaved = rows.length > 0 && savedRowIds.length === rows.length;

  const isMale = (gender: string) => gender.trim().toLowerCase() === "male";
  const isFemale = (gender: string) => gender.trim().toLowerCase() === "female";
  const numericFields: Array<keyof LeaveBalanceRow> = [
    "casualLeave",
    "medicalLeave",
    "restrictedLeave",
    "maternityLeave",
    "paternityLeave",
  ];

  const toNumber = (value: string) => {
    if (!value.trim()) return 0;
    const parsedValue = Number(value);
    return Number.isNaN(parsedValue) ? 0 : parsedValue;
  };

  const getYearLabel = (yearId: string) => {
    return yearOptions.find((year) => String(year.pklYearId) === yearId)?.vsYear ?? yearId;
  };

  const mapRowToPayload = (row: LeaveBalanceRow): LeavePayloadItem => ({
    employeeId: Number(row.id),
    casualLeave: toNumber(row.casualLeave),
    sickLeave: toNumber(row.medicalLeave),
    parentialLeave: isFemale(row.gender) ? 0 : toNumber(row.paternityLeave),
    maternityLeave: isMale(row.gender) ? 0 : toNumber(row.maternityLeave),
    restrictedLeave: toNumber(row.restrictedLeave),
    yearEnd: toNumber(row.yearEnd),
  });

  const saveLeaveRows = async (payload: LeavePayloadItem[]) => {
    return API.post(
      "HrModule/add-leaves-by-employee",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchName(searchName.trim());
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchName]);

  useEffect(() => {
    let isMounted = true;

    async function fetchPageData() {
      try {
        setIsLoading(true);
        setError(null);

        const employeePayload: { full_name?: string; designationId?: number } = {};
        if (debouncedSearchName) {
          employeePayload.full_name = debouncedSearchName;
        }
        if (designationId) {
          employeePayload.designationId = Number(designationId);
        }

        const [employeeResponse, masterDataResponse] = await Promise.all([
          API.post<EmployeeListResponse>("HrModule/get", employeePayload),
          API.post<MasterDataResponse>("HrModule/master-data", {}),
        ]);

        if (!isMounted) return;

        const years = masterDataResponse.data.data.year ?? [];
        setRows(
          employeeResponse.data.data.map((employee) =>
            mapEmployeeToLeaveRow(employee, years)
          )
        );
        setSavedRowIds([]);
        setSubmitted(false);
        setYearOptions(years);
        setDesignationOptions(masterDataResponse.data.data.designation ?? []);
      } catch (err: any) {
        if (!isMounted) return;

        setError(
          err?.response?.data?.message || "Failed to fetch employee list."
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchPageData();

    return () => {
      isMounted = false;
    };
  }, [debouncedSearchName, designationId]);

  const handleFieldChange =
    (id: string, field: keyof LeaveBalanceRow) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target;
      const nextValue =
        numericFields.includes(field) ? value.replace(/\D/g, "") : value;

      setRows((prev) =>
        prev.map((row) =>
          row.id === id ? { ...row, [field]: nextValue } : row
        )
      );

      setSavedRowIds((prev) => prev.filter((rowId) => rowId !== id));
      setSubmitted(false);
    };

  const handleSaveRow = (id: string) => {
    if (savedRowIds.includes(id)) {
      setSavedRowIds((prev) => prev.filter((rowId) => rowId !== id));
      setSubmitted(false);
      return;
    }

    setSavedRowIds((prev) => [...prev, id]);
    setSubmitted(false);
  };

  const handleSaveAll = () => {
    if (allRowsSaved) {
      setSavedRowIds([]);
      setSubmitted(false);
      return;
    }

    setSavedRowIds(rows.map((row) => row.id));
    setSubmitted(false);
  };

  const handleGlobalYearEndChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const selectedYearEnd = event.target.value;

    setGlobalYearEnd(selectedYearEnd);
    setRows((prev) =>
      prev.map((row) => ({
        ...row,
        yearEnd: selectedYearEnd,
      }))
    );
    setSavedRowIds([]);
    setSubmitted(false);
  };

  const openConfirmDialog = () => {
    if (!globalYearEnd) {
      toast.error("Please select Year End before submitting.");
      return;
    }

    if (savedRowIds.length === 0) {
      toast.error("Please save at least one employee before submitting.");
      return;
    }
    setConfirmOpen(true);
  };

  const closeConfirmDialog = () => {
    setConfirmOpen(false);
  };

  const handleFinalSubmit = async () => {
    try {
      const selectedRows = rows.filter((row) => savedRowIds.includes(row.id));

      if (selectedRows.length === 0) {
        toast.error("No saved employees selected for submission.");
        return;
      }

      setIsSubmitting(true);
      await saveLeaveRows(selectedRows.map(mapRowToPayload));
      setConfirmOpen(false);
      setSubmitted(true);
      toast.success("Leave balance submitted successfully.");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to submit leave balances.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      setIsDownloading(true);
      const response = await API.post<EmployeeListResponse>("HrModule/get", {});
      const allRows = response.data.data.map((employee) =>
        mapEmployeeToLeaveRow(employee, yearOptions)
      );

      const excelRows = allRows.map((row, index) => ({
        "Sl No": index + 1,
        "Employee ID": row.id,
        "Full Name": row.name,
        "Designation": row.designation,
        "Gender": row.gender,
        "Phone Number": row.mobile,
        "Casual Leave": row.casualLeave || "",
        "Medical Leave": row.medicalLeave || "",
        "Restricted Leave": row.restrictedLeave || "",
        "Maternity Leave": row.maternityLeave || "",
        "Paternity Leave": row.paternityLeave || "",
        "Year End": getYearLabel(row.yearEnd),
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelRows);
      worksheet["!cols"] = [
        { wch: 8 },
        { wch: 12 },
        { wch: 28 },
        { wch: 26 },
        { wch: 10 },
        { wch: 16 },
        { wch: 14 },
        { wch: 14 },
        { wch: 16 },
        { wch: 16 },
        { wch: 16 },
        { wch: 12 },
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Leave Balance");
      const today = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(workbook, `Leave_Balance_${today}.xlsx`);
      toast.success("Leave balance Excel downloaded.");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to download Excel.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Leave Balance
          </Typography>
          
        </Box>

        <Stack direction="row" spacing={1.5}>
          <TextField
            size="small"
            label="Search Employee Name"
            placeholder="Type full name"
            value={searchName}
            onChange={(event) => setSearchName(event.target.value)}
            sx={{ minWidth: 240 }}
          />
          <TextField
            select
            size="small"
            label="Designation"
            value={designationId}
            onChange={(event) => setDesignationId(event.target.value)}
            sx={{ minWidth: 260 }}
          >
            <MenuItem value="">All</MenuItem>
            {designationOptions.map((designation) => (
              <MenuItem
                key={designation.pklDesignationId}
                value={String(designation.pklDesignationId)}
              >
                {designation.vsDesignationName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            label="Year End"
            value={globalYearEnd}
            onChange={handleGlobalYearEndChange}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">Select</MenuItem>
            {yearOptions.map((year) => (
              <MenuItem key={year.pklYearId} value={String(year.pklYearId)}>
                {year.vsYear}
              </MenuItem>
            ))}
          </TextField>
          <Button variant="outlined" onClick={handleSaveAll} disabled={isSubmitting || isLoading}>
            {allRowsSaved ? "Cancel All" : "Save All"}
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadExcel}
            disabled={isLoading || isDownloading}
          >
            {isDownloading ? "Downloading..." : "Download to Excel"}
          </Button>
          <Button variant="contained" onClick={openConfirmDialog} disabled={isSubmitting || isLoading}>
            Submit
          </Button>
        </Stack>
      </Stack>

      {submitted && (
        <Typography color="success.main" fontWeight={600}>
          Leave balance submitted successfully.
        </Typography>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {isLoading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      ) : (
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
                <TableCell
                  sx={{
                    fontWeight: 700,
                    border: "1px solid #ddd",
                    backgroundColor: "#e3f2fd",
                    minWidth: 120,
                    textAlign: "center",
                  }}
                >
                  Casual Leave
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    border: "1px solid #ddd",
                    backgroundColor: "#e8f5e9",
                    minWidth: 120,
                    textAlign: "center",
                  }}
                >
                  Medical Leave
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    border: "1px solid #ddd",
                    backgroundColor: "#fff8e1",
                    minWidth: 130,
                    textAlign: "center",
                  }}
                >
                  Restricted Leave
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    border: "1px solid #ddd",
                    backgroundColor: "#fce4ec",
                    minWidth: 130,
                    textAlign: "center",
                  }}
                >
                  Maternity Leave
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    border: "1px solid #ddd",
                    backgroundColor: "#ede7f6",
                    minWidth: 130,
                    textAlign: "center",
                  }}
                >
                  Paternity Leave
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    border: "1px solid #ddd",
                    backgroundColor: "#e0f2f1",
                    minWidth: 130,
                    textAlign: "center",
                  }}
                >
                  Year End
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    border: "1px solid #ddd",
                    backgroundColor: "#f5f5f5",
                    minWidth: 90,
                    textAlign: "center",
                  }}
                >
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
                    <TableCell
                      sx={{
                        ...stickyCellStyles,
                        position: "sticky",
                        left: 0,
                      }}
                    >
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
                                        className="disabled:bg-gray"
                        size="small"
                        fullWidth
                        value={row.casualLeave}
                        onChange={handleFieldChange(row.id, "casualLeave")}
                        inputProps={{
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                          style: { textAlign: "center" },
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ddd", p: 0.5 }}>
                      <TextField
                        type="text"
                        size="small"
                                        className="disabled:bg-gray"
                        fullWidth
                        value={row.medicalLeave}
                        onChange={handleFieldChange(row.id, "medicalLeave")}
                        inputProps={{
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                          style: { textAlign: "center" },
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ddd", p: 0.5 }}>
                      <TextField
                        type="text"
                        size="small"
                        fullWidth
                      
                        className="disabled:bg-gray"
                        value={row.restrictedLeave}
                        onChange={handleFieldChange(row.id, "restrictedLeave")}
                        inputProps={{
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                          style: { textAlign: "center" },
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ddd", p: 0.5 }}>
                      <TextField
                        type="text"
                        size="small"
                        fullWidth
                        value={row.maternityLeave}
                        onChange={handleFieldChange(row.id, "maternityLeave")}
                        placeholder="Enter value"
                        disabled={disableMaternity}
                         className="disabled:bg-gray"
                        inputProps={{
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                          style: { textAlign: "center" },
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ddd", p: 0.5 }}>
                      <TextField
                        type="text"
                        size="small"
                        fullWidth
                        value={row.paternityLeave}
                          className="disabled:bg-gray"
                        onChange={handleFieldChange(row.id, "paternityLeave")}
                        placeholder="Enter value"
                        disabled={disablePaternity}
                        inputProps={{
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                          style: { textAlign: "center" },
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ddd", p: 0.5 }}>
                      <TextField
                        size="small"
                        fullWidth
                        value={getYearLabel(row.yearEnd)}
                        InputProps={{ readOnly: true }}
                        inputProps={{
                          style: { textAlign: "center" },
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ddd", textAlign: "center" }}>
                      <IconButton
                        color={isSaved ? "success" : "primary"}
                        disabled={isSubmitting}
                        onClick={() => handleSaveRow(row.id)}
                      >
                        {isSaved ? (
                          <CheckCircleIcon />
                        ) : (
                          <SaveOutlinedIcon />
                        )}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={confirmOpen} onClose={closeConfirmDialog}>
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to submit the saved leave balance details?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog} color="inherit" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleFinalSubmit} disabled={isSubmitting}>
            Final Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
