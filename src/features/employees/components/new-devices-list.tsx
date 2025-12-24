import { PhoneAndroid } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Paper,
  Stack,
  Switch,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  Button,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import * as React from "react";
import toast from "react-hot-toast";
import { enableDevice } from "../../../api/employee/employee-api";
import useDevices from "../hooks/useDevices";
import { formatToLongDate } from "../../../utils/formatter";


export default function NewDevicesList() {
  const [currentTab, setCurrentTab] = React.useState(0);
  const [deviceStatus, setDeviceStatus] = React.useState("pending");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const { isPending, data, refetch } = useDevices(undefined, deviceStatus, page, rowsPerPage);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
    setPage(0); // Reset page on tab change
    if (newValue === 0) setDeviceStatus("pending");
    if (newValue === 1) setDeviceStatus("approved");
    if (newValue === 2) setDeviceStatus("disabled");
  };

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const { isPending: isDeviceEnableMutate, mutate } = useMutation({
    mutationFn: enableDevice,
    onSuccess(data) {
      if (data?.status === "success") {
        toast.success("New Device Enabled");
        refetch();
      }
      if (data?.status === "failed" || data?.status === "error") {
        toast.error(data?.message);
      }
    },
    onError() {
      toast.error("Something went wrong");
    },
  });

  function deviceHandler(
    event: React.ChangeEvent<HTMLInputElement>,
    id: number,
    empCode: number
  ) {
    if (!event.target.checked) return;
    mutate({
      empCode,
      id,
    });
  }

  if (isPending) {
    return (
      <Stack py={6} justifyContent="center" alignItems="center">
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Stack px={3} pt={4}>
      <Typography variant="h6" fontWeight={500} pb={3}>
        New Devices Lists
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="device status tabs"
        >
          <Tab label="Pending" />
          <Tab label="Approved" />
          <Tab label="Disabled" />
        </Tabs>
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell style={{ whiteSpace: "nowrap" }}>Employee ID</TableCell>
              <TableCell style={{ whiteSpace: "nowrap" }}>Employee Name</TableCell>
              <TableCell style={{ whiteSpace: "nowrap" }}>Designation</TableCell>
              <TableCell>Request Time</TableCell>
              <TableCell>Device Name</TableCell>
              <TableCell>Device Id</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.deviceList?.map((device, index: number) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell scope="row">
                  <Typography variant="body2" display="flex">
                    {device.empName ?? "No Id"}
                  </Typography>
                </TableCell>
                <TableCell scope="row">
                  <Typography variant="body2" display="flex">
                    {device.name ?? "No Name"}
                  </Typography>
                </TableCell>
                <TableCell scope="row">
                  <Typography variant="body2" display="flex">
                    {device.designation}
                  </Typography>
                </TableCell>
                <TableCell scope="row">
                  <Typography variant="body2" display="flex">
                    {device.date ? formatToLongDate(device.date) : "N/A"}
                  </Typography>
                </TableCell>
                <TableCell component="th" scope="row">
                  <Stack spacing={0.5}>
                    {device?.approvalType === "swap device" ? (
                      <>
                        <Typography variant="body2" display="flex" gap={1}>
                          <PhoneAndroid fontSize="small" color="success" />
                          <span style={{ fontWeight: 600 }}>Active:</span>
                          {device?.activeDeviceName ?? "N/A"}
                        </Typography>
                        <Typography variant="body2" display="flex" gap={1}>
                          <PhoneAndroid fontSize="small" color="warning" />
                          <span style={{ fontWeight: 600 }}>Pending:</span>
                          {device?.pendingDeviceName ?? "N/A"}
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="body2" display="flex" gap={2}>
                        <PhoneAndroid fontSize="small" color="action" />
                        {device?.pendingDeviceName ??
                          device?.activeDeviceName ??
                          device?.deviceName ??
                          "No Device Name"}
                      </Typography>
                    )}
                  </Stack>
                </TableCell>
                <TableCell scope="row">
                  <Typography variant="body2" color="GrayText">
                    {device?.pendingDeviceUUID ??
                      device?.activeDeviceUUID ??
                      device?.uuid ??
                      "No UUID"}
                  </Typography>
                </TableCell>
                <TableCell
                  scope="row"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {deviceStatus === "disabled" ? null : device?.status === 1 ? (
                    <Tooltip title="Active Device">
                      <Typography
                        variant="caption"
                        textTransform="uppercase"
                        fontWeight={500}
                        color="success.main"
                      >
                        Active
                      </Typography>
                    </Tooltip>
                  ) : (
                    <Box display="flex" gap={1}>
                      {isDeviceEnableMutate ? (
                        <CircularProgress color="info" size={20} />
                      ) : (
                        <>
                          {(device?.approvalType === "swap old device" || device?.approvalType === "approved new device") && (
                            <Button
                              variant="contained"
                              color="warning"
                              size="small"
                              onClick={() =>
                                mutate({
                                  empCode: device.empCode,
                                  id: device.pendingDevicePklId ?? device.id,
                                })
                              }
                            >
                              {device?.approvalType.toUpperCase()}
                            </Button>
                          )}
                          {device?.approvalType === "approve device" && (
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              onClick={() =>
                                mutate({
                                  empCode: device.empCode,
                                  id: device.pendingDevicePklId ?? device.id,
                                })
                              }
                            >
                              Approve Device
                            </Button>
                          )}
                          {/* Fallback for legacy/undefined types */}
                          {!device?.approvalType && (
                            <Switch
                              onChange={(event) =>
                                deviceHandler(
                                  event,
                                  device?.pendingDevicePklId ?? device?.id,
                                  device?.empCode
                                )
                              }
                            />
                          )}
                        </>
                      )}
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={data?.total ?? 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>
    </Stack>
  );
}
