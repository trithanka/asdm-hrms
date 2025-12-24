import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchEmployeeActivity } from "../api/dashboard/dashboard-api";
import EmployeeActivityTable from "../features/employees/components/tables/employeeactivity-table";
import { createColumnHelper } from "@tanstack/react-table";
import { Box, Button } from "@mui/material";
import BackButton from "../components/backbutton";
import { formatDate } from "../utils/formatter";
import { FaEye } from "react-icons/fa";
import moment from "moment";

export default function EmployeeActivity() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const param = searchParams.get("staff");

  if (!param) return <>{navigate(-1)}</>;

  const { isLoading, data } = useQuery({
    queryKey: [`staff${param}`],
    queryFn: () => fetchEmployeeActivity(param!),
  });

  const columnHelper = createColumnHelper<any>();

  const columns = [
    columnHelper.accessor((row) => row.id, {
      id: "id",
      cell: (info) => info.row.index + 1,
      header: () => <span>Sl.No</span>,
    }),
    columnHelper.accessor("fullName", {
      id: "name",
      header: () => "Name",
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("empId", {
      header: () => "Employee Id",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("phone", {
      header: () => "Phone Number",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("designation", {
      header: () => "Designation",
      cell: (info) => info.getValue(),
    }),
    ...(param === "active"
      ? [
        columnHelper.accessor("joiningDate", {
          header: () => "Joining Date",
          cell: (info) => info.getValue(),
        }),
      ]
      : []),
    ...(param === "resigned"
      ? [
        columnHelper.accessor("releaseDate", {
          header: () => "Release Date",
          cell: (info) => formatDate(info.getValue()),
        }),
      ]
      : []),
    ...(param === "absent"
      ? [
        columnHelper.accessor("registrationId", {
          header: () => "View",
          cell: (info) => {
            return (
              <Button
                variant="contained"
                sx={{
                  paddingTop: 1,
                  paddingBottom: 1,
                }}
                onClick={() => navigate(`/employees/${info.getValue()}`)}
              >
                <FaEye />
              </Button>
            );
          },
        }),
      ]
      : []),
    ...(param === "present"
      ? [
        columnHelper.accessor("attendanceDate", {
          header: () => "Date",
          cell: (info) => info.getValue() ? moment(info.getValue()).format("DD/MM/YYYY") : "N/A",
        }),
      ]
      : []),
    ...(param === "present"
      ? [
        columnHelper.accessor("checkIn", {
          header: () => "Check In",
          cell: (info) =>
            info.getValue()
              ? `${moment(info.getValue(), "HH:mm:ss").format("hh:mm A")}`
              : "N/A",
        }),
      ]
      : []),
    ...(param === "present"
      ? [
        columnHelper.accessor("checkOut", {
          header: () => "Check Out",
          cell: (info) =>
            info.getValue()
              ? `${moment(info.getValue(), "HH:mm:ss").format("hh:mm A")}`
              : "N/A",
        }),
      ]
      : []),
    columnHelper.accessor("location", {
      header: () => "Location",
      cell: (info) => {
        const location = info.getValue();
        if (!location) return "N/A";
        return location.split('\n')[0];
      },
    })
  ];

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : data.data ? (
        <div>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <h2>
              {param == "present"
                ? "Present Employees Data"
                : param == "absent"
                  ? "Absent Employees Data"
                  : param == "leave"
                    ? "Leave Employees Data"
                    : null}{" "}
              ({moment(Date.now()).format("DD/MM/YYYY")})
            </h2>
            <BackButton />
          </Box>
          <EmployeeActivityTable
            columns={columns}
            data={data?.data}
            route={param}
          />
        </div>
      ) : (
        <p>Something went wrong</p>
      )}
    </>
  );
}
