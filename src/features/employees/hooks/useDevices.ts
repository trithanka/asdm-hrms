import { useQuery } from "@tanstack/react-query";
import QUERY_KEYS from "../../../data/queryKeys";
import { fetchDevices } from "../../../api/employee/employee-api";

export default function useDevices(employeeId?: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.DEVICES],
    queryFn: () => fetchDevices(employeeId),
    meta: {
      errorMessage: "Failed to fetch associated devices",
    },
  });
}
