import MoreVertIcon from "@mui/icons-material/MoreVert";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { postReleseEmployee } from "../../../../api/employee/employee-api";
import { IEmployee } from "../../../../api/employee/employee-types";
import Drawer from "../../../../components/ui/drawer";
import Input from "../../../../components/ui/input";
import QUERY_KEYS from "../../../../data/queryKeys";
import AttendanceList from "../attendance-list";
import DevicesList from "../devices-list";
import LocationList from "../location-list";

interface Props {
  employee: IEmployee;
  id: number;
}

type FormValues = {
  reason: string;
  release_date: string;
};

export default function EmployeesTableAction(props: Props) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { handleSubmit, control } = useForm<FormValues>({
    defaultValues: {
      reason: "",
      release_date: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: postReleseEmployee,
    onSuccess(data) {
      if (data?.status !== "success") {
        toast?.error(data?.message ?? "Release Successful");
        return;
      }

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EMPLOYEES],
      });
      closeReleaseDialog();
      toast.success(data?.message ?? "Release Successful");
    },
    onError(error) {
      toast?.error(error?.message ?? "Something went wrong!");
    },
  });

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openList, setOpenList] = React.useState(false);
  const [openRelease, setOpenRelease] = React.useState(false);

  const [openAttendance, setOpenAttendance] = React.useState(false);
  const [openLocation, setOpenLocation] = React.useState(false);

  const openAttendanceList = () => setOpenAttendance(true);
  const closeAttendanceList = () => setOpenAttendance(false);

  const openDeviceList = () => setOpenList(true);
  const closeDeviceList = () => setOpenList(false);


  const openReleaseDialog = () => setOpenRelease(true);
  const closeReleaseDialog = () => setOpenRelease(false);

  const openLocationList = () => setOpenLocation(true);
  const closeLocationList = () => setOpenLocation(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onSubmit = (data: FormValues) => {
    if (data.reason === "") {
      toast.error("Reason is empty");
      return;
    } else if (data.release_date === "") {
      toast.error("Release Date is empty")
    }

    mutate({
      id: props?.id,
      reason: data.reason,
      release_date: data.release_date,
    });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function redirectToAttendance() {
    handleClose();
    openAttendanceList();
  }

  function redirectToLeaves() {
    handleClose();
    navigate({
      pathname: "leaves",
      search: `?empId=${props?.id}`,
    });
  }

  function redirectToView() {
    handleClose();
    navigate(`/employees/${props.id}`);
  }


  function showDevices() {
    handleClose();
    openDeviceList();
  }

  function releaseHandler() {
    handleClose();
    openReleaseDialog();
  }

  function handleLocation() {
    handleClose();
    openLocationList();
  }

  const open = Boolean(anchorEl);
  return (
    <>
      <Tooltip title="More">
        <IconButton
          aria-controls={ open ? "basic-menu" : undefined }
          aria-haspopup="true"
          aria-expanded={ open ? "true" : undefined }
          onClick={ handleClick }
        >
          <MoreVertIcon color="primary" />
        </IconButton>
      </Tooltip>

      <Menu
        id="basic-menu"
        anchorEl={ anchorEl }
        open={ open }
        anchorOrigin={ {
          vertical: "bottom",
          horizontal: "right",
        } }
        transformOrigin={ {
          vertical: "top",
          horizontal: "right",
        } }
        elevation={ 2 }
        onClose={ handleClose }
        MenuListProps={ {
          "aria-labelledby": "basic-button",
        } }
      >
        <MenuItem onClick={ redirectToView }>View & Edit</MenuItem>
        <MenuItem onClick={ showDevices }>Devices</MenuItem>
        <MenuItem onClick={ redirectToLeaves }>Leaves</MenuItem>
        <MenuItem onClick={ handleLocation }>Location</MenuItem>
        <MenuItem onClick={ redirectToAttendance }>Attendance</MenuItem>
        <MenuItem onClick={ releaseHandler }>Release</MenuItem>
      </Menu>

      {/* Devices */ }
      <Drawer open={ openList } handleDrawerClose={ closeDeviceList }>
        <DevicesList id={ props?.id } />
      </Drawer>

      {/* Attendance */ }
      <Drawer open={ openAttendance } handleDrawerClose={ closeAttendanceList }>
        <AttendanceList id={ props?.id } />
      </Drawer>

      {/* Location */ }
      <Drawer open={ openLocation } handleDrawerClose={ closeLocationList }>
        <LocationList id={ props?.id } />
      </Drawer>

      {/* Release */ }
      <Dialog
        open={ openRelease }
        onClose={ closeReleaseDialog }
        component="form"
        onSubmit={ handleSubmit(onSubmit) }
      >
        <DialogTitle>Release Employee</DialogTitle>
        <DialogContent>
          <DialogContentText paddingBottom={ 3 }>
            Are you sure you want to release
            <Typography
              component="span"
              fontWeight={ 500 }
              color="text.primary"
              textTransform="uppercase"
              px={ 1 }
            >
              { props?.employee?.firstName } { props?.employee?.middleName }{ " " }
              { props?.employee?.lastName }
            </Typography>
            with employe id
            <Typography
              component="span"
              fontWeight={ 500 }
              color="text.primary"
              textTransform="uppercase"
              px={ 1 }
            >
              { props?.employee?.employeeId }
            </Typography>
            ?
            <Grid item pt={ 2 }>
              <Input control={ control }
                label="Release Date"
                name="release_date"
                placeholder=""
                autoFocus
                type="date" />
            </Grid>
          </DialogContentText>

          <Input
            control={ control }
            label="State Reason"
            name="reason"
            placeholder=""
            fullWidth
            autoFocus
            multiline
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={ closeReleaseDialog }>Cancel</Button>
          <LoadingButton loading={ isPending } type="submit">
            Confirm
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
