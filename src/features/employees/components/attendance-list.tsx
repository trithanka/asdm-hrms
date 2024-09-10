import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import {
  Autocomplete,
  Box,
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
  TextField,
  Typography,
} from "@mui/material";
import * as React from "react";
import { MONTH_LIST } from "../../../data/constants";
import { formatToMediumDate } from "../../../utils/formatter";
import useAttendance from "../hooks/useAttendance";
import useDate from "../hooks/useDate";

interface IProps {
  id: number;
}

interface Month {
  label: string;
  id: number;
}

export default function AttendanceList({ id }: IProps) {
  const { currentMonth, currentMonthName, currentYear } = useDate();

  const [month, setMonth] = React.useState<Month>({
    id: currentMonth,
    label: currentMonthName,
  });
  const [year, setYear] = React.useState(currentYear?.toString());

  const {
    isPending,
    data: attendances,
    refetch,
  } = useAttendance(id.toString(), month?.id, year);

  function monthHandler(month: Month) {
    if (!month) return;

    setMonth({
      id: month.id,
      label: month.label,
    });
  }

  React.useEffect(() => {
    refetch();
  }, [month, year]);

  if (isPending) {
    return (
      <div>
        <Typography>Loading</Typography>
      </div>
    );
  }

  return (
    <Box px={3} pt={4}>
      <Stack
        pb={4}
        gap={2}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
      >
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          defaultValue={{
            id: currentMonth,
            label: currentMonthName,
          }}
          onChange={(_, value) => monthHandler(value!)}
          options={MONTH_LIST}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} />}
        />

        <Select
          sx={{ minWidth: 150 }}
          value={year}
          onChange={(event) => setYear(event.target.value as string)}
        >
          {attendances?.yearList?.map((year) => (
            <MenuItem value={year} key={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </Stack>

      {attendances?.attendanceList &&
      attendances?.attendanceList?.length <= 0 ? (
        <Stack justifyContent="center" alignItems="center" gap={2} pt={12}>
          <ErrorOutlineIcon color="disabled" fontSize="large" />
          <Typography variant="body2" color="GrayText" align="center">
            No Data Found for {month?.label}, {year}!
          </Typography>
        </Stack>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table sx={{ minWidth: 650 }} aria-label="attendance table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>

                <TableCell>In Time</TableCell>
                <TableCell>Out Time</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {attendances?.attendanceList?.map((attendance, index: number) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{formatToMediumDate(attendance?.date)}</TableCell>

                  <TableCell>
                    <Stack gap={1}>
                      <Typography
                        variant="body2"
                        textTransform="capitalize"
                        color="text.primary"
                      >
                        {attendance?.inTime}
                      </Typography>
                      <Typography
                        variant="caption"
                        textTransform="capitalize"
                        color="text.secondary"
                      >
                        {attendance?.attendanceMarkerIn}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack gap={1}>
                      <Typography
                        variant="body2"
                        textTransform="capitalize"
                        color="text.primary"
                      >
                        {attendance?.outTime}
                      </Typography>
                      <Typography
                        variant="caption"
                        textTransform="capitalize"
                        color="text.secondary"
                      >
                        {attendance?.attendanceMarkerOut}
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
