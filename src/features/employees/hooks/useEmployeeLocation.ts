import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEmployeeLocation } from "../../../api/employee/employee-api";
import QUERY_KEYS from "../../../data/queryKeys";
import toast from "react-hot-toast";

export default function useEmployeeLocation(id: number) {
  const query = useQuery({
    queryKey: [QUERY_KEYS.LOCATIONS, id],
    queryFn: () => fetchEmployeeLocation(id),
    meta: {
      errorMessage: "Failed to fetch locations",
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
