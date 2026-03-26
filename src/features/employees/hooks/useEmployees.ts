import { useQuery } from "@tanstack/react-query";
import QUERY_KEYS from "../../../data/queryKeys";
import { fetchEmployees } from "../../../api/employee/employee-api";

export default function useEmployees(page: number = 0, limit: number = 10, search: string = "") {
  return useQuery({
    queryKey: [QUERY_KEYS.EMPLOYEES, page, limit, search],
    queryFn: () => fetchEmployees(page, limit, search),
    meta: {
      errorMessage: "Failed to fetch employees",
    },
  });
}
