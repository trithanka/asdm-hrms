import { useQuery } from "@tanstack/react-query";
import React from "react";
import QUERY_KEYS from "../../../data/queryKeys";
import { fetchMonthlyAttendance } from "../../../api/dashboard/dashboard-api";
import toast from "react-hot-toast";

export default function useFetchMonthlyAttendance(month: number) {
  const query = useQuery({
    queryKey: [QUERY_KEYS.MONTHLY_ATTENDANCE],
    queryFn: () => fetchMonthlyAttendance(month),
    meta: {
      errorMessage: "Failed to fetch dashboard data",
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
