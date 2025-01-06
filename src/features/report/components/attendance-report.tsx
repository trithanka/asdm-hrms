import { LoadingButton } from "@mui/lab";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useEffect, useRef, useState } from "react";
import { useAttendanceData } from "../hooks/useFetchEmployeeCount";
import { createColumnHelper } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "@mui/icons-material";
import TableFormat from "./table";
import API from "../../../api";
import { Button, Grid, MenuItem, Select, Typography } from "@mui/material";
import { formatDate } from "../../../utils/formatter";
import moment from "moment";
import useDebounce from "../../../hooks/useDebounce";
import useFilters from "../../employees/hooks/useFilters";
import generateAttendancePDF from "../../../utils/generateAttendancePDF";
import generatePDF from "react-to-pdf";

export default function AttendanceReport({ goPrevious }: any) {
  const [staff, setStaff] = useState("present");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // const [attendanceType, setAttendanceType] = useState("");
  const [departmentfiltering, setDepartmentFiltering] = useState("");

  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);

  const debouncedFilter = useDebounce(search, 1000);

  const { departments } = useFilters();

  const { isPending, data, refetch } = useQuery({
    queryKey: ["attendanceReport", staff, startDate, endDate],
    queryFn: async () => {
      const res = await API.post(`Dashboard/leave/activities`, {
        staff: staff,
        startDate: startDate,
        // type: attendanceType,
        endDate: endDate,
      });
      return res.data;
    },
    retry: false,
    enabled: !!startDate || !!endDate || !!staff,
  });

  const { data: rangeAttendanceData, refetch: rangeAttendanceRefresh } =
    useQuery({
      queryKey: ["rangeAttendanceReport", staff, startDate, endDate],
      queryFn: async () => {
        const res = await API.post(`Dashboard/leave/activities/view`, {
          staff: staff,
          startDate: startDate,
          // type: attendanceType,
          endDate: endDate,
        });
        return res.data.data;
      },
      retry: false,
      enabled: !!startDate || !!endDate || !!staff,
    });

  useEffect(() => {
    if (!startDate || !endDate) {
      rangeAttendanceRefresh();
    } else {
      refetch();
    }
  }, [startDate, endDate, refetch]);

  const {
    isLoading: loading,
    data: databyId,
    refetch: reload,
  } = useQuery({
    queryKey: ["attendanceById", debouncedFilter, startDate, endDate],
    queryFn: async () => {
      const res = await API.post("Dashboard/leave/activities/id", {
        candidateId: debouncedFilter,
        startDate: startDate,
        endDate: endDate,
      });
      return res.data;
    },
    retry: false,
    enabled: !!startDate || !!endDate,
  });

  useEffect(() => {
    reload();
  }, [debouncedFilter]);

  const targetRef = useRef(null);
  const columnHelper = createColumnHelper<any>();

  const columns = [
    columnHelper.accessor((row) => row.id, {
      id: "id",
      cell: (info) => info.row.index + 1,
      header: () => <span>Sl.No</span>,
    }),
    columnHelper.accessor("empId", {
      header: () => "Employee ID",
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
      id: "name",
      header: () => "Name",
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("phone", {
      header: () => "Phone no",
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("designation", {
      header: () => "Designation",
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor((row) => row.punchIn, {
      id: "punchInDate",
      cell: (info) =>
        info.getValue()
          ? `${moment.utc(info.getValue()).format("DD/MM/YYYY")}`
          : "N/A",
      header: () => <span>Date</span>,
      footer: (info) => info.column.id,
    }),
    ...(staff !== "absent"
      ? [
          columnHelper.accessor("punchIn", {
            header: () => "Punch In",
            cell: (info) =>
              info.getValue()
                ? `${moment.utc(info.getValue()).format("hh:mm A")} (${
                    info.row.original.punchInOutdoor === 1
                      ? "Indoor"
                      : "Outdoor"
                  })`
                : "N/A",
            footer: (info) => info.column.id,
          }),
          columnHelper.accessor("punchOut", {
            header: () => "Punch Out",
            cell: (info) =>
              info.getValue()
                ? `${moment.utc(info.getValue()).format("hh:mm A")} ( ${
                    info.row.original.punchOutOutdoor === 1
                      ? "Indoor"
                      : "Outdoor"
                  } )`
                : "N/A",
          }),
        ]
      : []),
    columnHelper.accessor("location", {
      header: () => "Location",
      cell: (info) => {
        const location = info.getValue();
        // Get the first 3 words and add ellipsis
        const truncatedLocation =
          location.split(" ").slice(0, 3).join(" ") + "...";
        return truncatedLocation;
      },
      footer: (info) => info.column.id,
    }),
  ];

  const Idcolumns = [
    columnHelper.accessor((row) => row.id, {
      id: "id",
      cell: (info) => info.row.index + 1,
      header: () => <span>Sl.No</span>,
    }),
    columnHelper.accessor("attendanceDate", {
      header: () => "Attendance Date",
      cell: (info) => formatDate(info.getValue()),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("punchIn", {
      header: () => "Punch-In Time",
      cell: (info) => {
        const value = info.getValue();
        return value
          ? `${moment.utc(value).format("hh:mm A")} ( ${
              info.row.original.punchOutOutdoor === 1 ? "Indoor" : "Outdoor"
            } )`
          : "-- --";
      },
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("punchOut", {
      header: () => "Punch-Out Time",
      cell: (info) => {
        const value = info.getValue();
        return value
          ? `${moment.utc(value).format("hh:mm A")} ( ${
              info.row.original.punchOutOutdoor === 1 ? "Indoor" : "Outdoor"
            } )`
          : "-- --";
      },
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("punchOutOutdoor", {
      header: () => "Attendance Status",
      cell: (info) => {
        const value = info.getValue();
        if (value === 1 || value === 0) {
          return "Present";
        } else {
          return "Absent";
        }
      },
      footer: (info) => info.column.id,
    }),
  ];

  function extractEmployeeDetails(records: any): {
    empId: string | null;
    empName: string | null;
    designation: string | null;
  } {
    if (!records || records.length === 0) {
      return { empId: null, empName: null, designation: null };
    }

    const firstRecordWithDetails = records?.find(
      (record: any) => record.empId && record.empName && record.designation
    );

    if (firstRecordWithDetails) {
      return {
        empId: firstRecordWithDetails.empId,
        empName: firstRecordWithDetails.empName,
        designation: firstRecordWithDetails.designation,
      };
    } else {
      const firstRecord = records[0];
      return {
        empId: firstRecord.empId ?? null,
        empName: firstRecord.empName ?? null,
        designation: firstRecord.designation ?? null,
      };
    }
  }

  const employeeDetails = extractEmployeeDetails(
    databyId?.data?.length && databyId.data
  );

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          style={{ marginBottom: 22 }}
          startIcon={<ChevronLeft />}
          onClick={goPrevious}
        >
          Back
        </Button>
        <Button onClick={() => setShow(!show)}>
          Search by {!show ? "individual" : "all"}
        </Button>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {show ? (
          <div
            style={{ display: "flex", flexDirection: "column", width: "30%" }}
          >
            <label htmlFor="search">Search by Employee Id</label>
            <input
              id="search"
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                paddingInline: "1rem",
                paddingBlock: "0.5rem",
                border: "0.4px solid gray",
                borderRadius: "5px",
              }}
            />
          </div>
        ) : (
          <>
            {departments?.length && (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Typography fontSize={16} fontWeight={400} gutterBottom>
                  Department
                </Typography>
                <Grid xs={4} sm={4}>
                  <Select
                    size="small"
                    value={departmentfiltering ?? ""}
                    onChange={(e) => setDepartmentFiltering(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="">All Department</MenuItem>
                    {departments?.map((option: any, idx: number) => (
                      <MenuItem key={idx} value={option.label}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </div>
            )}
            <div
              style={{ display: "flex", flexDirection: "column", width: "20%" }}
            >
              <label htmlFor="staff">Staff Present/Absent</label>
              <select
                name="staff"
                id=""
                value={staff}
                onChange={(e) => setStaff(e.target.value)}
                style={{
                  paddingInline: "1rem",
                  paddingBlock: "0.5rem",
                  border: "0.4px solid gray",
                  borderRadius: "5px",
                }}
              >
                {/* <option value="all">All</option> */}
                <option value="present">Present</option>
                <option value="absent">Absent</option>
              </select>
            </div>
          </>
        )}
        <div style={{ display: "flex", flexDirection: "column", width: "13%" }}>
          <label htmlFor="date">From</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            style={{
              paddingInline: "1rem",
              paddingBlock: "0.5rem",
              border: "0.4px solid gray",
              borderRadius: "5px",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", width: "13%" }}>
          <label htmlFor="date">To</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            style={{
              paddingInline: "1rem",
              paddingBlock: "0.5rem",
              border: "0.4px solid gray",
              borderRadius: "5px",
            }}
          />
        </div>

        <LoadingButton
          startIcon={<FileDownloadIcon />}
          variant="contained"
          style={{ whiteSpace: "nowrap", height: "10%", marginTop: 22 }}
          onClick={() =>
            useAttendanceData(staff, startDate, endDate, show && databyId, show)
          }
        >
          Export excel data
        </LoadingButton>

        <LoadingButton
          startIcon={<FileDownloadIcon />}
          variant="contained"
          style={{ marginTop: 22 }}
          onClick={() => {
            if (!startDate || !endDate) {
              generatePDF(targetRef, { filename: "attendance-report.pdf" });
            } else {
              generateAttendancePDF(
                !show ? rangeAttendanceData : databyId,
                startDate,
                endDate
              );
            }
          }}
        >
          Download PDF
        </LoadingButton>
      </div>

      {isPending || loading ? (
        "Loading..."
      ) : (
        <TableFormat
          dataShow={!show ? false : true}
          data={!show ? data : databyId}
          columns={!show ? columns : Idcolumns}
          name={employeeDetails.empName ?? "N/A"}
          empId={employeeDetails?.empId ?? "N/A"}
          designation={employeeDetails?.designation ?? "N/A"}
          targetRef={targetRef}
          prosFilter={departmentfiltering}
        />
      )}
    </div>
  );
}
