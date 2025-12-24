import { useQuery } from "@tanstack/react-query";
import QUERY_KEYS from "../../../data/queryKeys";
import { fetchDevices } from "../../../api/employee/employee-api";

export default function useDevices(
  employeeId?: number,
  deviceStatus?: string,
  page?: number,
  limit?: number
) {

  return useQuery({
    queryKey: [QUERY_KEYS.DEVICES, employeeId, deviceStatus, page, limit],
    queryFn: () => fetchDevices(employeeId, deviceStatus, page, limit),
    meta: {
      errorMessage: "Failed to fetch associated devices",
    },
    // keepPreviousData: true, // Useful for pagination, but checking if this version of react-query supports it directly or via placeholderData
  });
}
