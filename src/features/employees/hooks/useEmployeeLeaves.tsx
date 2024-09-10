import { useQuery } from "@tanstack/react-query";
import { fetchEmployeeLeaves } from "../../../api/employee/employee-api";
import QUERY_KEYS from "../../../data/queryKeys";
import React from "react";
import toast from "react-hot-toast";

export default function useEmployeeLeaves(id: number) {
  const query = useQuery({
    queryFn: () => fetchEmployeeLeaves(id),
    queryKey: [QUERY_KEYS.EMPLOYEE_LEAVES, id],
    meta: {
      errorMessage: "Failed to fetch leaves",
    },
  });

  React.useEffect(() => {
    if (query?.isSuccess) {
      if (query?.data?.status !== "success") {
        toast?.error(query?.data?.message ?? "Something went wrong!");
      }
    }
  }, [query.isSuccess]);

  return query;
}
