import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
  Button,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select as MuiSelect,
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
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";
import { IEmployee } from "../../../../api/employee/employee-types";
import useFilters from "../../hooks/useFilters";
import { LoadingButton } from "@mui/lab";
import { useExportStaffList } from "../../hooks/useExportEmployeesData";

interface Props {
  data: IEmployee[];
  columns: any;
  route: any;
}


export default function EmployeeActivityTable(props: Props) {
  const data = props.data!;
  const columns = props.columns;
  const route = props.route;

  const { departments } = useFilters();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filtering, setFiltering] = React.useState("");
  const [departmentfiltering, setDepartmentFiltering] = React.useState("");

  const filteredData = React.useMemo(() => {
    return data.filter((employee: any) => {
      const matchesSearch =
        !filtering ||
        Object.values(employee).some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(filtering.toLowerCase())
        );

      const matchesDepartment =
        !departmentfiltering ||
        String(employee.departmentName ?? "")
          .toLowerCase()
          .includes(departmentfiltering.toLowerCase());

      return matchesSearch && matchesDepartment;
    });
  }, [data, filtering, departmentfiltering]);


  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
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
    <Stack gap={2}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", md: "flex-end" }}
        justifyContent="space-between"
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", md: "flex-end" }}
          sx={{ width: "100%" }}
        >
          <Stack sx={{ width: { xs: "100%", md: 360 } }}>
            <Typography variant="caption" fontWeight={500} gutterBottom>
              Search
            </Typography>
            <Input
              type="text"
              placeholder="Search"
              onChange={(e) => setFiltering(e.target.value)}
              value={filtering ?? ""}
              fullWidth
            />
          </Stack>
          {!!departments?.length && (
            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel>Department</InputLabel>
              <MuiSelect
                value={departmentfiltering}
                label="Department"
                onChange={(e) => setDepartmentFiltering(e.target.value)}
              >
                <MenuItem value="">All Departments</MenuItem>
                {departments.map((option: any, idx: number) => (
                  <MenuItem key={idx} value={option.label}>
                    {option.label}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
          )}
          <Button
            variant="outlined"
            onClick={() => {
              setFiltering("");
              setDepartmentFiltering("");
            }}
            sx={{ alignSelf: { xs: "stretch", md: "flex-end" } }}
          >
            Reset
          </Button>
        </Stack>
      </Stack>
      { route === "leave" &&
        <Stack>
          <Stack direction="row" justifyContent="end">
            <LoadingButton
              variant="contained"
              startIcon={ <FileDownloadIcon /> }
              onClick={ () => useExportStaffList(filteredData, route) }
            >
              Export Staff on leave list
            </LoadingButton>
          </Stack>
        </Stack> }
      { route === "absent" &&
        <Stack>
          <Stack direction="row" justifyContent="end">
            <LoadingButton
              variant="contained"
              startIcon={ <FileDownloadIcon /> }
              onClick={ () => useExportStaffList(filteredData, route) }
            >
              Export staff absent list
            </LoadingButton>
          </Stack>
        </Stack>
      }
      { route === "present" &&
        <Stack>
          <Stack direction="row" justifyContent="end">
            <LoadingButton
              variant="contained"
              startIcon={ <FileDownloadIcon /> }
              onClick={ () => useExportStaffList(filteredData, route) }
            >
              Export staff present list
            </LoadingButton>
          </Stack>
        </Stack>
      }
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
            { table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={ row.id }>
                  { row.getVisibleCells().map((cell) => (
                    <TableCell
                      sx={ { overflowWrap: "break-word" } }
                      key={ cell.id }
                    >
                      { flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      ) }
                    </TableCell>
                  )) }
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={ columns.length } align="center">
                  No Employees Data Found
                </TableCell>
              </TableRow>
            ) }
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
          <MuiSelect
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
          </MuiSelect>
        </Stack>
      </Stack>
    </Stack >
  );
}
