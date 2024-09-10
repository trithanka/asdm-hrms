import { useQuery } from "@tanstack/react-query";
import React from "react";
import QUERY_KEYS from "../../../data/queryKeys";
import { fetchEmployeesCount } from "../../../api/dashboard/dashboard-api";
import toast from "react-hot-toast";

export default function useFetchEmployeeCount() {
  const query = useQuery({
    queryKey: [QUERY_KEYS.EMPLOYEE_COUNT],
    queryFn: fetchEmployeesCount,
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
