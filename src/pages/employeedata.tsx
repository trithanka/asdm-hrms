import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { fetchDepartmentData } from "../api/dashboard/dashboard-api";
import EmployeeDataTable from "../features/employees/components/tables/employeedata-table";
import BackButton from "../components/backbutton";
import { Box } from "@mui/material";

export default function Employeedata() {
  const [searchParams] = useSearchParams();

  const departmentId = searchParams.get("department");
  const designationId = searchParams.get("designation");

  const { data, isLoading } = useQuery({
    queryKey: [`employeedata${departmentId || designationId}`],
    queryFn: () =>
      fetchDepartmentData({
        postParam: {
          departmentId: departmentId || "",
          designationId: designationId || "",
        },
      }),
  });

  return isLoading ? (
    <p>Loading...</p>
  ) : data.data ? (
    <div>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <h1>Employees Data</h1>
        <BackButton />
      </Box>
      <EmployeeDataTable data={data?.data} />
    </div>
  ) : (
    <p>Something went wrong</p>
  );
}
