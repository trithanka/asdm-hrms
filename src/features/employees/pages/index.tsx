import { Add } from "@mui/icons-material";

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
import { useState } from "react";

export default function EmployeesPage() {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const { isPending, data } = useEmployees(page, limit, search);

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
      sx={{
        p: 3,
      }}
    >
      {/* <Stack alignItems={ "flex-end" }>
        <BackButton />
        </Stack> */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" pb={2}>
        <Typography textAlign={"left"} fontSize={20} fontWeight={500}>Total Employee List</Typography>
        <Button
          // variant="contained"
          startIcon={<Add />}
          component={Link}
          to="register"
        >
          Add Employee
        </Button>
      </Stack>
      {/* {data?.employeeList && data?.employeeList.length === 0 && (
        <Stack
          alignItems="center"
          justifyContent="center"
          gap={2}
          py={6}
          height="80vh"
        >
          <HailIcon fontSize="large" color="disabled" />
          <Typography variant="body2" color="text.secondary">
            No Employees Found
          </Typography>
        </Stack>
      )} */}

      {isPending ? (
        <p>Loading...</p>
      ) : (
        <EmployeesTable 
          data={data?.employeeList!} 
          total={data?.total}
          page={page}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          search={search}
          setSearch={setSearch}
        />
      )}
    </Paper>
  );
}
