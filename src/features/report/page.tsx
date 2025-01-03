import useFetchDashboard from "./hooks/useFetchDashboard";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Button, CircularProgress, Grid, MenuItem, Paper, Select, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import useFilters from "../employees/hooks/useFilters";
import { theme } from "../../theme";
import { useEffect, useRef, useState } from "react";
import { useExportEmployeeData } from "./hooks/useFetchEmployeeCount";
import AttendanceReport from "./components/attendance-report";
import LeaveReport from "./components/leave-report";
import { useQuery } from "@tanstack/react-query";
import API from "../../api";
import TableFormat from "./components/table";
import { createColumnHelper } from "@tanstack/react-table";
import { ChevronLeft } from "@mui/icons-material";
import generatePDF from "react-to-pdf";

export default function ReportPage() {
  const { isPending } = useFetchDashboard();
  const [employeeStatus, setEmployeeStatus] = useState<number>();
  const [showFilter, setShowFilter] = useState("");
  const [designation, setDesignation] = useState("all");
  const [locationName, setLocationName] = useState("all");

  const { isPending: loading, data, refetch } = useQuery({
    queryKey: ["employeeReport", employeeStatus, designation, locationName],
    queryFn: async () => {
      const res = await API.post("employeemanagement/getreport", {
        bReleased: employeeStatus,
        designation: designation === "all" ? "" : designation,
        locationName: locationName === "all" ? "" : locationName,
      });
      return res.data;
    },
    retry: false,
    enabled: !!designation || !!locationName || !!designation,
  });

  useEffect(() => {
    refetch()
  }, [designation, locationName, refetch, employeeStatus])

  const { designations, current_working_location } = useFilters();

  const handleShowFilter = () => {
    setShowFilter("");
  }

  const targetRef = useRef(null);

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
        <Stack padding={ 2 }>
          <Typography fontSize={ 24 } fontWeight={ 500 } pb={ 2 } textAlign="center">{ showFilter === "active" ? "Active Employee Report" : showFilter === "release" ? "Release Employee Report" : showFilter === "leave-report" ? "Leave Report" : showFilter === "attendance" ? "Attendance Report" : "Report" } </Typography>
          { showFilter === "" ?
            <Stack direction="column" justifyContent="center" spacing={ 3 }>
              <Stack direction="row" justifyContent="center" spacing={ 3 }>
                <Button onClick={ () => { setShowFilter("active"), setEmployeeStatus(0) } }>
                  <Paper
                    variant="outlined"
                    sx={ {
                      textAlign: "center",
                      cursor: "pointer",
                      alignContent: "center",
                      display: "flex",
                      justifyContent: "center", 
                      alignItems:"center",
                      bgcolor: theme.palette.primary.light,
                      color: "#fff",
                      px: 3,
                      width: "20rem",
                      height: "10rem",
                    } }
                    ><Typography fontSize={ 20 } fontWeight={ 500 }>Export Active Employee Data</Typography></Paper>
                </Button>
                <Button onClick={ () => { setShowFilter("release"), setEmployeeStatus(1) } }>
                  <Paper
                    variant="outlined"
                    style={{textAlign:"center",alignContent: "center"}}
                    sx={ {
                      textAlign: "center",
                      display: "flex",
                      justifyContent: "center", 
                      alignItems:"center",
                      alignContent: "center",
                      cursor: "pointer",
                      bgcolor: theme.palette.primary.light,
                      color: "#fff",
                      px: 3,
                      width: "20rem",
                      height: "10rem",
                    } }
                  ><Typography fontSize={ 20 } fontWeight={ 500 }>Export Release Employee Data</Typography></Paper>
                </Button>
              </Stack>
              <Stack direction="row" justifyContent="center" spacing={ 3 }>
                <Button onClick={ () => setShowFilter("leave-report") } >
                  <Paper
                    variant="outlined"
                    sx={ {
                      textAlign: "center",
                      cursor: "pointer",
                      alignContent: "center",
                      display: "flex",
                      justifyContent: "center", 
                      alignItems:"center",
                      bgcolor: theme.palette.primary.light,
                      color: "#fff",
                      px: 3,
                      width: "20rem",
                      height: "10rem",
                    } }>
                    <Typography fontSize={ 20 } fontWeight={ 500 }>Leave Report</Typography>
                  </Paper>
                </Button>
                <Button onClick={ () => setShowFilter("attendance") }>
                  <Paper
                    variant="outlined"
                    sx={ {
                      textAlign: "center",
                      cursor: "pointer",
                      alignContent: "center",
                      display: "flex",
                      justifyContent: "center", 
                      alignItems:"center",
                      bgcolor: theme.palette.primary.light,
                      color: "#fff",
                      px: 3,
                      width: "20rem",
                      height: "10rem",
                    } }
                  >
                    <Typography fontSize={ 20 } fontWeight={ 500 }>Attendance Report</Typography>
                  </Paper>
                </Button>
              </Stack>
            </Stack>
            :
            <Stack direction="row" gap={ 2 } justifyContent="space-between" alignItems="end">
              {/* <Button startIcon={ <ChevronLeft /> } onClick={ () => setShowFilter("") }>
                Back
              </Button> */}
              {/* { Active employee list & Release employee list} */ }
              { showFilter != "leave-report" && showFilter != "attendance" &&

                <div style={ { width: "100%", display: "flex", flexDirection: "column" } }>
                  <div style={ { display: "flex", alignContent: "center", justifyContent: "space-between", gap: 5 } }>
                    <>
                      <Button startIcon={ <ChevronLeft /> } onClick={ () => setShowFilter("") }>
                        Back
                      </Button>

                      <Stack direction="row" gap={ 2 }>
                        <Grid item xs={ 10 } sm={ 4 }>
                          <Typography pr={ 2 } variant="caption" fontWeight={ 500 } gutterBottom>
                            Designation
                          </Typography>
                          <Select
                            style={ { width: "200px" } }
                            size="small"
                            value={ designation }
                            defaultValue={ "Select designation" }
                            onChange={ (e) => setDesignation(e.target.value) }
                          >
                            <MenuItem selected disabled value={ "none" } sx={ { textTransform: "capitalize" } }>
                              Select Designation
                            </MenuItem>
                            <MenuItem value="all">
                              All
                            </MenuItem>
                            { designations?.map((option, idx: number) => (
                              <MenuItem key={ idx } value={ option.label }>
                                { option.label }
                              </MenuItem>
                            )) }
                          </Select>
                        </Grid>
                        <Grid item xs={ 10 } sm={ 4 } gap={ 2 }>
                          <Typography pr={ 2 } variant="caption" fontWeight={ 500 } gutterBottom>
                            Location
                          </Typography>
                          <Select
                            style={ { width: "250px" } }
                            size="small"
                            value={ locationName }
                            defaultValue={ "Select location" }
                            onChange={ (e) => setLocationName(e.target.value) }
                          >
                            <MenuItem selected disabled value={ "none" } sx={ { textTransform: "capitalize" } }>
                              Select Location
                            </MenuItem>
                            <MenuItem value="all">
                              All
                            </MenuItem>
                            { current_working_location?.map((option, idx: number) => (
                              <MenuItem key={ idx } value={ option.label } >
                                { option.label }
                              </MenuItem>
                            )) }
                          </Select>
                        </Grid>
                      </Stack>
                      <Stack direction="row" gap={ 2 }>
                        { showFilter === "active" && (
                          <LoadingButton
                            startIcon={ <FileDownloadIcon /> }
                            variant="contained"
                            loading={ isPending }
                            onClick={ () => useExportEmployeeData(0, designation, locationName) }
                          >
                            Export Excel Data
                          </LoadingButton>
                        ) }
                        { showFilter === "release" && (
                          <LoadingButton
                            startIcon={ <FileDownloadIcon /> }
                            variant="contained"
                            loading={ isPending }
                            onClick={ () => useExportEmployeeData(1, designation, locationName) }
                          >
                            Export Excel Data
                          </LoadingButton>
                        ) }

                        <LoadingButton
                          startIcon={ <FileDownloadIcon /> }
                          variant="contained"
                          loading={ isPending }
                          onClick={ () => generatePDF(targetRef, { filename: "Employee List.pdf" }) }
                        >
                          Download PDF
                        </LoadingButton>
                      </Stack>
                    </>
                  </div>
                  <div>
                    { loading ?
                      "Loading..."
                      :
                      <TableFormat data={ data } columns={ columns } targetRef={ targetRef } />
                    }
                  </div>
                </div>
              }


              {/* Leave Report */ }
              { showFilter === "leave-report" &&
                <LeaveReport goPrevious={ handleShowFilter } />
              }

              {/* ...... */ }

              {/* attendance report */ }
              { showFilter === "attendance" &&
                <AttendanceReport goPrevious={ handleShowFilter } />
              }
              {/* ..... */ }
            </Stack> }
        </Stack>

        {/* <Grid container spacing={ 3 }>

          <Grid
            item
            xs={ 12 }
            md={ 6 }
            display="flex"
            flexDirection="column"
            gap={ 2 }
            height="auto"
          >
            <ServiceStatus
              activeCount={ data?.activeStatusCount }
              regignationCount={ data?.regignationCount }
            />

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

          <Grid item xs={ 12 } md={ 6 } height={ 400 }>
            <MonthlyAttendance />
          </Grid>

          <Grid item xs={ 12 } md={ 6 } height={ 400 }>
            <LeaveDetailCard title="Most Common Reason for Leave">
              <Stack height="300px">
                { !isPending && data?.leaveCommonReason ? (
                  <CommonReasonsGraph data={ data?.leaveCommonReason } />
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
        </Grid> */}
      </section >
    </>
  );
}



const columnHelper = createColumnHelper<any>();

const columns = [
  columnHelper.accessor((row) => row.id, {
    id: "id",
    cell: (info) => info.row.index + 1,
    header: () => <span>Sl.No</span>,
  }),
  columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
    id: "Name",
    header: () => "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("employeeId", {
    header: () => "Employee ID",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("phoneNumber", {
    header: () => "Phone Number",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("emailId", {
    header: () => "Email ID",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("designation", {
    header: () => "Designation",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),

]