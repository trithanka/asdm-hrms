import { useQuery } from "@tanstack/react-query";
import { fetchDashboard } from "../../../api/dashboard/dashboard-api";
import QUERY_KEYS from "../../../data/queryKeys";
import toast from "react-hot-toast";
import React from "react";

export default function useFetchDashboard() {
  const query = useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD],
    queryFn: fetchDashboard,
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
