import { PhoneAndroid } from "@mui/icons-material";
import {
  CircularProgress,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import * as React from "react";
import toast from "react-hot-toast";
import { enableDevice } from "../../../api/employee/employee-api";
import useDevices from "../hooks/useDevices";
import { formatToLongDate } from "../../../utils/formatter";


export default function NewDevicesList() {
  const { isPending, data, refetch } = useDevices();

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
      <Stack py={ 6 } justifyContent="center" alignItems="center">
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Stack px={ 3 } pt={ 4 }>
      <Typography variant="h6" fontWeight={ 500 } pb={ 3 }>
        New Devices List
      </Typography>

      <TableContainer component={ Paper } variant="outlined">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell style={ { whiteSpace: "nowrap" } }>Employee ID</TableCell>
              <TableCell style={ { whiteSpace: "nowrap" } }>Employee Name</TableCell>
              <TableCell style={ { whiteSpace: "nowrap" } }>Designation</TableCell>
              <TableCell>Request Time</TableCell>
              <TableCell>Device Name</TableCell>
              <TableCell>Device Id</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { data?.deviceList?.map((device, index: number) => (
              <TableRow
                key={ index }
                sx={ { "&:last-child td, &:last-child th": { border: 0 } } }
              >
                <TableCell scope="row">
                  <Typography variant="body2" display="flex">
                    { device.empName ?? "No Id" }
                  </Typography>
                </TableCell>
                <TableCell scope="row">
                  <Typography variant="body2" display="flex">
                    { device.name ?? "No Name" }
                  </Typography>
                </TableCell>
                <TableCell scope="row">
                  <Typography variant="body2" display="flex">
                    { device.designation }
                  </Typography>
                </TableCell>
                <TableCell scope="row">
                  <Typography variant="body2" display="flex">
                    { formatToLongDate(device.date) }
                  </Typography>
                </TableCell>
                <TableCell component="th" scope="row">
                  <Typography variant="body2" display="flex" gap={ 2 }>
                    <PhoneAndroid fontSize="small" color="action" />
                    { device?.deviceName ?? "No Device Name" }
                  </Typography>
                </TableCell>
                <TableCell scope="row">
                  <Typography variant="body2" color="GrayText">
                    { device.uuid }
                  </Typography>
                </TableCell>{ " " }
                <TableCell
                  scope="row"
                  sx={ {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  } }
                >
                  { device?.status === 1 ? (
                    <Tooltip title="Active Device">
                      <Typography
                        variant="caption"
                        textTransform="uppercase"
                        fontWeight={ 500 }
                        color="success.main"
                      >
                        Active
                      </Typography>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Enable this device">
                      { isDeviceEnableMutate ? (
                        <CircularProgress color="info" size={ 20 } />
                      ) : (
                        <Switch
                          onChange={ (event) =>
                            deviceHandler(event, device?.id, device?.empCode)
                          }
                        />
                      ) }
                    </Tooltip>
                  ) }
                </TableCell>
              </TableRow>
            )) }
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
