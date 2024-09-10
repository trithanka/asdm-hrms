import { Add } from "@mui/icons-material";
import HailIcon from "@mui/icons-material/Hail";
import {
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import EmployeesTable from "../components/tables/employees-table";
import useEmployees from "../hooks/useEmployees";
import BackButton from "../../../components/backbutton";

export default function EmployeesPage() {
  const { isPending, data } = useEmployees();

  if (isPending) {
    return (
      <Stack
        component="section"
        justifyContent="center"
        alignItems="center"
        height="40vh"
      >
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Paper
      component="section"
      variant="outlined"
      sx={ {
        p: 3,
      } }
    >
      <Typography textAlign={ "center" } fontSize={ 20 } fontWeight={ 500 }>Total Employee List</Typography>
      <Stack alignItems={ "flex-end" }>
        <BackButton />
      </Stack>
      <Stack alignItems="flex-start" pb={ 2 }>
        <Button
          // variant="contained"
          startIcon={ <Add /> }
          component={ Link }
          to="register"
        >
          Add Employee
        </Button>
      </Stack>
      { data?.employeeList && data?.employeeList.length === 0 && (
        <Stack
          alignItems="center"
          justifyContent="center"
          gap={ 2 }
          py={ 6 }
          height="80vh"
        >
          <HailIcon fontSize="large" color="disabled" />
          <Typography variant="body2" color="text.secondary">
            No Employees Found
          </Typography>
        </Stack>
      ) }

      { isPending ? (
        <p>Loading...</p>
      ) : (
        <EmployeesTable data={ data?.employeeList! } />
      ) }
    </Paper>
  );
}
