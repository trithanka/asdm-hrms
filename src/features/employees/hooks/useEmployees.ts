import { useQuery } from "@tanstack/react-query";
import QUERY_KEYS from "../../../data/queryKeys";
import { fetchEmployees } from "../../../api/employee/employee-api";

export default function useEmployees() {
  return useQuery({
    queryKey: [QUERY_KEYS.EMPLOYEES],
    queryFn: fetchEmployees,
    meta: {
      errorMessage: "Failed to fetch employees",
    },
  });
}
