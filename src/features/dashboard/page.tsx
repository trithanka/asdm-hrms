import ErrorIcon from "@mui/icons-material/Error";
import ServiceStatus from "./components/service-status";
import EmployeesCount from "./components/employees-count";
import useFetchDashboard from "./hooks/useFetchDashboard";
import LeaveActivities from "./components/leave-activities";
import UpcomingHolidays from "./components/upcoming-holidays";
import StatisticCard from "./components/cards/statistic-card";
import AttendanceRateGraph from "./components/graphs/attendance-rate-graph";
import DiversityMatrixGraph from "./components/graphs/diversity-matrix-graph";
import LeaveDetailCard from "../leaves/components/cards/leave-detail-card";
import { CircularProgress, Grid, Stack, Typography } from "@mui/material";
import useFetchAttendanceRateDepartmentWise from "./hooks/useFetchAttendanceRateDepartmentWise";

export default function DashboardPage() {
  const { data, isPending } = useFetchDashboard();
  const { data: attendanceRateDepartmentWise } =
    useFetchAttendanceRateDepartmentWise();

  if (isPending) {
    return (
      <Stack height="80vh" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <>
      <section>
        <Grid container spacing={ 3 }>
          <Grid item xs={ 12 } sm={ 6 } md={ 3 }>
            <StatisticCard
              label="Total Employees as on Date"
              link="/employees"
              value={ data?.employeeCount! }
            />
          </Grid>

          <Grid item xs={ 12 } sm={ 6 } md={ 3 }>
            <StatisticCard
              label="Pending Leave Request"
              value={ data?.leaveRequestPending! }
              link="/leaves"
              bgColor="#e37d25"
            />
          </Grid>

          <Grid item xs={ 12 } sm={ 6 } md={ 3 }>
            <StatisticCard
              label="Approved Leaves"
              value={ data?.leaveRequestApproved! }
              link="/leaves/?type=approve"
              bgColor="#3c9f30"
            />
          </Grid>

          <Grid item xs={ 12 } sm={ 6 } md={ 3 }>
            <StatisticCard
              label="Rejected Leaves"
              value={ data?.leaveRequestRejected! }
              link="/leaves/?type=rejected"
              bgColor="#ff4a4a"
            />
          </Grid>

          <Grid item container xs={ 12 } spacing={ 2 }>
            <Grid item xs={ 12 } md={ 6 } sx={ { height: "auto" } }>
              <EmployeesCount />
            </Grid>

            <Grid
              item
              xs={ 12 }
              md={ 6 }
              display="flex"
              flexDirection="column"
              gap={ 2 }
              height="auto"
            >
              <Grid item xs={ 12 }>
                <ServiceStatus
                  activeCount={ data?.activeStatusCount }
                  regignationCount={ data?.regignationCount }
                />
              </Grid>

              <Grid container spacing={ 2 }>
                <Grid item xs={ 12 } sm={ 6 }>
                  <LeaveActivities
                    joiningToday={ 0 }
                    staffOnLeave={ data?.leaveTodayCount ?? 0 }
                    staffAbsentToday={ data?.absentToday ?? 0 }
                    staffPresentToday={ data?.presentToday ?? 0 }
                  />
                </Grid>
                <Grid item xs={ 12 } sm={ 6 }>
                  <UpcomingHolidays holidays={ data?.holidays ?? [] } />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* <Grid item xs={ 12 } md={ 6 } height={ 400 }>
            <MonthlyAttendance />
          </Grid> */}

          {/* <Grid item xs={12} md={6} height={400}>
            <LeaveDetailCard title="Most Common Reason for Leave">
              <Stack height="300px">
                {!isPending && data?.leaveCommonReason ? (
                  <CommonReasonsGraph data={data?.leaveCommonReason} />
                ) : (
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    height="100%"
                  >
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
          </Grid> */}

          {/* <Grid item xs={12} md={6} height={400}>
            <LeaveDetailCard title="Leave Trends Over Time">
              <Stack height="300px">
                {!isPending && data?.absentToday ? (
                  <LeaveTrendOvertime />
                ) : (
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    height="100%"
                  >
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
          </Grid> */}

          {/* <Grid item xs={12} md={6} height={400}>
            <LeaveDetailCard title="Absenteeism Rates">
              <Stack height="300px">
                {!isPending && data?.absentToday ? (
                  <AbsenteeismRateGraph />
                ) : (
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    height="100%"
                  >
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
          </Grid> */}

          <Grid item xs={ 6 } height={ 400 }>
            <LeaveDetailCard title="Diversity Matrix - Gender Wise">
              <Stack height="300px">
                { !isPending && data?.genderWise ? (
                  <DiversityMatrixGraph data={ data?.genderWise } />
                ) : (
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    height="100%"
                  >
                    <ErrorIcon color="action" />
                    <Typography
                      pt={ 1 }
                      variant="caption"
                      fontWeight={ 500 }
                      color="text.secondary"
                    >
                      No Data Found
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      The data was not retrieved correctly.
                    </Typography>
                  </Stack>
                ) }
              </Stack>
            </LeaveDetailCard>
          </Grid>

          <Grid item xs={ 6 } height={ 400 }>
            <LeaveDetailCard title="Attendance Rates - Department Wise">
              <Stack height="300px">
                { !isPending && data?.absentToday ? (
                  <AttendanceRateGraph data={ attendanceRateDepartmentWise } />
                ) : (
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    height="100%"
                  >
                    <ErrorIcon color="action" />
                    <Typography
                      pt={ 1 }
                      variant="caption"
                      fontWeight={ 500 }
                      color="text.secondary"
                    >
                      No Data Found
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      The data was not retrieved correctly.
                    </Typography>
                  </Stack>
                ) }
              </Stack>
            </LeaveDetailCard>
          </Grid>
        </Grid>
      </section>
    </>
  );
}
