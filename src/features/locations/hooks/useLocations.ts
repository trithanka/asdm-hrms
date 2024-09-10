import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import QUERY_KEYS from "../../../data/queryKeys";
import { fetchLocations } from "../../../api/location/location-api";
import toast from "react-hot-toast";

export default function useLocations() {
  const query = useQuery({
    queryKey: [QUERY_KEYS.LOCATIONS],
    queryFn: fetchLocations,
    meta: {
      errorMessage: "Failed to fetch locations",
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
