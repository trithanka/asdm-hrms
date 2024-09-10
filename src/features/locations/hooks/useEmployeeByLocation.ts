import { useQuery } from "@tanstack/react-query";
import React from "react";
import QUERY_KEYS from "../../../data/queryKeys";
import { fetchEmployeeByLocation } from "../../../api/location/location-api";
import toast from "react-hot-toast";

export default function useEmployeeByLocation(id: number) {
  const query = useQuery({
    queryKey: [QUERY_KEYS.EMPLOYEE_BY_LOCATION, id],
    queryFn: () => fetchEmployeeByLocation(id),
    meta: {
      errorMessage: "Failed to fetch employee",
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
