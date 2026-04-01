import DownloadIcon from "@mui/icons-material/Download";
import { Box, Button, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { ChangeEvent } from "react";
import { MasterDesignationItem, MasterYearItem } from "../types";

type LeaveBalanceToolbarProps = {
  searchName: string;
  designationId: string;
  globalYearEnd: string;
  designationOptions: MasterDesignationItem[];
  yearOptions: MasterYearItem[];
  isSubmitting: boolean;
  isLoading: boolean;
  isDownloading: boolean;
  onSearchChange: (value: string) => void;
  onDesignationChange: (value: string) => void;
  onGlobalYearEndChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSaveAll: () => void;
  onDownloadExcel: () => void;
};

export function LeaveBalanceToolbar({
  searchName,
  designationId,
  globalYearEnd,
  designationOptions,
  yearOptions,
  isSubmitting,
  isLoading,
  isDownloading,
  onSearchChange,
  onDesignationChange,
  onGlobalYearEndChange,
  onSaveAll,
  onDownloadExcel,
}: LeaveBalanceToolbarProps) {
  return (
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
          onChange={(event) => onSearchChange(event.target.value)}
          sx={{ minWidth: 240 }}
        />
        <TextField
          select
          size="small"
          label="Designation"
          value={designationId}
          onChange={(event) => onDesignationChange(event.target.value)}
          sx={{ minWidth: 260 }}
        >
          <MenuItem value="">All</MenuItem>
          {designationOptions.map((designation, index) => (
            <MenuItem
              key={`${designation.pklDesignationId}-${index}`}
              value={String(designation.pklDesignationId)}
            >
              {designation.vsDesignationName}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          label="Year"
          value={globalYearEnd}
          onChange={onGlobalYearEndChange}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">Select</MenuItem>
          {yearOptions.map((year, index) => (
            <MenuItem key={`${year.pklYearId}-${index}`} value={String(year.pklYearId)}>
              {year.vsYear}
            </MenuItem>
          ))}
        </TextField>
        <Button variant="contained" onClick={onSaveAll} disabled={isSubmitting || isLoading}>
          Save All
        </Button>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={onDownloadExcel}
          disabled={isLoading || isDownloading}
        >
          {isDownloading ? "Downloading..." : "XLS"}
        </Button>
      </Stack>
    </Stack>
  );
}
