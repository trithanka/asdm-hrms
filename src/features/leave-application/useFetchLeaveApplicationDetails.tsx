import { useQuery } from "@tanstack/react-query";
import React from "react";
import QUERY_KEYS from "../../data/queryKeys";
import toast from "react-hot-toast";
import { leaveApplicationDetails } from "../../api/leave/leave-api";

export default function useFetchLeaveApplicationDetails(applicationId: any) {
  const query = useQuery({
    queryKey: [QUERY_KEYS.LEAVE_APPLICATION_DETAILS, applicationId],
    queryFn: () => leaveApplicationDetails(applicationId),
    meta: {
      errorMessage: "Failed to fetch details",
    },
  });

  React.useEffect(() => {
    if (query?.isSuccess) {
      if (query?.data?.status !== "success" && query?.data?.status) {
        toast?.error(query?.data?.message ?? "Something went wrong!");
      }
    }
  }, [query.isSuccess]);

  return query;
}
