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
      id: "name_designation",
      header: () => "Name & Designation",
      cell: (info) => (
        <Stack gap={0.5}>
          <Typography variant="body2" fontWeight={500}>
            {info.getValue()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {info.row.original.designation ?? "N/A"}
          </Typography>
        </Stack>
      ),
      footer: (info) => info.column.id,
    }
  ),
  columnHelper.accessor((row) => row.emailId, {
    id: "contact_info",
    cell: (info) => (
      <Stack gap={0.5}>
        <Typography variant="caption" color="text.secondary">{info.getValue()}</Typography>
        <Typography variant="caption" color="text.secondary">
          {info.row.original.phoneNumber}
        </Typography>
      </Stack>
    ),
    header: () => "Contact Info",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("joiningDate", {
    header: () => "Joining Date",
    cell: (info) => {
      const dateStr = info.getValue() as string;
      if (!dateStr) return "N/A";
      // Assuming dateStr is "YYYY-MM-DD", this converts to "DD-MM-YYYY"
      const formatted = dateStr.split("-").reverse().join("-");
      return <Typography variant="caption" color="text.secondary" style={{ whiteSpace: "nowrap" }}>{formatted}</Typography>;
    },
    footer: (info) => info.column.id,
  })
];

interface Props {
  data?: IEmployee[];
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  limit: number;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  total?: number;
  search?: string;
  setSearch?: React.Dispatch<React.SetStateAction<string>>;
}

export default function EmployeesTable(props: Props) {
  const data = props.data || [];

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filtering, setFiltering] = React.useState(props.search ?? "");

  const { exportEmployeesData, isPending: Pending } = useExportEmployeeList();

  const pagination = React.useMemo(
    () => ({
      pageIndex: props.page,
      pageSize: props.limit,
    }),
    [props.page, props.limit]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter: filtering,
      pagination,
    },
    manualPagination: true,
    manualFiltering: true,
    pageCount: props.total && props.limit ? Math.ceil(props.total / props.limit) : -1,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    props.setPage(value - 1);
  };

  return (
    <Stack gap={2}>
      <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <div style={{ width: "50%", display: "flex", alignItems: "center" }}>
          <Input
            type="text"
            placeholder="Search"
            style={{ width: "100%", marginRight: "2rem" }}
            onChange={(e) => {
              const val = e.target.value;
              setFiltering(val);
              if (val === "" && props.setSearch) {
                props.setSearch("");
                props.setPage(0);
              }
            }}
            value={filtering ?? ""}
            onKeyDown={(e) => {
              if (e.key === "Enter" && props.setSearch) {
                props.setSearch(filtering);
                props.setPage(0);
              }
            }}
          />
          <Button 
            variant="contained" 
            type="button"
            onClick={() => {
              if (props.setSearch) {
                props.setSearch(filtering);
                props.setPage(0);
              }
            }}
          >
            Search
          </Button>
        </div>


        <LoadingButton
          startIcon={<FileDownloadIcon />}
          variant="contained"
          loading={Pending}
          onClick={() => exportEmployeesData()}
        >
          Export Employees List
        </LoadingButton>
      </div>

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
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: (
                            <ArrowUpwardIcon color="primary" fontSize="small" />
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
                <TableCell sx={{ width: "60px", p: 1, textAlign: "center" }}>Actions</TableCell>
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{
                  backgroundColor:
                    row.original.approved === 1
                      ? "rgba(76, 175, 80, 0.1)"
                      : row.original.approved === 0
                        ? "rgba(244, 67, 54, 0.1)"
                        : "inherit",
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell sx={{ overflowWrap: "break-word" }} key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
                <TableCell sx={{ width: "60px", p: 1, textAlign: "center" }}>
                  <EmployeesTableAction
                    employee={row.original}
                    id={row.original.id}
                  />
                </TableCell>
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
          siblingCount={0}
          boundaryCount={1}
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
          <Select
            size="small"
            value={props.limit}
            onChange={(e) => {
              props.setLimit(Number(e.target.value));
              props.setPage(0);
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <MenuItem key={pageSize} value={pageSize}>
                Show {pageSize}
              </MenuItem>
            ))}
            <MenuItem value={1000000}>All</MenuItem>
          </Select>
        </Stack>
      </Stack>
    </Stack>
  );
}
