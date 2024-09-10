import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
  Button,
  Divider,
  Input,
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
import * as React from "react";
import { IEmployee } from "../../../../api/employee/employee-types";
import EmployeesTableAction from "./employees-table-action";
import { LoadingButton } from "@mui/lab";
import { useExportEmployeeList } from "../../hooks/useExportEmployeesData";

const columnHelper = createColumnHelper<IEmployee>();

const columns = [
  columnHelper.accessor((row) => row.id, {
    id: "id",
    cell: (info) => info.row.index + 1,
    header: () => <span>Sl.No</span>,
  }),
  columnHelper.accessor("employeeId", {
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
  columnHelper.accessor((row) => row.emailId, {
    id: "emailId",
    cell: (info) => info.getValue(),
    header: () => <span>Email</span>,
    footer: (info) => info.column.id,
  }),

  columnHelper.accessor("phoneNumber", {
    header: () => "Phone Number",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("locationName", {
    header: () => "Location",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("joiningDate", {
    header: () => "Joining Date",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  })
];

interface Props {
  data?: IEmployee[];
}

export default function EmployeesTable(props: Props) {
  const data = props.data!;

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filtering, setFiltering] = React.useState("");

  const { exportEmployeesData, isPending: Pending } = useExportEmployeeList();

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter: filtering,
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
    <Stack gap={ 2 }>
      <div style={ { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 } }>
        <div style={ { width: "50%", display: "flex", alignItems: "center" } }>
          <Input
            type="text"
            placeholder="Search"
            style={ { width: "100%", marginRight: "2rem" } }
            onChange={ (e) => setFiltering(e.target.value) }
            value={ filtering ?? "" }
          />
          <Button variant="contained" type="button">
            Search
          </Button>
        </div>


        <LoadingButton
          startIcon={ <FileDownloadIcon /> }
          variant="contained"
          loading={ Pending }
          onClick={ () => exportEmployeesData() }
        >
          Export Employees List
        </LoadingButton>
      </div>

      <TableContainer component={ Paper } variant="outlined">
        <Table>
          <TableHead>
            { table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={ headerGroup.id }>
                { headerGroup.headers.map((header) => (
                  <TableCell key={ header.id }>
                    { header.isPlaceholder ? null : (
                      <Stack
                        direction="row"
                        alignItems="center"
                        gap={ 1 }
                        sx={ {
                          cursor: header.column.getCanSort()
                            ? "pointer"
                            : "default",
                        } }
                        { ...{
                          onClick: header.column.getToggleSortingHandler(),
                        } }
                      >
                        { flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        ) }
                        { {
                          asc: (
                            <ArrowUpwardIcon color="primary" fontSize="small" />
                          ),
                          desc: (
                            <ArrowDownwardIcon
                              color="primary"
                              fontSize="small"
                            />
                          ),
                        }[header.column.getIsSorted() as string] ?? null }
                      </Stack>
                    ) }
                  </TableCell>
                )) }
                <TableCell>Actions</TableCell>
              </TableRow>
            )) }
          </TableHead>
          <TableBody>
            { table.getRowModel().rows.map((row, index) => (
              <TableRow key={ row.id }>
                { row.getVisibleCells().map((cell) => (
                  <TableCell sx={ { overflowWrap: "break-word" } } key={ cell.id }>
                    { flexRender(cell.column.columnDef.cell, cell.getContext()) }
                  </TableCell>
                )) }
                <TableCell>
                  { props.data && (
                    <EmployeesTableAction
                      employee={ props?.data[index]! }
                      id={ row.original.id }
                    />
                  ) }
                </TableCell>
              </TableRow>
            )) }
          </TableBody>
        </Table>
      </TableContainer>
      <div className="h-4" />

      <Stack
        direction="row"
        gap={ 2 }
        alignItems="center"
        justifyContent="space-between"
      >
        <Pagination
          count={ table.getPageCount() }
          page={ table.getState().pagination.pageIndex + 1 }
          onChange={ handlePageChange }
          showFirstButton
          showLastButton
        />

        <Stack direction="row" flex={ 1 } justifyContent="flex-end" gap={ 2 }>
          <Stack direction="row" alignItems="center" gap={ 2 }>
            <Typography>Page</Typography>
            <Typography fontWeight={ 500 }>
              { table.getState().pagination.pageIndex + 1 } of{ " " }
              { table.getPageCount() }
            </Typography>
          </Stack>
          <Divider orientation="vertical" />
          <Typography display="flex" gap={ 1 } alignItems="center">
            Go to page:
            <TextField
              size="small"
              type="number"
              defaultValue={ table.getState().pagination.pageIndex + 1 }
              onChange={ (e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              } }
              className="border p-1 rounded w-16"
            />
          </Typography>
          <Select
            size="small"
            value={ table.getState().pagination.pageSize }
            onChange={ (e) => {
              table.setPageSize(Number(e.target.value));
            } }
          >
            { [5, 10, 20, 30, 40, 50].map((pageSize) => (
              <MenuItem key={ pageSize } value={ pageSize }>
                Show { pageSize }
              </MenuItem>
            )) }
          </Select>
        </Stack>
      </Stack>
    </Stack>
  );
}
