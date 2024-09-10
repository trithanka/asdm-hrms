import ErrorIcon from "@mui/icons-material/Error";
import { Stack, Typography } from "@mui/material";
import LeaveDetailCard from "../../leaves/components/cards/leave-detail-card";
import useFetchMonthlyAttendance from "../hooks/useFetchMonthlyAttendance";
import MonthlyAttendanceGraph from "./graphs/monthly-attendance-graph";

export default function MonthlyAttendance() {
  const { data, isPending } = useFetchMonthlyAttendance(11);

  return (
    <>
      <LeaveDetailCard title="Monthly Attendance">
        <Stack height="300px">
          {!isPending && data?.data && data?.data?.length ? (
            <MonthlyAttendanceGraph data={data?.data} />
          ) : (
            <Stack alignItems="center" justifyContent="center" height="100%">
              <ErrorIcon color="action" />
              <Typography
                pt={1}
                variant="caption"
                fontWeight={500}
                color="text.secondary"
              >
                No Data Found
              </Typography>
              <Typography variant="caption" color="text.secondary">
                The data was not retrieved correctly.
              </Typography>
            </Stack>
          )}
        </Stack>
      </LeaveDetailCard>
    </>
  );
}
