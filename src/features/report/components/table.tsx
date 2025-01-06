import { useState } from "react";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Divider,
  Input,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  Stack,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

interface TableFormatProps {
  data: any;
  columns: any[];
  targetRef: any;
  dataShow?: any;
  name?: string;
  empId?: string;
  designation?: string;
  prosFilter?: string;
}
export default function TableFormat({
  data,
  columns,
  dataShow = false,
  name,
  empId,
  designation,
  targetRef,
  prosFilter,
}: TableFormatProps) {
  const [filter, setFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data: (data && data?.data) || data?.employeeList,
    columns,
    state: {
      sorting,
      globalFilter: filter ? filter : prosFilter,
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
    <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
      {/* <div style={ { display: "flex", justifyContent: "space-around" } }>
        <div style={ { display: "flex", flexDirection: "column", width: "20%" } }>
          <label htmlFor="type">Type</label>
          <select name="type" id=""
            value={ type }
            onChange={ (e) => setType(e.target.value) }
            style={ {
              paddingInline: "1rem",
              paddingBlock: "0.5rem",
              border: "0.4px solid gray",
              borderRadius: "5px",
            } }>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>

          </select>
        </div>
        <div style={ { display: "flex", flexDirection: "column", width: "20%" } }>
          <label htmlFor="date">From</label>
          <input type="date" value={ startDate } onChange={ (e) => setDate(e.target.value) } max={ new Date().toISOString().split("T")[0] } style={ {
            paddingInline: "1rem",
            paddingBlock: "0.5rem",
            border: "0.4px solid gray",
            borderRadius: "5px",
          } } />
        </div>

        <div style={ { display: "flex", flexDirection: "column", width: "20%" } }>
          <label htmlFor="date">To</label>
          <input type="date" value={ endDate } onChange={ (e) => setToDate(e.target.value) } max={ new Date().toISOString().split("T")[0] } style={ {
            paddingInline: "1rem",
            paddingBlock: "0.5rem",
            border: "0.4px solid gray",
            borderRadius: "5px",
          } } />
        </div>
        <LoadingButton
          startIcon={ <FileDownloadIcon /> }
          variant="contained"
          onClick={ () => useLeaveReport(type, startDate, endDate) }>
          Export Employees Data
        </LoadingButton>
      </div> */}

      <Stack mt={4}>
        <TableContainer component={Paper} variant="outlined" ref={targetRef}>
          <div
            style={{
              width: "50%",
              display: "flex",
              alignItems: "center",
              margin: 20,
            }}
          >
            {dataShow ? (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Typography>Name: {name}</Typography>
                <Typography>Employee ID: {empId}</Typography>
                <Typography>Designation: {designation}</Typography>
              </div>
            ) : (
              <Input
                type="text"
                placeholder="Search"
                style={{ width: "100%", marginRight: "2rem" }}
                onChange={(e) => setFilter(e.target.value)}
                value={filter ?? ""}
              />
            )}
          </div>
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
                            onClick: header.column.getToggleSortingHandler(),
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
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
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
    </div>
  );
}

// const capitalizeWords = (str: string) => {
//   return str.replace(/\b\w/g, char => char.toUpperCase());
// };

// const columnHelper = createColumnHelper<any>();

// const columns = [
//   columnHelper.accessor((row) => row.id, {
//     id: "id",
//     cell: (info) => info.row.index + 1,
//     header: () => <span>Sl.No</span>,
//   }),
//   columnHelper.accessor("empName", {
//     header: () => "Employee ID",
//     cell: (info) => info.getValue(),
//     footer: (info) => info.column.id,
//   }),
//   columnHelper.accessor("name", {
//     header: () => "Name",
//     cell: (info) => capitalizeWords(info.getValue()),
//     footer: (info) => info.column.id,
//   }),
//   columnHelper.accessor("designation", {
//     header: () => "Designation",
//     cell: (info) => info.getValue(),
//     footer: (info) => info.column.id,
//   }),
//   columnHelper.accessor("appliedDate", {
//     header: () => "Applied Date",
//     cell: (info) => info.getValue(),
//     footer: (info) => info.column.id,
//   }),
//   columnHelper.accessor("type", {
//     header: () => "Type of Leave",
//     cell: (info) => info.getValue(),
//     footer: (info) => info.column.id,
//   }),
// ]
