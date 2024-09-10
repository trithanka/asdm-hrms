import { useQuery } from "@tanstack/react-query";
import { fetchAttendance } from "../../../api/employee/employee-api";
import QUERY_KEYS from "../../../data/queryKeys";

export default function useAttendance(id: string, month: number, year: string) {
  return useQuery({
    queryKey: [QUERY_KEYS],
    queryFn: () => fetchAttendance(id, month, year),
  });
}
