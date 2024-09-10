import { LeaveType } from "../../../api/leave/leave-types";
import QUERY_KEYS from "../../../data/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { fetchLeaves } from "../../../api/leave/leave-api";

export default function useLeaves(type: LeaveType) {
  return useQuery({
    queryKey: [QUERY_KEYS.LEAVES, type],
    queryFn: () => fetchLeaves(type),
    meta: {
      errorMessage: `Failed to fetch ${type} leaves`,
    },
  });
}
