import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
  Button,
  Divider,
  Grid,
  Input,
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
  // const [showFilter, setShowFilter] = React.useState(true);
  const [departmentfiltering, setDepartmentFiltering] = React.useState("MIS");
  // const [datefiltering, setDateFiltering] = React.useState("");

  // const todayDate = new Date().toISOString().split('T')[0];


  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter: filtering ? filtering : departmentfiltering,
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
      { route === "leave" &&
        <Stack>
          <Grid display="flex" justifyContent={ "end" }>
            <LoadingButton
              variant="contained"
              startIcon={ <FileDownloadIcon /> }
              onClick={ () => useExportStaffList(data, route) }
            >
              Export Staff on leave list
            </LoadingButton>
          </Grid>
        </Stack> }
      { route === "absent" &&
        <Stack>
          <Grid display="flex" justifyContent="end">
            <LoadingButton
              variant="contained"
              startIcon={ <FileDownloadIcon /> }
              onClick={ () => useExportStaffList(data, route) }
            >
              Export staff absent list
            </LoadingButton>
          </Grid>
        </Stack>
      }
      { route === "present" &&
        <Stack>
          <Grid display="flex" justifyContent="end">
            <LoadingButton
              variant="contained"
              startIcon={ <FileDownloadIcon /> }
              onClick={ () => useExportStaffList(data, route) }
            >
              Export staff present list
            </LoadingButton>
          </Grid>
        </Stack>
      }

        <>
          {/* <Grid item width={ 20 }>
            <Button onClick={ () => setShowFilter(false) } sx={ { cursor: "pointer" } }>
              <FilterAltIcon color="primary" />
            </Button>
          </Grid> */}
          <Stack direction="row" mt={"-50px"}>
            { departments?.length &&
              <div style={ { display: "flex", alignItems: "center", gap: 5 } }>
                <div>
                  <Typography variant="caption" fontWeight={ 500 } gutterBottom>
                    Department
                  </Typography>
                  <Grid item xs={ 4 } sm={ 4 }>
                    <MuiSelect
                      size="small"
                      value={ departmentfiltering ?? "" }
                      onChange={ (e) => setDepartmentFiltering(e.target.value) }
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        Select Department
                      </MenuItem>
                      { departments?.map((option: any, idx: number) => (
                        <MenuItem key={ idx } value={ option.label }>
                          { option.label }
                        </MenuItem>
                      )) }
                    </MuiSelect>
                  </Grid>
                </div>
                {/* <div style={ { paddingLeft: 20, paddingRight: 20 } }>
                  <Typography variant="caption" fontWeight={ 500 } gutterBottom>
                    { route == "active" ?
                      "Date of joining"
                      :
                      "Release Date"
                    }
                  </Typography>
                  <Paper variant="outlined" sx={ {
                    p: 0.5,
                  } } >
                    <Input
                      type="date"
                      value={ datefiltering }
                      onChange={ (e) => setDateFiltering(e.target.value) }
                      inputProps={ {
                        max: todayDate,
                      } }
                    />
                  </Paper>
                </div> */}
                <div style={ { width: 10, height: 10 } }>
                  <Button variant="outlined" onClick={ () => { setDepartmentFiltering("") } }>
                    Reset
                  </Button>
                </div>
              </div>
            }
          </Stack>
        </>
        {/* <Grid item width={ 20 }>
          <Button onClick={ () => setShowFilter(true) } sx={ { cursor: "pointer" } }>
            <FilterAltOffIcon color="primary" />
          </Button>
        </Grid> */}


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
