import { LoadingButton } from "@mui/lab";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useEffect, useRef, useState } from "react";
import { useLeaveReport } from "../hooks/useFetchEmployeeCount";
import { useQuery } from "@tanstack/react-query";
import API from "../../../api";
import { ChevronLeft } from "@mui/icons-material";
import { createColumnHelper } from "@tanstack/react-table";
import { Button } from "@mui/material";
import TableFormat from "./table";
import generatePDF from "react-to-pdf";
import { formatToMediumDate } from "../../../utils/formatter";


export default function LeaveReport({ goPrevious }: any) {
  const [startDate, setDate] = useState("");
  const [endDate, setToDate] = useState("");
  const [type, setType] = useState("pending");
  const [leaveType, setLeaveType] = useState("cl");



  const { isPending, data, refetch } = useQuery({
    queryKey: ["leaveReport", type, startDate, endDate, leaveType],
    queryFn: async () => {
      const res = await API.post(
        `LeaveApproval/leaveList/${type}`,
        {
          startDate: startDate,
          endDate: endDate,
          type: leaveType,
        }
      );
      return res.data;
    },
    retry: false,
    enabled: !!startDate || !!endDate || !!type || !!leaveType,
  });

  useEffect(() => {
    refetch()
  }, [startDate, endDate, leaveType, refetch]);


  const targetRef = useRef(null);



  const capitalizeWords = (str: string) => {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  };

  const columnHelper = createColumnHelper<any>();

  const columns = [
    columnHelper.accessor((row) => row.id, {
      id: "id",
      cell: (info) => info.row.index + 1,
      header: () => <span>Sl.No</span>,
    }),
    columnHelper.accessor("empName", {
      header: () => "Employee ID",
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("name", {
      header: () => "Name",
      cell: (info) => capitalizeWords(info.getValue()),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("designation", {
      header: () => "Designation",
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
    }),
    ...(type === "" ? [
      columnHelper.accessor("bApproval", {
        id: "status",
        header: () => "Leave Status",
        cell: (info) => {
          const value = info.getValue()
          const pendingValue = info.row.original.bPending;
          if (pendingValue === 1) {
            return "Pending"
          } else if (value === 1) {
            return "Approved";
          }
          return "Rejected"
        },
        footer: (info) => info.column.id,
      }),]
      : []),
    columnHelper.accessor("appliedDate", {
      header: () => "Applied Date",
      cell: (info) => formatToMediumDate(info.getValue()),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("type", {
      header: () => "Type of Leave",
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
    }),
  ]

  return (
    <div style={ { width: "100%", display: "flex", flexDirection: "column" } }>
      <div style={ { display: "flex", justifyContent: "space-around", alignItems: "center" } }>
        <Button style={ { marginTop: 22 } } startIcon={ <ChevronLeft /> } onClick={ goPrevious }>
          Back
        </Button>
        <div style={ { display: "flex", flexDirection: "column", width: "20%" } }>
          <label htmlFor="type">Leave Status</label>
          <select name="type" id=""
            value={ type }
            onChange={ (e) => setType(e.target.value) }
            style={ {
              paddingInline: "1rem",
              paddingBlock: "0.5rem",
              border: "0.4px solid gray",
              borderRadius: "5px",
            } }>
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div style={ { display: "flex", flexDirection: "column", width: "10%" } }>
          <label htmlFor="leave-type">Leave Type</label>
          <select name="leaveType" id=""
            value={ leaveType }
            onChange={ (e) => setLeaveType(e.target.value) }
            style={ {
              paddingInline: "1rem",
              paddingBlock: "0.5rem",
              border: "0.4px solid gray",
              borderRadius: "5px",
            } }>
            <option value="">All</option>
            <option value="ml">ML</option>
            <option value="cl">CL</option>
            <option value="pl">PL</option>
          </select>
        </div>
        <div style={ { display: "flex", flexDirection: "column", width: "12%" } }>
          <label htmlFor="date">From</label>
          <input type="date" value={ startDate } onChange={ (e) => setDate(e.target.value) } max={ new Date().toISOString().split("T")[0] } style={ {
            paddingInline: "1rem",
            paddingBlock: "0.5rem",
            border: "0.4px solid gray",
            borderRadius: "5px",
          } } />
        </div>

        <div style={ { display: "flex", flexDirection: "column", width: "12%" } }>
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
          style={ { height: "10%", marginTop: 22 } }
          variant="contained"
          onClick={ () => useLeaveReport(type, startDate, endDate) }>
          Export excel Data
        </LoadingButton>

        <LoadingButton
          startIcon={ <FileDownloadIcon /> }
          style={ { marginTop: 22 } }
          variant="contained"
          onClick={ () => generatePDF(targetRef, { filename: "leave-report.pdf" }) }
        >
          Download PDF
        </LoadingButton>



      </div>

      { isPending ? (
        "Loading..."
      ) : (
        // <Stack mt={ 4 }>
        //   <TableContainer component={ Paper } variant="outlined">
        //     <div style={ { width: "50%", display: "flex", alignItems: "center", margin: 20 } }>
        //       <Input
        //         type="text"
        //         placeholder="Search"
        //         style={ { width: "100%", marginRight: "2rem" } }
        //         onChange={ (e) => setFilter(e.target.value) }
        //         value={ filter ?? "" }
        //       />
        //     </div>
        //     <Table>
        //       <TableHead>
        //         { table.getHeaderGroups().map((headerGroup) => (
        //           <TableRow key={ headerGroup.id }>
        //             { headerGroup.headers.map((header) => (
        //               <TableCell key={ header.id }>
        //                 { header.isPlaceholder ? null : (
        //                   <Stack
        //                     direction="row"
        //                     alignItems="center"
        //                     gap={ 1 }
        //                     sx={ {
        //                       cursor: header.column.getCanSort()
        //                         ? "pointer"
        //                         : "default",
        //                     } }
        //                     { ...{
        //                       onClick:
        //                         header.column.getToggleSortingHandler(),
        //                     } }
        //                   >
        //                     { flexRender(
        //                       header.column.columnDef.header,
        //                       header.getContext()
        //                     ) }
        //                     { {
        //                       asc: (
        //                         <ArrowUpwardIcon
        //                           color="primary"
        //                           fontSize="small"
        //                         />
        //                       ),
        //                       desc: (
        //                         <ArrowDownwardIcon
        //                           color="primary"
        //                           fontSize="small"
        //                         />
        //                       ),
        //                     }[header.column.getIsSorted() as string] ?? null }
        //                   </Stack>
        //                 ) }
        //               </TableCell>
        //             )) }
        //           </TableRow>
        //         )) }
        //       </TableHead>
        //       <TableBody>
        //         { table.getRowModel().rows.map((row: any) => (
        //           <TableRow key={ row.id }>
        //             { row.getVisibleCells().map((cell: any) => (
        //               <TableCell
        //                 sx={ {
        //                   overflowWrap: "break-word",
        //                   maxWidth: "500px",
        //                 } }
        //                 key={ cell.id }
        //               >
        //                 { flexRender(
        //                   cell.column.columnDef.cell,
        //                   cell.getContext()
        //                 ) }
        //               </TableCell>
        //             )) }
        //           </TableRow>
        //         )) }
        //       </TableBody>
        //     </Table>
        //   </TableContainer>
        //   <div className="h-4" />

        //   <Stack
        //     direction="row"
        //     gap={ 2 }
        //     alignItems="center"
        //     justifyContent="space-between"
        //   >
        //     <Pagination
        //       count={ table.getPageCount() }
        //       page={ table.getState().pagination.pageIndex + 1 }
        //       onChange={ handlePageChange }
        //       showFirstButton
        //       showLastButton
        //     />

        //     <Stack direction="row" flex={ 1 } justifyContent="flex-end" gap={ 2 }>
        //       <Stack direction="row" alignItems="center" gap={ 2 }>
        //         <Typography>Page</Typography>
        //         <Typography fontWeight={ 500 }>
        //           { table.getState().pagination.pageIndex + 1 } of{ " " }
        //           { table.getPageCount() }
        //         </Typography>
        //       </Stack>
        //       <Divider orientation="vertical" />
        //       <Typography display="flex" gap={ 1 } alignItems="center">
        //         Go to page:
        //         <TextField
        //           size="small"
        //           type="number"
        //           defaultValue={ table.getState().pagination.pageIndex + 1 }
        //           onChange={ (e) => {
        //             const page = e.target.value
        //               ? Number(e.target.value) - 1
        //               : 0;
        //             table.setPageIndex(page);
        //           } }
        //           className="border p-1 rounded w-16"
        //         />
        //       </Typography>
        //       <Select
        //         size="small"
        //         value={ table.getState().pagination.pageSize }
        //         onChange={ (e) => {
        //           table.setPageSize(Number(e.target.value));
        //         } }
        //       >
        //         { [5, 10, 20, 30, 40, 50].map((pageSize) => (
        //           <MenuItem key={ pageSize } value={ pageSize }>
        //             Show { pageSize }
        //           </MenuItem>
        //         )) }
        //       </Select>
        //     </Stack>
        //   </Stack>
        // </Stack>
        <TableFormat data={ data } columns={ columns } targetRef={ targetRef } />
      ) }
    </div>
  );
}
