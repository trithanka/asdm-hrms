import { Container, Grid, Stack, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { LEAVE_TYPE, LeaveType } from "../../../data/constants";
import { formatToLongDate } from "../../../utils/formatter";
import LeaveDetailCard from "../../leaves/components/cards/leave-detail-card";
import useEmployeeLeaves from "../hooks/useEmployeeLeaves";
import BackButton from "../../../components/backbutton";

export default function LeavesList() {
  const location = useLocation();
  const empId = new URLSearchParams(location.search).get("empId");

  const { data, isPending } = useEmployeeLeaves(Number(empId));

  if (isPending) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  const leaveArr = [
    ...(data?.leaveList as any),
    ...(data?.parentalLeaveList as any),
  ];
  leaveArr.sort((a, b) => {
    const dateA = a.startDate || a.leaveDate;
    const dateB = b.startDate || b.leaveDate;

    return (new Date(dateB) as any) - (new Date(dateA) as any);
  });

  return (
    <>
      <Container maxWidth="lg" component="section">
        <BackButton />
        <Stack gap={3}>
          <LeaveDetailCard title="Leave Balance">
            <Grid container>
              <Grid item xs={4}>
                <Typography variant="body2">
                  <Typography
                    variant="h4"
                    component="span"
                    fontWeight={700}
                    color="primary.main"
                  >
                    {data?.employeeListSingle?.casualLeaves}
                  </Typography>
                  /15 Days
                </Typography>
                <Typography variant="body2">Casual Leave</Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body2">
                  <Typography
                    variant="h4"
                    component="span"
                    fontWeight={700}
                    color="primary.main"
                  >
                    {data?.employeeListSingle?.medicalLeaves}
                  </Typography>
                  /15 Days
                </Typography>
                <Typography variant="body2">Medical Leave</Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body2">
                  <Typography
                    variant="h4"
                    component="span"
                    fontWeight={700}
                    color="primary.main"
                  >
                    {data?.employeeListSingle?.parentalLeave}
                  </Typography>
                  /180 Days
                </Typography>
                <Typography variant="body2">Parental Leave</Typography>
              </Grid>
            </Grid>
          </LeaveDetailCard>

          <LeaveDetailCard title="Leave History">
            <Grid container spacing={1}>
              {leaveArr?.map((leave, index: number) => (
                <Grid
                  item
                  container
                  xs={12}
                  borderBottom={0.5}
                  p={1}
                  borderColor="ButtonHighlight"
                  sx={{
                    "&:last-child": {
                      border: "none",
                    },
                  }}
                  key={index}
                >
                  <Grid item xs={1}>
                    <Typography variant="body2">{index + 1} </Typography>
                  </Grid>

                  <Grid item xs={3}>
                    <Typography variant="body2" color="GrayText">
                      {/* {formatToLongDate(leave.leaveDate)} */}
                      {leave.leaveType === "PL" ? (
                        <>
                          <span>
                            <span style={{ color: "black", fontWeight: 600 }}>
                              From
                            </span>{" "}
                            {formatToLongDate(leave.startDate)}
                          </span>
                          <br />
                          <span>
                            <span style={{ color: "black", fontWeight: 600 }}>
                              To
                            </span>{" "}
                            {formatToLongDate(leave.endDate)}
                          </span>
                        </>
                      ) : (
                        formatToLongDate(leave.leaveDate)
                      )}
                    </Typography>
                  </Grid>

                  <Grid item xs={2}>
                    <Typography variant="body2">
                      {LEAVE_TYPE[leave?.leaveType as LeaveType]}
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography variant="caption">{leave.reason}</Typography>
                  </Grid>

                  <Grid item xs={2}>
                    <Typography
                      variant="subtitle2"
                      align="right"
                      sx={{
                        color:
                          leave.status === "Pending"
                            ? "black"
                            : leave.status === "Approved"
                            ? "green"
                            : "red",
                      }}
                    >
                      {leave.status}
                    </Typography>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </LeaveDetailCard>
          {/* </Grid> */}
        </Stack>
      </Container>
    </>
  );
}
