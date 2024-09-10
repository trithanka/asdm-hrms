import EditLocationAltIcon from "@mui/icons-material/EditLocationAlt";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import {
  Autocomplete,
  CircularProgress,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import * as React from "react";
import toast from "react-hot-toast";
import { associateEmployeeLocation } from "../../../api/location/location-api";
import { ILocation } from "../../../api/location/location-types";
import { formatToLongDate } from "../../../utils/formatter";
import useLocations from "../../locations/hooks/useLocations";
import useEmployeeLocation from "../hooks/useEmployeeLocation";

interface Props {
  id: number;
}

export default function LocationList(props: Props) {
  const [isEditMode, setIsEditMode] = React.useState(false);

  const { data, isPending, refetch } = useEmployeeLocation(props.id);
  const { data: locations, isPending: isLocationsPending } = useLocations();
  const { mutate, isPending: isMutating } = useMutation({
    mutationFn: associateEmployeeLocation,
    onSuccess(data) {
      if (data?.status === "success") {
        toast.success("Location Changed");
        refetch();
        toggleEditMode();
        return;
      }
      toast.error(data?.message ?? "Location change failure!");
    },
    onError(error) {
      toast.error(error?.message ?? "Location change failure!");
    },
  });

  function toggleEditMode() {
    setIsEditMode((prev) => !prev);
  }

  function changeHandler(location: ILocation) {
    mutate({
      id: props.id,
      locationId: location.id,
    });
  }

  if (isPending && isLocationsPending) {
    return (
      <Stack component="section" width={600} p={3}>
        <Stack mb={6} gap={1}>
          <Skeleton variant="text" width={200} />
          <Skeleton variant="text" width={500} />
        </Stack>

        <Skeleton variant="text" width={200} sx={{ mb: 2 }} />
        <Skeleton variant="text" width={500} />
        <Skeleton variant="text" width={500} />
        <Skeleton variant="text" width={500} />
        <Skeleton variant="text" width={500} />
        <Skeleton variant="text" width={500} />
      </Stack>
    );
  }

  return (
    <>
      <Stack width={600} p={3}>
        <Stack mb={6} gap={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body1" fontWeight={500} color="primary.main">
              Active Location
            </Typography>

            {isMutating ? (
              <CircularProgress size={20} />
            ) : (
              <Tooltip title="Change Active Location">
                <IconButton onClick={toggleEditMode}>
                  <EditLocationAltIcon />
                </IconButton>
              </Tooltip>
            )}
          </Stack>

          {isEditMode ? (
            <Stack py={1}>
              {locations?.locationList && data?.locationActive && (
                <Autocomplete
                  fullWidth={true}
                  disablePortal
                  id="combo-box-demo"
                  options={locations?.locationList}
                  value={data?.locationActive}
                  onChange={(_, newValue) => changeHandler(newValue!)}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => <TextField {...params} />}
                />
              )}
            </Stack>
          ) : (
            <Typography
              variant="body2"
              display="flex"
              alignItems="center"
              gap={1}
              color="text.secondary"
            >
              <FiberManualRecordIcon color="success" fontSize="small" />
              {data?.locationActive?.name}
            </Typography>
          )}
        </Stack>

        <Typography
          variant="body1"
          fontWeight={500}
          color="primary.main"
          pb={2}
        >
          Location History
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Location Name</TableCell>
                <TableCell>Registered On</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.locationHistory?.map((row, id) => (
                <TableRow
                  key={id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Typography variant="body2" color="text.secondary">
                      {row.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatToLongDate(row.date)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </>
  );
}
