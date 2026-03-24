import { Alert, Box, CircularProgress, Stack, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import API from "../api";
import { LeaveBalanceSubmitDialog } from "../features/leave-balance/components/leave-balance-submit-dialog";
import { LeaveBalanceTable } from "../features/leave-balance/components/leave-balance-table";
import { LeaveBalanceToolbar } from "../features/leave-balance/components/leave-balance-toolbar";
import {
  EmployeeListResponse,
  EmployeeResponseItem,
  LeaveBalanceRow,
  LeaveFieldErrors,
  LeaveFieldKey,
  LeavePayloadItem,
  MasterDataResponse,
  MasterDesignationItem,
  MasterYearItem,
} from "../features/leave-balance/types";
import { isFemale, isMale, mapEmployeeToLeaveRow, toNumber } from "../features/leave-balance/utils";

export default function LeaveBalancePage() {
  const [rows, setRows] = useState<LeaveBalanceRow[]>([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
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
  const [fieldErrors, setFieldErrors] = useState<LeaveFieldErrors>({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const allRowsSaved = rows.length > 0 && savedRowIds.length === rows.length;
  const numericFields: Array<keyof LeaveBalanceRow> = [
    "casualLeave",
    "medicalLeave",
    "restrictedLeave",
    "maternityLeave",
    "paternityLeave",
  ];

  const getYearLabel = (yearId: string) => {
    return yearOptions.find((year) => String(year.pklYearId) === yearId)?.vsYear ?? yearId;
  };

  const validateRow = (row: LeaveBalanceRow): Partial<Record<LeaveFieldKey, string>> => {
    const errors: Partial<Record<LeaveFieldKey, string>> = {};

    if (!row.casualLeave.trim()) errors.casualLeave = "Req field";
    if (!row.medicalLeave.trim()) errors.medicalLeave = "Req field";
    if (!row.restrictedLeave.trim()) errors.restrictedLeave = "Req field";
    if (!row.yearEnd.trim()) errors.yearEnd = "Req field";

    if (!isMale(row.gender) && !row.maternityLeave.trim()) {
      errors.maternityLeave = "Req field";
    }

    if (!isFemale(row.gender) && !row.paternityLeave.trim()) {
      errors.paternityLeave = "Req field";
    }

    return errors;
  };

  const validateRows = (targetRows: LeaveBalanceRow[]) => {
    const nextErrors: LeaveFieldErrors = {};
    targetRows.forEach((row) => {
      const rowErrors = validateRow(row);
      if (Object.keys(rowErrors).length > 0) {
        nextErrors[row.id] = rowErrors;
      }
    });
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const resolveYearEndForPayload = (value: string) => {
    const byId = yearOptions.find((year) => String(year.pklYearId) === value);
    if (byId) return byId.pklYearId;

    const byYear = yearOptions.find((year) => year.vsYear === value);
    if (byYear) return byYear.pklYearId;

    return toNumber(value);
  };

  const mapRowToPayload = (row: LeaveBalanceRow): LeavePayloadItem => ({
    employeeId: Number(row.id),
    casualLeave: toNumber(row.casualLeave),
    sickLeave: toNumber(row.medicalLeave),
    parentialLeave: isFemale(row.gender) ? 0 : toNumber(row.paternityLeave),
    maternityLeave: isMale(row.gender) ? 0 : toNumber(row.maternityLeave),
    restrictedLeave: toNumber(row.restrictedLeave),
    yearEnd: resolveYearEndForPayload(row.yearEnd),
  });

  const saveLeaveRows = async (payload: LeavePayloadItem[]) => {
    return API.post("HrModule/add-leaves-by-employee", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchName(searchName.trim());
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchName]);

  useEffect(() => {
    let isMounted = true;

    async function fetchMasterData() {
      try {
        const masterDataResponse = await API.post<MasterDataResponse>("HrModule/master-data", {});
        if (!isMounted) return;
        setYearOptions(masterDataResponse.data.data.year ?? []);
        setDesignationOptions(masterDataResponse.data.data.designation ?? []);
      } catch {
        // Keep page usable even if master call fails; employee list call handles error UI.
      }
    }

    fetchMasterData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearchName, designationId]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchPageData() {
      try {
        setIsLoading(true);
        setError(null);

        const employeePayload: {
          full_name?: string;
          designationId?: number;
          limit: number;
          offset: number;
        } = {
          limit: rowsPerPage,
          offset: page * rowsPerPage,
        };

        if (debouncedSearchName) {
          employeePayload.full_name = debouncedSearchName;
        }

        if (designationId) {
          employeePayload.designationId = Number(designationId);
        }

        const employeeResponse = await API.post<EmployeeListResponse>("HrModule/get", employeePayload, {
          signal: controller.signal,
        });

        if (!isMounted) return;

        const responseRows = employeeResponse.data.data ?? [];
        setRows(responseRows.map((employee) => mapEmployeeToLeaveRow(employee, yearOptions)));
        setTotalEmployees(employeeResponse.data.total ?? responseRows.length);
        setSavedRowIds([]);
        setSubmitted(false);
        setFieldErrors({});
      } catch (err: any) {
        if (!isMounted) return;
        if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED") return;

        setError(err?.response?.data?.message || "Failed to fetch employee list.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchPageData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [debouncedSearchName, designationId, page, rowsPerPage, yearOptions]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFieldChange =
    (id: string, field: keyof LeaveBalanceRow) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target;
      const nextValue = numericFields.includes(field) ? value.replace(/\D/g, "") : value;

      setRows((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: nextValue } : row)));

      setFieldErrors((prev) => {
        const current = prev[id];
        if (!current || !current[field as LeaveFieldKey]) {
          return prev;
        }

        const nextRowErrors = { ...current };
        delete nextRowErrors[field as LeaveFieldKey];

        const next = { ...prev };
        if (Object.keys(nextRowErrors).length === 0) {
          delete next[id];
        } else {
          next[id] = nextRowErrors;
        }

        return next;
      });

      setSavedRowIds((prev) => prev.filter((rowId) => rowId !== id));
      setSubmitted(false);
    };

  const handleSaveRow = (id: string) => {
    if (savedRowIds.includes(id)) {
      setSavedRowIds((prev) => prev.filter((rowId) => rowId !== id));
      setSubmitted(false);
      return;
    }

    const row = rows.find((item) => item.id === id);
    if (!row) return;

    const isValid = validateRows([row]);
    if (!isValid) {
      toast.error("Please fill required fields.");
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

    const isValid = validateRows(rows);
    if (!isValid) {
      toast.error("Please fill required fields.");
      return;
    }

    setSavedRowIds(rows.map((row) => row.id));
    setSubmitted(false);
  };

  const handleGlobalYearEndChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const selectedYearEnd = event.target.value;

    setGlobalYearEnd(selectedYearEnd);
    setRows((prev) => prev.map((row) => ({ ...row, yearEnd: selectedYearEnd })));

    setFieldErrors((prev) => {
      const next: LeaveFieldErrors = {};
      Object.entries(prev).forEach(([rowId, rowErrors]) => {
        const updated = { ...rowErrors };
        delete updated.yearEnd;
        if (Object.keys(updated).length > 0) {
          next[rowId] = updated;
        }
      });
      return next;
    });

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

      const isValid = validateRows(selectedRows);
      if (!isValid) {
        toast.error("Please fill required fields.");
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
      const batchSize = 100;
      let offset = 0;
      let total = 0;
      const allEmployees: EmployeeResponseItem[] = [];

      do {
        const response = await API.post<EmployeeListResponse>("HrModule/get", {
          limit: batchSize,
          offset,
        });
        const employees = response.data.data ?? [];
        total = response.data.total ?? employees.length;
        allEmployees.push(...employees);
        offset += batchSize;
      } while (allEmployees.length < total);

      const allRows = allEmployees.map((employee) => mapEmployeeToLeaveRow(employee, yearOptions));
      const excelRows = allRows.map((row, index) => ({
        "Sl No": index + 1,
        "Employee ID": row.id,
        "Full Name": row.name,
        Designation: row.designation,
        Gender: row.gender,
        "Phone Number": row.mobile,
        "Casual Leave": row.casualLeave || "",
        "Medical Leave": row.medicalLeave || "",
        "Restricted Leave": row.restrictedLeave || "",
        "Maternity Leave": row.maternityLeave || "",
        "Paternity Leave": row.paternityLeave || "",
        Year: getYearLabel(row.yearEnd),
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
      <LeaveBalanceToolbar
        searchName={searchName}
        designationId={designationId}
        globalYearEnd={globalYearEnd}
        designationOptions={designationOptions}
        yearOptions={yearOptions}
        allRowsSaved={allRowsSaved}
        isSubmitting={isSubmitting}
        isLoading={isLoading}
        isDownloading={isDownloading}
        onSearchChange={setSearchName}
        onDesignationChange={setDesignationId}
        onGlobalYearEndChange={handleGlobalYearEndChange}
        onSaveAll={handleSaveAll}
        onDownloadExcel={handleDownloadExcel}
        onSubmit={openConfirmDialog}
      />

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
        <LeaveBalanceTable
          rows={rows}
          savedRowIds={savedRowIds}
          fieldErrors={fieldErrors}
          totalEmployees={totalEmployees}
          page={page}
          rowsPerPage={rowsPerPage}
          isSubmitting={isSubmitting}
          getYearLabel={getYearLabel}
          isMale={isMale}
          isFemale={isFemale}
          onFieldChange={handleFieldChange}
          onSaveRow={handleSaveRow}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}

      <LeaveBalanceSubmitDialog
        open={confirmOpen}
        isSubmitting={isSubmitting}
        onClose={closeConfirmDialog}
        onSubmit={handleFinalSubmit}
      />
    </Stack>
  );
}
