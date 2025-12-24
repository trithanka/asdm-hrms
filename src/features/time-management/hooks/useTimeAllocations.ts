import { useQuery } from "@tanstack/react-query";
import { fetchTimeAllocations } from "../../../api/time-management/api";

export const useTimeAllocations = (
    page: number = 0,
    limit: number = 10,
    search: string = ""
) => {
    return useQuery({
        queryKey: ["time-allocations", page, limit, search],
        queryFn: () => fetchTimeAllocations(page, limit, search),
    });
};
