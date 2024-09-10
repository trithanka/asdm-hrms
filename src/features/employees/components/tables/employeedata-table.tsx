import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
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
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const columnHelper = createColumnHelper<any>();

const columns = [
  columnHelper.accessor((row) => row.id, {
    id: "id",
    cell: (info) => info.row.index + 1,
    header: () => <span>Sl.No</span>,
  }),
  columnHelper.accessor((row) => `${row.fisrtName} ${row.lastName}`, {
    id: "Name",
    header: () => "Name",
    cell: (info) => info.getValue(),
  }),
  // columnHelper.accessor("lastName", {
  //   header: () => "Last Name",
  //   cell: (info) => info.getValue(),
  // }),
  columnHelper.accessor("empId", {
    header: () => "Employee Id",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("phone", {
    header: () => "Phone Number",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("registrationId", {
    header: () => "View",
    cell: (info) => {
      const navigate = useNavigate();
      return (
        <Button
          variant="contained"
          sx={ {
            paddingTop: 1,
            paddingBottom: 1,
          } }
          onClick={ () => navigate(`/employees/${info.getValue()}`) }
        >
          <FaEye />
        </Button>
      );
    },
  }),
];

interface Props {
  data?: IEmployee[];
}

export default function EmployeeDataTable(props: Props) {
  const data = props.data!;

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filtering, setFiltering] = React.useState("");

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
              </TableRow>
            )) }
          </TableHead>
          <TableBody>
            { table.getRowModel().rows.map((row) => (
              <TableRow key={ row.id }>
                { row.getVisibleCells().map((cell) => (
                  <TableCell sx={ { overflowWrap: "break-word" } } key={ cell.id }>
                    { flexRender(cell.column.columnDef.cell, cell.getContext()) }
                  </TableCell>
                )) }
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
