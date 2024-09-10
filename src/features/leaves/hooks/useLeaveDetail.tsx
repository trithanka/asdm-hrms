import { useQuery } from "@tanstack/react-query";
import QUERY_KEYS from "../../../data/queryKeys";
import { fetchLeaveDetail } from "../../../api/leave/leave-api";

export default function useLeaveDetail(
  id: string | number,
  leave: "CL" | "ML" | "PL",
  tab: any,
  empCode?: any,
  appliedDate?: string
) {
  return useQuery({
    queryKey: [QUERY_KEYS.LEAVE_DETAIL, id, tab],
    queryFn: () => fetchLeaveDetail(id, leave, tab, empCode, appliedDate),
    meta: {
      errorMessage: "Failed to fetch leave detail",
    },
  });
}
