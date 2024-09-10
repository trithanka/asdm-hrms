import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import useEmployeeByLocation from "../hooks/useEmployeeByLocation";
import ErrorIcon from "@mui/icons-material/Error";

interface Props {
  id: number;
}

export default function EmployeeByLocationList(props: Props) {
  const { data, isPending } = useEmployeeByLocation(props.id);

  if (isPending) {
    return <div>loading...</div>;
  }

  return (
    <Stack width={600} p={3}>
      {data?.getEmployeesByLocation &&
      data?.getEmployeesByLocation?.length > 0 ? (
        <>
          <Typography fontWeight={500} variant="body2" pb={2}>
            Associated Employee
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table aria-label="employee by location table">
              <TableHead>
                <TableRow>
                  <TableCell>Employee Name</TableCell>
                  <TableCell>Employee ID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.getEmployeesByLocation?.map((row, index: number) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell>{row.employeeCode}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <Stack alignItems="center" justifyContent="center" py={6}>
          <ErrorIcon color="action" />
          <Typography variant="subtitle2" pt={1}>
            No Employee Found
          </Typography>
          <Typography variant="caption" color="text.secondary">
            No employees are associated with this location
          </Typography>
        </Stack>
      )}
    </Stack>
  );
}
