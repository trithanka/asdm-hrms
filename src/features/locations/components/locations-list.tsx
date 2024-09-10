import NearMeDisabledRoundedIcon from "@mui/icons-material/NearMeDisabledRounded";
import {
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import useLocations from "../hooks/useLocations";
import Drawer from "../../../components/ui/drawer";
import EmployeeByLocationList from "./employee-by-location-list";
import React from "react";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

export default function LocationsList() {
  const [openEmployee, setOpenEmployee] = React.useState(false);
  const [activeId, setActiveId] = React.useState<number>();

  const { data, isPending, isError } = useLocations();

  function openEmployeeList(id: number) {
    setActiveId(id);
    setOpenEmployee(true);
  }

  function closeEmployeeList() {
    setOpenEmployee(false);
  }

  if (isPending) {
    return (
      <Stack height="80vh" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <>
      { isError || (!isPending && data?.locationList?.length === 0) ? (
        <Stack py={ 8 } alignItems="center" justifyContent="center">
          <NearMeDisabledRoundedIcon color="action" />
          <Typography color="text.primary" variant="subtitle2" pt={ 1 }>
            No Locations Found
          </Typography>
          <Typography color="text.secondary" variant="caption">
            Location data could not be fetched or data is empty
          </Typography>
        </Stack>
      ) : (
        <>
          <TableContainer component={ Paper } variant="outlined" sx={ { mt: 8 } }>
            <Table sx={ { minWidth: 650 } } aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Total Employees</TableCell>
                  <TableCell>Geofencing Point 1</TableCell>
                  <TableCell>Geofencing Point 2</TableCell>
                  <TableCell>Geofencing Point 3</TableCell>
                  <TableCell>Geofencing Point 4</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { data?.locationList.map((row) => (
                  <TableRow
                    key={ row.id }
                    sx={ { "&:last-child td, &:last-child th": { border: 0 } } }
                  >
                    <TableCell component="th" scope="row">
                      { row.id }
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        { row.shortName }
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        { row.name }
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        { row.totalEmp }
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        Lattitude { row.lat1 }
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Longitude { row.long1 }
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        Lattitude { row.lat2 }
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Longitude { row.long2 }
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        Lattitude { row.lat3 }
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Longitude { row.long3 }
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        Lattitude { row.lat4 }
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Longitude { row.long4 }
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Tooltip title="Employees Associated">
                        <IconButton
                          onClick={ () => openEmployeeList(row.id) }
                          color="info"
                        >
                          <PeopleAltIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )) }
              </TableBody>
            </Table>
          </TableContainer>

          <Drawer open={ openEmployee } handleDrawerClose={ closeEmployeeList }>
            <EmployeeByLocationList id={ activeId! } />
          </Drawer>
        </>
      ) }
    </>
  );
}
