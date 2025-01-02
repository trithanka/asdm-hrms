import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

import LeaveDetailCard from "../../leaves/components/cards/leave-detail-card";
import API from "../../../api";
import {
  Box,
  Divider,
  MenuItem,
  Pagination,
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
import {
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import moment from "moment";

export default function MonthlyAttendance() {
  const [filter, setFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [staff, setStaff] = useState("present");

  const [date, setDate] = useState(() => {
    // Initialize the state with the current date formatted as 'YYYY-MM-DD'
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const { isPending, data, refetch } = useQuery({
    queryKey: ["attendance", date, staff],
    queryFn: async () => {
      const res = await API.post(
        "https://hrms.skillmissionassam.org/nw/Dashboard/leave/activities",
        {
          staff: staff,
          date,
        }
      );

      return res.data;
    },
    retry: false,
    enabled: !!date || !!staff,
  });

  useEffect(() => {
    refetch();
  }, [date, refetch]);

  const table = useReactTable({
    data: data && data.data,
    columns,
    state: {
      sorting,
      globalFilter: filter,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    table.setPageIndex(value - 1);
  };

  return (
    <>
      <LeaveDetailCard title="Monthly Attendance">
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <div
            style={{ display: "flex", flexDirection: "column", width: "40%" }}
          >
            <label htmlFor="search">Search</label>
            <input
              id="search"
              type="text"
              placeholder="Search..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                paddingInline: "1rem",
                paddingBlock: "0.5rem",
                border: "0.4px solid gray",
                borderRadius: "5px",
              }}
            />
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", width: "25%" }}
          >
            <label htmlFor="staff">Staff Present/Absent</label>
            <select
              name="staff"
              onChange={(e) => setStaff(e.target.value)}
              value={staff}
              style={{
                paddingInline: "1rem",
                paddingBlock: "0.5rem",
                border: "0.4px solid gray",
                borderRadius: "5px",
              }}
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
            </select>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", width: "25%" }}
          >
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                paddingInline: "1rem",
                paddingBlock: "0.5rem",
                border: "0.4px solid gray",
                borderRadius: "5px",
              }}
            />
          </div>
        </Box>

        {isPending ? (
          "Loading..."
        ) : (
          <Stack mt={4}>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableCell key={header.id}>
                          {header.isPlaceholder ? null : (
                            <Stack
                              direction="row"
                              alignItems="center"
                              gap={1}
                              sx={{
                                cursor: header.column.getCanSort()
                                  ? "pointer"
                                  : "default",
                              }}
                              {...{
                                onClick:
                                  header.column.getToggleSortingHandler(),
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {{
                                asc: (
                                  <ArrowUpwardIcon
                                    color="primary"
                                    fontSize="small"
                                  />
                                ),
                                desc: (
                                  <ArrowDownwardIcon
                                    color="primary"
                                    fontSize="small"
                                  />
                                ),
                              }[header.column.getIsSorted() as string] ?? null}
                            </Stack>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableHead>
                <TableBody>
                  {table.getRowModel().rows.map((row: any) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell: any) => (
                        <TableCell
                          sx={{
                            overflowWrap: "break-word",
                            maxWidth: "500px",
                          }}
                          key={cell.id}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="h-4" />

            <Stack
              direction="row"
              gap={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <Pagination
                count={table.getPageCount()}
                page={table.getState().pagination.pageIndex + 1}
                onChange={handlePageChange}
                showFirstButton
                showLastButton
              />

              <Stack direction="row" flex={1} justifyContent="flex-end" gap={2}>
                <Stack direction="row" alignItems="center" gap={2}>
                  <Typography>Page</Typography>
                  <Typography fontWeight={500}>
                    {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                  </Typography>
                </Stack>
                <Divider orientation="vertical" />
                <Typography display="flex" gap={1} alignItems="center">
                  Go to page:
                  <TextField
                    size="small"
                    type="number"
                    defaultValue={table.getState().pagination.pageIndex + 1}
                    onChange={(e) => {
                      const page = e.target.value
                        ? Number(e.target.value) - 1
                        : 0;
                      table.setPageIndex(page);
                    }}
                    className="border p-1 rounded w-16"
                  />
                </Typography>
                <Select
                  size="small"
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => {
                    table.setPageSize(Number(e.target.value));
                  }}
                >
                  {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                    <MenuItem key={pageSize} value={pageSize}>
                      Show {pageSize}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Stack>
          </Stack>
        )}
      </LeaveDetailCard>
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
  columnHelper.accessor("empId", {
    header: () => "Employee ID",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor(
    (row) => `${row.firstName} ${row.middleName} ${row.lastName}`,
    {
      id: "name",
      header: () => "Name",
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
    }
  ),
  columnHelper.accessor("designation", {
    header: () => "Designation",
    cell: (info) => info.getValue() ?? "N/A",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("phone", {
    header: () => "Phone Number",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.punchIn, {
    id: "punchIn",
    cell: (info) =>
      info.getValue()
        ? `${moment.utc(info.getValue()).format("DD/MM/YYYY hh:mm A")} (${info.row.original.punchInOutdoor === 1
          ? "Indoor"
          : "Outdoor"
        })`
        : null,
    header: () => <span>Punch In</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.punchOut, {
    id: "punchOut",
    cell: (info) =>
      info.getValue()
        ? `${moment.utc(info.getValue()).format("DD/MM/YYYY hh:mm A")} ( ${info.row.original.punchOutOutdoor === 1 ? "Indoor" : "Outdoor"
        } )`
        : "N/A",
    header: () => <span>Punch Out</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("location", {
    header: () => "Location",
    cell: (info) => {
      const location = info.getValue();
      // Get the first 3 words and add ellipsis
      const truncatedLocation = location.split(' ').slice(0, 3).join(' ') + "...";
      return truncatedLocation;
    },
    footer: (info) => info.column.id,
  }),
];
